# AI Operating Rules (v3.0 — os2)

## Purpose
Run continuous parallel work across 4 AI agents from a single laptop.
Maximize output by distributing work across Claude 1 (Planner), Claude 2 (Backend), Codex (Infra/Data), and Gemini (UI/Publishing).
Minimize human intervention via Telegram integration + approval workflow.

## Why Multi-LLM
- Each LLM has limited tokens/context per session
- Claude 1 as planner + researcher: tokens spent on planning, research, SSOT — never coding
- Claude 2 / Codex / Gemini as builders: tokens spent on actual implementation
- Total capacity = Claude 1 tokens + Claude 2 tokens + Codex tokens + Gemini tokens
- External access via Telegram: manage work from anywhere, not just at the laptop

## SSOT Priority (truth order)
1) PROJECT_STATE.md
2) docs/API_CONTRACT.md + docs/UI_CONTRACT.md
3) docs/ADR/*
4) tasks/QUEUE.yaml
5) Code
6) Session logs (devos/logs/)
7) Chat logs (least reliable)

## Roles

| Agent | Role | Can Modify | Cannot Modify |
|-------|------|-----------|---------------|
| **CLAUDE1** | Planner + Researcher + SSOT manager | devos/**, config files, AGENTS.md, GEMINI.md | apps/**, packages/**, src/**, tests/** |
| **CLAUDE2** | Backend builder | apps/api/**, tests/api/**, packages/shared/** | apps/web/**, infra/**, devos/ |
| **CODEX** | Infra + Data builder (expanded) | apps/api/**, packages/**, infra/**, scripts/**, tests/** | apps/web/**, styles/**, devos/ |
| **GEMINI** | UI design + publishing only | apps/web/**, styles/** | apps/api/**, packages/**, devos/ |

### Role Boundaries (critical)
- CLAUDE1 MUST NOT write implementation code — every token spent coding is wasted management capacity
- CLAUDE1 creates tickets with WHAT + CONTEXT; builders decide HOW
- CLAUDE2 owns backend logic; CODEX owns infra/data/testing support
- GEMINI owns UI design and styling only — no business logic
- Builders MUST NOT modify files outside their ticket scope
- Builders MUST NOT make architectural decisions — queue questions instead

## Tool Asymmetry

| Tool | Claude 1 | Claude 2 | Codex | Gemini |
|------|:--------:|:--------:|:-----:|:------:|
| MCP (context7 etc.) | O | O | X | X |
| LSP (code analysis) | O | O | X | X |
| Web search | O | O | O (limited) | O |
| File read/write | O | O | O | O |
| Command execution | O | O | O | O |
| Skills/Subagent | O | O | X | X |

## Ticket Quality Standard (WHAT + CONTEXT)

Claude 1 writes WHAT and CONTEXT. Builders decide HOW.

- `goal`: What to build (behavioral requirement)
- `context`: Why it's needed + technical research from Claude 1
- `constraints`: Technical constraints (versions, compatibility, dependencies)
- `dod`: Acceptance criteria (behavior-based)
- `files`: Files to modify (ownership scope)
- `skills_hint`: Recommended workflow approaches (optional, advisory)
- `verify`: How to check completion
- `deps`: Prerequisite tickets
- `contract_impact`: Which contract docs are affected

## Agent Communication Channels

### File-based SSOT (primary)
- `devos/tasks/QUEUE.yaml` — ticket queue (source of truth for work)
- `devos/PROJECT_STATE.md` — current state
- `devos/logs/` — session logs for cross-agent context
- `devos/plans/` — approval workflow state

### Input Channels for Claude 1
- **Local mode**: Claude Code CLI interactive session (primary, at laptop)
- **Remote mode**: Telegram bot → os2-server → `claude -p` pipe mode (when away)
- Both modes read/write the same devos/ SSOT

## Non-negotiables
- 1 PR = 1 Ticket (small PRs)
- Ownership: only the ticket owner may modify files in ticket.files (no overlap)
- Contract-first: if API/UI behavior changes, update contract docs first
- Dependency changes go in a separate PR
- Done = verify command passes
- Session log written before ending

## Session Logs (v3.0)
- Every agent writes a session log to `devos/logs/` before ending
- Format: `{YYYY-MM-DD}-{agent}-{ticket-ids}.md`
- Agents: `claude1`, `claude2`, `codex`, `gemini`
- Claude 1 reads all builder logs at session start for cross-agent context
- Max 50 lines per log

## Approval Workflow (v3.0 — new)
1. PRD arrives via Telegram or local CLI
2. Claude 1 decomposes into tickets → saves to `devos/plans/pending/{plan-id}.yaml`
3. Plan summary sent to user (TG notification or CLI display)
4. User approves (`/approve` on TG or confirms in CLI)
5. On approval: tickets written to QUEUE.yaml → dispatch begins
6. On rejection: Claude 1 revises with feedback

## Telegram Commands (v3.0 — new)
| Command | LLM Needed | Description |
|---------|:----------:|-------------|
| `/status` | No | PROJECT_STATE.md summary |
| `/queue` | No | Ticket list from QUEUE.yaml |
| `/logs` | No | Recent session logs |
| `/prd <text>` | Yes | Submit PRD → Claude 1 decomposes |
| `/approve` | No | Approve pending plan → dispatch |
| `/reject <reason>` | Yes | Reject plan → Claude 1 revises |
| `/ask <question>` | Yes | Free question to Claude 1 |
| `/dispatch T-XXX` | No | Manual dispatch single ticket |
| Free text | Yes | Conversation with Claude 1 |

## Standard Verify
- `make pr-check`
- `make lint / make test / make typecheck` (wire once stack is chosen)

## Question Queue (A-Mode)
- If blocked, add questions to questions/QUEUE.md (Options + Recommendation + Default)
- Non-blocking: proceed with Default
- Blocking: mark only that ticket as blocked
- Claude 1 resolves questions in batch at session start

## Handoff Format (4 lines)
```
Done: [what completed] — files: [list]
Next: [next ticket or "waiting for dispatch"]
Block: [Q-xxx or "none"]
Log: devos/logs/{date}-{agent}-{ticket-ids}.md written
```
