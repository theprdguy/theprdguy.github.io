"""Telegram bot handlers for os2-server.

Commands:
  /status   — PROJECT_STATE.md summary (no LLM)
  /queue    — QUEUE.yaml ticket list (no LLM)
  /logs     — Recent session logs (no LLM)
  /approve  — Approve pending plan → dispatch
  /reject   — Reject plan with reason
  /prd      — Submit PRD → Claude 1 pipe mode
  /ask      — Free question to Claude 1
  /dispatch — Manual dispatch a ticket
  free text — Forward to Claude 1
"""
from __future__ import annotations

import logging

from telegram import Update
from telegram.constants import ParseMode
from telegram.ext import Application, CommandHandler, ContextTypes, MessageHandler, filters

from .approval import ApprovalManager
from .dispatcher import Dispatcher
from .planner import extract_plan_summary, extract_tickets_from_response, invoke_claude1
from .ssot import format_logs_summary, format_queue_summary, format_status_summary

logger = logging.getLogger(__name__)


class OS2Bot:
    """Telegram bot for os2 remote management."""

    def __init__(self, token: str, allowed_user: int | None, paths: dict, config: dict):
        self.token = token
        self.allowed_user = allowed_user
        self.paths = paths
        self.config = config
        self.app: Application | None = None
        self.dispatcher: Dispatcher | None = None
        self.approval: ApprovalManager | None = None

    def setup(self, dispatcher: Dispatcher, approval: ApprovalManager) -> None:
        """Inject dependencies."""
        self.dispatcher = dispatcher
        self.approval = approval

    def _auth(self, update: Update) -> bool:
        """Check if user is allowed."""
        if self.allowed_user is None:
            return True
        return update.effective_user.id == self.allowed_user

    async def _reply(self, update: Update, text: str) -> None:
        await update.message.reply_text(text, parse_mode=ParseMode.MARKDOWN)

    # ── Handlers ─────────────────────────────────────────────────────────────

    async def cmd_start(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        if not self._auth(update):
            return
        await self._reply(update, (
            "*os2 Agentic Coding OS v3.0*\n\n"
            "Commands:\n"
            "• `/status` — project status\n"
            "• `/queue` — ticket queue\n"
            "• `/logs` — session logs\n"
            "• `/prd <text>` — submit PRD\n"
            "• `/approve` — approve pending plan\n"
            "• `/reject <reason>` — reject plan\n"
            "• `/ask <question>` — ask Claude 1\n"
            "• `/dispatch T-XXX` — manual dispatch\n"
            "• Free text → Claude 1"
        ))

    async def cmd_status(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        if not self._auth(update):
            return
        summary = format_status_summary(self.paths["devos"])
        await self._reply(update, summary)

    async def cmd_queue(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        if not self._auth(update):
            return
        summary = format_queue_summary(self.paths["queue"])
        await self._reply(update, summary)

    async def cmd_logs(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        if not self._auth(update):
            return
        summary = format_logs_summary(self.paths["logs"])
        await self._reply(update, summary)

    async def cmd_approve(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        if not self._auth(update):
            return
        success, msg = self.approval.approve()
        await self._reply(update, msg)

        if success:
            # Auto-dispatch newly approved tickets
            results = self.dispatcher.dispatch_all_ready()
            if results:
                dispatched = [f"`{tid}`" for tid, _ in results if "Dispatched" in _]
                if dispatched:
                    await self._reply(update, f"Dispatching: {', '.join(dispatched)}")

    async def cmd_reject(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        if not self._auth(update):
            return
        args = context.args
        reason = " ".join(args) if args else "No reason given"
        success, msg = self.approval.reject(reason)
        await self._reply(update, msg)

        if success:
            # Ask Claude 1 to revise
            await self._reply(update, "Asking Claude 1 to revise the plan...")
            response = invoke_claude1(
                f"The user rejected your plan. Reason: {reason}\nPlease revise and create a new plan.",
                self.paths["devos"],
                self.paths["root"] / ".claude" / "CLAUDE.md",
            )
            await self._handle_claude1_response(update, response, source="plan revision")

    async def cmd_prd(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        if not self._auth(update):
            return
        prd_text = " ".join(context.args) if context.args else ""
        if not prd_text:
            await self._reply(update, "Usage: `/prd <PRD text>`")
            return

        await self._reply(update, "Sending PRD to Claude 1 for decomposition...")
        response = invoke_claude1(
            f"Decompose this PRD into tickets:\n\n{prd_text}",
            self.paths["devos"],
            self.paths["root"] / ".claude" / "CLAUDE.md",
            timeout=self.config.get("agents", {}).get("CLAUDE1", {}).get("timeout", 300),
        )
        await self._handle_claude1_response(update, response, source="PRD")

    async def cmd_ask(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        if not self._auth(update):
            return
        question = " ".join(context.args) if context.args else ""
        if not question:
            await self._reply(update, "Usage: `/ask <question>`")
            return

        await self._reply(update, "Asking Claude 1...")
        response = invoke_claude1(
            question,
            self.paths["devos"],
            self.paths["root"] / ".claude" / "CLAUDE.md",
        )
        # Truncate for TG
        reply = response[:3000] + ("..." if len(response) > 3000 else "")
        await self._reply(update, reply)

    async def cmd_dispatch(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        if not self._auth(update):
            return
        args = context.args
        if not args:
            await self._reply(update, "Usage: `/dispatch T-XXX`")
            return
        ticket_id = args[0]
        success, msg = self.dispatcher.dispatch(ticket_id)
        await self._reply(update, msg)

    async def handle_free_text(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        if not self._auth(update):
            return
        text = update.message.text or ""
        await self._reply(update, "Forwarding to Claude 1...")
        response = invoke_claude1(
            text,
            self.paths["devos"],
            self.paths["root"] / ".claude" / "CLAUDE.md",
        )
        reply = response[:3000] + ("..." if len(response) > 3000 else "")
        await self._reply(update, reply)

    # ── Internal ─────────────────────────────────────────────────────────────

    async def _handle_claude1_response(
        self, update: Update, response: str, source: str = "input"
    ) -> None:
        """Handle Claude 1's response: detect ticket JSON, save plan, ask for approval."""
        tickets = extract_tickets_from_response(response)

        if tickets:
            # Save as pending plan
            plan_summary = extract_plan_summary(response)
            plan_id = self.approval.save_pending_plan(tickets, source=source)
            plan = {"id": plan_id, "source": source, "tickets": tickets}

            from .ssot import format_plan_summary
            approval_msg = format_plan_summary(plan)
            await self._reply(update, f"Plan created (`{plan_id}`):\n\n{plan_summary}")
            await self._reply(update, approval_msg)
        else:
            # Regular response
            reply = response[:3000] + ("..." if len(response) > 3000 else "")
            await self._reply(update, reply)

    async def send_notification(self, message: str) -> None:
        """Send a notification to the allowed user (used by dispatcher)."""
        if not self.allowed_user or not self.app:
            return
        try:
            await self.app.bot.send_message(
                chat_id=self.allowed_user,
                text=message,
                parse_mode=ParseMode.MARKDOWN,
            )
        except Exception as e:
            logger.error(f"Failed to send TG notification: {e}")

    # ── Start ─────────────────────────────────────────────────────────────────

    def build_app(self) -> Application:
        self.app = Application.builder().token(self.token).build()

        self.app.add_handler(CommandHandler("start", self.cmd_start))
        self.app.add_handler(CommandHandler("status", self.cmd_status))
        self.app.add_handler(CommandHandler("queue", self.cmd_queue))
        self.app.add_handler(CommandHandler("logs", self.cmd_logs))
        self.app.add_handler(CommandHandler("approve", self.cmd_approve))
        self.app.add_handler(CommandHandler("reject", self.cmd_reject))
        self.app.add_handler(CommandHandler("prd", self.cmd_prd))
        self.app.add_handler(CommandHandler("ask", self.cmd_ask))
        self.app.add_handler(CommandHandler("dispatch", self.cmd_dispatch))
        self.app.add_handler(
            MessageHandler(filters.TEXT & ~filters.COMMAND, self.handle_free_text)
        )

        return self.app

    def run(self) -> None:
        """Start the bot (blocking)."""
        app = self.build_app()
        logger.info("os2 Telegram bot starting...")
        app.run_polling(drop_pending_updates=True)
