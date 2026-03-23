# Question Queue (A-Mode)
# Questions requiring decisions. Resolved by Claude 1 at session start.
# Format: [status] Q-XXX: Question text
# Statuses: [open] | [resolved] | [parked]

# Template:
# ## Q-001: Short question title
# Status: [open]
# Ticket: T-XXX (or "general")
# Blocking: yes | no
#
# **Question**: Full question text
# **Options**:
#   A) Option A
#   B) Option B
# **Recommendation**: A — reason
# **Default (if no response)**: A — used after 24h with no decision
#
# **Resolution**: (filled when resolved)

## Q-001: Sandbox blocks T-HUB-01 target path
Status: [open]
Ticket: T-HUB-01
Blocking: yes

**Question**: The ticket requires creating `/Users/hoanshin/Desktop/thePRD/os2-hub/`, but the current Codex sandbox only allows writes under `/Users/hoanshin/Desktop/thePRD/os2`. `mkdir -p /Users/hoanshin/Desktop/thePRD/os2-hub` fails with `Operation not permitted`. How should this ticket proceed?
**Options**:
  A) Re-run T-HUB-01 in an environment with write access to `/Users/hoanshin/Desktop/thePRD/`
  B) Change the ticket target path to a writable location under `/Users/hoanshin/Desktop/thePRD/os2`
**Recommendation**: A — the ticket explicitly requires a separate sibling repo, so changing the path would violate the constraint.
**Default (if no response)**: A — keep the ticket blocked until a writable environment is available.
#
# **Resolution**: (filled when resolved)
