"""4-agent dispatcher for os2-server.

Manages dispatching Claude 2, Codex, and Gemini for ticket execution.
Monitors completion and sends Telegram notifications.
"""
from __future__ import annotations

import asyncio
import logging
import os
import subprocess
import threading
from pathlib import Path

from .ssot import get_recent_logs, read_queue, update_ticket_status

logger = logging.getLogger(__name__)


class Dispatcher:
    """Dispatches builder agents for ticket execution."""

    def __init__(self, config: dict, paths: dict, notify_callback=None):
        """
        notify_callback: async callable(message: str) to send TG notifications.
        """
        self.config = config
        self.paths = paths
        self.notify = notify_callback
        self.agent_configs = config.get("agents", {})
        self._running: dict[str, subprocess.Popen] = {}  # ticket_id -> process

    # ── Public API ──────────────────────────────────────────────────────────

    def dispatch(self, ticket_id: str) -> tuple[bool, str]:
        """
        Dispatch a single ticket to its assigned agent.
        Returns (success, message).
        """
        data = read_queue(self.paths["queue"])
        ticket = next((t for t in data.get("tickets", []) if t.get("id") == ticket_id), None)

        if not ticket:
            return False, f"Ticket `{ticket_id}` not found in queue."

        status = ticket.get("status")
        if status not in ("todo",):
            return False, f"Ticket `{ticket_id}` is `{status}`, not `todo`. Cannot dispatch."

        owner = ticket.get("owner")
        if owner not in self.agent_configs:
            return False, f"Unknown owner `{owner}` for ticket `{ticket_id}`."

        # Fallback: if agent not available, use fallback agent
        owner = self._resolve_agent(owner)

        # Check dependencies
        deps = ticket.get("deps", [])
        if deps:
            blocked_by = self._check_deps(data, deps)
            if blocked_by:
                return False, f"Ticket `{ticket_id}` blocked by: {', '.join(blocked_by)}"

        # Check concurrent limit
        max_concurrent = self.config.get("dispatch", {}).get("max_concurrent", 2)
        if len(self._running) >= max_concurrent:
            return False, f"At capacity ({max_concurrent} agents running). Wait for completion."

        # Check scope overlap (if scope_check enabled)
        if self.config.get("dispatch", {}).get("scope_check", True):
            conflict = self._check_scope_conflict(ticket, data)
            if conflict:
                return False, f"Ticket `{ticket_id}` file scope conflicts with running ticket `{conflict}`."

        # Dispatch
        update_ticket_status(self.paths["queue"], ticket_id, "doing")
        thread = threading.Thread(
            target=self._run_agent,
            args=(ticket,),
            daemon=True,
        )
        thread.start()
        return True, f"Dispatched `{ticket_id}` to {owner}."

    def dispatch_all_ready(self) -> list[tuple[str, str]]:
        """
        Dispatch all tickets that are ready (todo, deps satisfied).
        Returns list of (ticket_id, message).
        """
        data = read_queue(self.paths["queue"])
        results = []
        for ticket in data.get("tickets", []):
            if ticket.get("status") != "todo":
                continue
            ok, msg = self.dispatch(ticket["id"])
            results.append((ticket["id"], msg))
        return results

    def get_running(self) -> list[str]:
        """Return list of currently running ticket IDs."""
        return list(self._running.keys())

    # ── Internal ─────────────────────────────────────────────────────────────

    def _is_agent_available(self, agent_name: str) -> bool:
        """Check if an agent is configured and available to run."""
        agent_cfg = self.agent_configs.get(agent_name, {})
        config_dir = agent_cfg.get("config_dir")
        if config_dir:
            # Agent requires a config directory (e.g. .claude-b) — check credentials exist
            creds = Path(config_dir) / ".credentials.json"
            if not creds.exists():
                logger.info(f"{agent_name} not available: {creds} not found")
                return False
        return True

    def _resolve_agent(self, owner: str) -> str:
        """Resolve agent, applying fallback if the primary agent is not available."""
        if self._is_agent_available(owner):
            return owner
        fallback = self.agent_configs.get(owner, {}).get("fallback")
        if fallback:
            logger.warning(f"{owner} not available — falling back to {fallback}")
            return fallback
        return owner

    def _check_deps(self, data: dict, deps: list[str]) -> list[str]:
        """Return list of unfinished dependency ticket IDs."""
        tickets_by_id = {t["id"]: t for t in data.get("tickets", [])}
        return [d for d in deps if tickets_by_id.get(d, {}).get("status") != "done"]

    def _check_scope_conflict(self, ticket: dict, data: dict) -> str | None:
        """Return conflicting ticket_id if file scope overlaps with a running ticket."""
        my_files = set(ticket.get("files", []))
        for running_id in self._running:
            running_ticket = next(
                (t for t in data.get("tickets", []) if t.get("id") == running_id), None
            )
            if not running_ticket:
                continue
            their_files = set(running_ticket.get("files", []))
            if my_files & their_files:
                return running_id
        return None

    def _run_agent(self, ticket: dict) -> None:
        """Run an agent for a ticket in a background thread."""
        ticket_id = ticket["id"]
        owner = ticket["owner"]
        agent_cfg = self.agent_configs.get(owner, {})
        mode = agent_cfg.get("mode", "subprocess")

        logger.info(f"Starting {owner} for {ticket_id} (mode: {mode})")
        self._running[ticket_id] = None  # Mark as running

        try:
            if mode == "subprocess":
                success = self._run_subprocess(ticket, agent_cfg)
            elif mode == "tmux":
                success = self._run_tmux(ticket, agent_cfg)
            elif mode == "pipe":
                success = self._run_pipe(ticket, agent_cfg)
            else:
                logger.error(f"Unknown mode {mode} for {owner}")
                success = False

            # Update status based on result
            new_status = "done" if success else "blocked"
            update_ticket_status(self.paths["queue"], ticket_id, new_status)

            # Read session log and notify
            log_summary = self._get_agent_log(owner, ticket_id)
            if success:
                msg = f"✅ `{ticket_id}` completed by {owner}\n{log_summary}"
            else:
                msg = f"❌ `{ticket_id}` failed (marked blocked)\n{log_summary}"

            if self.notify:
                asyncio.run(self._send_notify(msg))

        except Exception as e:
            logger.exception(f"Error running {owner} for {ticket_id}: {e}")
            update_ticket_status(self.paths["queue"], ticket_id, "blocked")
            if self.notify:
                asyncio.run(self._send_notify(f"❌ `{ticket_id}` error: {e}"))
        finally:
            self._running.pop(ticket_id, None)

    def _build_prompt(self, ticket: dict, agent_cfg: dict) -> str:
        """Build the prompt string for an agent."""
        config_dir = agent_cfg.get("config_dir", "")
        instruction_file = ""
        if config_dir:
            md_path = Path(config_dir) / "CLAUDE.md"
            if md_path.exists():
                instruction_file = md_path.read_text()[:2000]

        return f"""Read your instruction file and the devos/ SSOT files, then work on this ticket:

{instruction_file}

Ticket:
```yaml
{self._ticket_to_yaml(ticket)}
```

After completing the work:
1. Write a session log to devos/logs/
2. Output the 4-line handoff format
"""

    def _ticket_to_yaml(self, ticket: dict) -> str:
        import yaml
        return yaml.dump(ticket, allow_unicode=True)

    def _run_subprocess(self, ticket: dict, agent_cfg: dict) -> bool:
        """Run agent as subprocess (Claude 2 or Codex)."""
        command = agent_cfg.get("command", ["claude", "-p"])
        timeout = agent_cfg.get("timeout", 600)
        env = {**os.environ, **agent_cfg.get("env", {})}

        # Set config dir for Claude 2
        config_dir = agent_cfg.get("config_dir")
        if config_dir:
            env["CLAUDE_CONFIG_DIR"] = config_dir

        prompt = self._build_prompt(ticket, agent_cfg)

        try:
            result = subprocess.run(
                command,
                input=prompt,
                capture_output=True,
                text=True,
                timeout=timeout,
                env=env,
                cwd=str(self.paths["root"]),
            )
            if result.returncode != 0:
                logger.error(f"Agent failed: {result.stderr[:500]}")
                return False
            return True
        except subprocess.TimeoutExpired:
            logger.error(f"Agent timed out after {timeout}s")
            return False

    def _run_pipe(self, ticket: dict, agent_cfg: dict) -> bool:
        """Run agent in pipe mode (same as subprocess for Claude)."""
        return self._run_subprocess(ticket, agent_cfg)

    def _run_tmux(self, ticket: dict, agent_cfg: dict) -> bool:
        """Run agent via tmux session (Gemini)."""
        import time
        tmux_cfg = agent_cfg.get("tmux", {})
        session = tmux_cfg.get("session", "os2")
        pane = tmux_cfg.get("pane", "gemini")
        timeout = agent_cfg.get("timeout", 600)
        completion_patterns = tmux_cfg.get("completion_patterns", ["^Done:", "^Block:"])
        poll_interval = tmux_cfg.get("poll_interval", 2.0)

        prompt = self._build_prompt(ticket, agent_cfg)

        # Send prompt to tmux pane
        target = f"{session}:{pane}"
        escaped = prompt.replace("'", "'\\''")
        subprocess.run(["tmux", "send-keys", "-t", target, escaped, "Enter"], check=True)

        # Poll for completion
        start = time.time()
        while time.time() - start < timeout:
            time.sleep(poll_interval)
            result = subprocess.run(
                ["tmux", "capture-pane", "-t", target, "-p", "-S", "-50"],
                capture_output=True,
                text=True,
            )
            output = result.stdout
            for pattern in completion_patterns:
                import re
                if re.search(pattern, output, re.MULTILINE):
                    return True
        return False

    def _get_agent_log(self, owner: str, ticket_id: str) -> str:
        """Get summary from the agent's session log."""
        import re
        logs_path = self.paths["logs"]
        agent_name = owner.lower().replace("1", "1").replace("2", "2")
        # Find most recent log for this agent/ticket
        recent = get_recent_logs(logs_path, limit=10)
        for log_file in recent:
            if agent_name in log_file.name.lower() and ticket_id in log_file.name:
                content = log_file.read_text()
                match = re.search(r"## Summary\n(.*?)(?=\n##|\Z)", content, re.DOTALL)
                if match:
                    return match.group(1).strip()[:200]
        return ""

    async def _send_notify(self, message: str) -> None:
        """Send notification via TG callback."""
        if self.notify:
            try:
                await self.notify(message)
            except Exception as e:
                logger.error(f"Failed to send notification: {e}")
