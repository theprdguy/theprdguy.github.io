# Project Context (TL;DR — ~100 lines max)
# Updated by Claude 1 at each session. Keep concise.

## What We're Building
개인 포트폴리오 사이트 — Deck, Sift, svrTime, Mining 4개 도구를 소개.
arzoumanian.fr 스타일 (미니멀 에디토리얼, 크림 배경, grain overlay).
GitHub Pages 정적 배포.

## Tech Stack
- Next.js (App Router) + Tailwind CSS v4 + TypeScript
- Static export (`output: 'export'`, basePath: '/portfolio')
- Fonts: Playfair Display (headings) + Inter (body)
- Deploy: GitHub Actions → gh-pages branch

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
