# os2 — Agentic Coding OS v3.0

4개 AI 에이전트를 단일 랩탑에서 오케스트레이션하는 범용 개발 OS.

## Architecture

```
Claude 1 (Account A, 플래너)
    ├── Local: Claude Code CLI (인터랙티브)
    └── Remote: Telegram Bot → os2-server → claude -p
                     ↓
            [devos/ SSOT]
                     ↓
    ┌────────────────┼────────────────┐
    ▼                ▼                ▼
Claude 2 (B)      Codex           Gemini
백엔드             인프라/데이터     UI/퍼블리싱
```

## Agent Roles

| Agent | Role | Token Budget |
|-------|------|:---:|
| Claude 1 (Account A) | 플래닝, SSOT 관리, 리서치 | medium |
| Claude 2 (Account B) | 백엔드 구현 | medium |
| Codex | 인프라, 데이터, CI/CD, 테스트 | **high** |
| Gemini | UI 디자인 + 퍼블리싱만 | low |

## Quick Start

### 1. 환경 설정

```bash
# Python 의존성 설치
make install

# Telegram Bot Token 설정 (BotFather에서 발급)
export OS2_TG_TOKEN="your_bot_token"

# 본인의 Telegram User ID (보안)
export OS2_TG_ALLOWED_USER="your_user_id"
```

### 2. os2-server 시작 (Telegram 원격 제어)

```bash
make server
```

### 3. 로컬 작업 (Claude Code CLI)

```bash
# Claude Code CLI로 직접 작업 (Account A)
# .claude/CLAUDE.md 가 자동 로드됨
claude
```

### 4. Claude 2 설정 (Account B)

Claude 2는 Account B 자격증명 사용:
```bash
# Account B API 키를 .claude-b/ 에 설정
# 또는 ANTHROPIC_API_KEY 환경변수로 Account B 키 설정 후
export CLAUDE_CONFIG_DIR=.claude-b
claude -p "your prompt"
```

## Workflow

### PRD → 구현

1. **로컬**: Claude Code CLI에서 직접 PRD 제출
2. **리모트**: Telegram `/prd <PRD 내용>`
3. Claude 1이 티켓으로 분해 → 플랜 생성
4. 플랜 확인 후 승인: `/approve` (TG) 또는 CLI 확인
5. 자동 디스패치: Claude 2, Codex, Gemini가 각자 티켓 작업
6. 완료 시 Telegram 알림

### Telegram 명령어

| 명령어 | 설명 |
|--------|------|
| `/status` | 현재 프로젝트 상태 |
| `/queue` | 티켓 목록 |
| `/logs` | 최근 세션 로그 |
| `/prd <text>` | PRD 제출 |
| `/approve` | 플랜 승인 → 디스패치 |
| `/reject <이유>` | 플랜 반려 |
| `/ask <질문>` | Claude 1에게 질문 |
| `/dispatch T-001` | 티켓 수동 디스패치 |

## Directory Structure

```
os2/
├── server/           # os2-server (TG 봇 + 디스패처)
├── devos/            # SSOT 두뇌
│   ├── AI.md         # 에이전트 공유 헌법
│   ├── PROJECT_STATE.md
│   ├── CONTEXT.md
│   ├── TASKS.md
│   ├── agents/registry.yaml
│   ├── tasks/QUEUE.yaml
│   ├── plans/        # 승인 워크플로우
│   ├── logs/         # 세션 로그
│   ├── questions/    # 비동기 질문 큐
│   └── docs/         # 계약서, ADR
├── .claude/          # Claude 1 설정 (Account A)
├── .claude-b/        # Claude 2 설정 (Account B)
├── AGENTS.md         # Codex 지시서
├── GEMINI.md         # Gemini 지시서
├── os2.yaml          # 서버 설정
├── Makefile
├── apps/api/         # 백엔드 코드
├── apps/web/         # 프론트엔드 코드
└── packages/         # 공유 패키지
```

## New Project Setup

이 OS를 새 프로젝트에 적용:

1. 이 레포를 복사 (stack-agnostic)
2. `devos/PROJECT_STATE.md`에 프로젝트 정보 업데이트
3. `devos/CONTEXT.md`에 기술 스택 기록
4. Claude 1에게 첫 PRD 제출
5. 승인 후 빌더들이 작업 시작

## Version

v3.0-os2 — 4-agent + Telegram + Approval Workflow
