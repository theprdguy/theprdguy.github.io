# Project State (SSOT)

## North Star
- 만든 도구들(Deck, Sift, svrTime, Mining)을 소개하는 미니멀 에디토리얼 포트폴리오 사이트. GitHub Pages 호스팅.

## Current Milestone
- Portfolio Site v1 — arzoumanian.fr 스타일 Next.js 정적 사이트
- DoD:
  - [ ] T-PF-01: Next.js scaffold + design system (GEMINI)
  - [ ] T-PF-02: Layout + nav + grain overlay (GEMINI)
  - [ ] T-PF-03: Home page + project data (GEMINI)
  - [ ] T-PF-04: Project detail pages + About page (GEMINI)
  - [ ] T-PF-05: SEO + GitHub Actions deploy (GEMINI)

## What works now (demo path)
- 없음 — T-PF-01부터 시작

## Agent Status
| Agent | Role | Status | Instruction File |
|-------|------|--------|------------------|
| claude1-planner | Planner + Researcher | active | .claude/CLAUDE.md |
| claude2-backend | Backend Builder | active | .claude-b/CLAUDE.md |
| codex-infra | Infra + Data Builder | active | AGENTS.md |
| gemini-ui | UI Design + Publishing | active | GEMINI.md |

## In progress
- 없음 (T-PF-01 dispatch 대기)

## Blockers / Questions
- 없음

## Decisions (latest)
- 빌더: GEMINI (UI/publishing)
- 이미지: 텍스트 위주 먼저, 스크린샷 나중에
- 호스팅: 기본 GitHub Pages (username.github.io/portfolio)
- basePath: '/portfolio' (레포 이름과 일치해야 함)
- 디자인 레퍼런스: arzoumanian.fr (미니멀 에디토리얼, grain overlay, scroll animation)

## Next dispatch hint
- make dispatch T=T-PF-01 (GEMINI)
