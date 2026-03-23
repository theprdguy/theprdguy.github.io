# Architecture (os2 v3.0)

## System Overview

os2 is a 4-agent Agentic Coding OS that orchestrates AI agents from a single laptop.

```
┌─────────────────────────────────────────┐
│            devos/ (SSOT Brain)           │
│  QUEUE.yaml, PROJECT_STATE.md, logs/     │
│  plans/, questions/, docs/               │
└──────────┬──────────────────┬────────────┘
           │                  │
┌──────────▼──────┐  ┌───────▼───────────────┐
│ Local Mode       │  │ Remote Mode            │
│ Claude Code CLI  │  │ os2-server.py          │
│ (interactive)    │  │ • Telegram bot         │
│ Account A        │  │ • claude -p pipe mode  │
│                  │  │ • Status queries       │
└──────────┬───────┘  └───────┬───────────────┘
           └─────────┬─────────┘
                     │ Dispatch
         ┌───────────┼───────────┐
         ▼           ▼           ▼
    Claude 2       Codex      Gemini
    (Account B)  (Infra/Data) (UI/Pub)
    Backend      subprocess   tmux
```

## Component Descriptions

### devos/ (The Brain)
All SSOT state lives here. Stack-agnostic. Never in the app code.

| File | Purpose |
|------|---------|
| `AI.md` | Shared operating constitution for all agents |
| `PROJECT_STATE.md` | Current milestone, agent status, blockers |
| `CONTEXT.md` | TL;DR updated each session |
| `TASKS.md` | Human-readable task board |
| `agents/registry.yaml` | 4-agent registry with scopes |
| `tasks/QUEUE.yaml` | Machine-readable ticket queue |
| `plans/pending/` | Plans awaiting approval |
| `plans/approved/` | Approved plans (archive) |
| `plans/rejected/` | Rejected plans with feedback |
| `logs/` | Session logs for cross-agent context |
| `questions/QUEUE.md` | Async question queue |
| `docs/` | API/UI contracts, ADRs, architecture |

### os2-server (The Nervous System)
Always-running Python process. Handles TG + dispatch.

| Module | Purpose |
|--------|---------|
| `telegram.py` | TG bot handlers |
| `planner.py` | `claude -p` pipe mode wrapper |
| `dispatcher.py` | 4-agent dispatch (replaces Linker) |
| `ssot.py` | SSOT file readers/writers |
| `approval.py` | Approval workflow state machine |
| `config.py` | Load os2.yaml |

### Agents

| Agent | Mode | Config | Scope |
|-------|------|--------|-------|
| Claude 1 | interactive + pipe | .claude/ | devos/ |
| Claude 2 | subprocess (claude -p) | .claude-b/ | apps/api/, tests/api/ |
| Codex | subprocess | AGENTS.md | apps/api/, packages/, infra/, scripts/, tests/ |
| Gemini | tmux | GEMINI.md | apps/web/, styles/ |

## Key Design Decisions

### File-based SSOT
All inter-agent communication is through files in devos/.
No shared memory, no RPC. The repo IS the communication channel.

### Dual-mode Claude 1
Local: interactive Claude Code CLI (primary path)
Remote: os2-server invokes `claude -p` for each TG request
Both modes share the same devos/ state.

### Approval Workflow
PRD → plan → user approval → dispatch. No auto-execution.
Plans saved to plans/pending/, moved to approved/ or rejected/.

### Pipe Mode for Builders
Claude 2 runs as `claude -p` (non-interactive, one-shot).
Fresh context window each invocation = no degradation.
Account B credentials via `CLAUDE_CONFIG_DIR=.claude-b`.

### Token Efficiency
- Most TG queries answered by file parsing (no LLM call)
- LLM only invoked for planning and complex queries
- Claude 1 pipe mode = zero idle tokens
