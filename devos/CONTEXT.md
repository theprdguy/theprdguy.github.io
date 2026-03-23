# Project Context (TL;DR — ~100 lines max)
# Updated by Claude 1 at each session. Keep concise.

## What We're Building
(TBD — fill when project is defined)

## Tech Stack
(TBD — stack-agnostic OS, fill when project stack is chosen)

## Key Decisions
- Multi-LLM OS: Claude 1 (planner) + Claude 2 (backend) + Codex (infra/data) + Gemini (UI)
- File-based SSOT: all state in devos/
- Telegram integration: full bidirectional control from mobile
- Approval workflow: PRD → plan → approve → dispatch

## Active Agents
- CLAUDE1: Planner (no coding). Dual mode: local CLI + TG pipe mode.
- CLAUDE2: Backend (Account B, .claude-b config)
- CODEX: Infra + Data (expanded role, highest token budget)
- GEMINI: UI design + publishing only

## Current Work
(TBD)

## Important Context
(TBD — add as project progresses)
