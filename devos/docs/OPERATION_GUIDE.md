# 운용 가이드 (os2 v3.0)

## 시스템 구조

```
[메인 컴] ─── 작업 허브
  Claude 1 CLI (인터랙티브)
  os2-server (작업 시에만)
  Claude 2 / Codex / Gemini 실행
        │
        │ git push/pull (GitHub private repo)
        │
[서브 컴] ─── 상시 서버
  os2-server (launchd, 항상 가동)
  Telegram Bot (원격 수령)
```

---

## 두 컴퓨터 전환 흐름

### 메인 → 서브 (외출/자리 비움)
```bash
make handoff
# 내부 동작: make stop → git commit → git push
# 이후 서브 컴 Telegram으로 계속 제어 가능
```

### 서브 → 메인 (복귀)
```bash
make pickup
# 내부 동작: git pull → make start
# Claude 1 CLI: claude
```

### 서브 컴은 손댈 필요 없음
launchd가 항상 서버를 켜두므로 전환 시 서브 컴에서 별도 작업 불필요.

---

## PRD → 구현 전체 흐름

```
1. PRD 입력
   - 로컬: Claude 1 CLI에서 직접
   - 원격: Telegram /prd <내용>

2. Claude 1 분해
   - 티켓으로 분해 → devos/plans/pending/ 저장

3. 승인
   - 로컬: CLI에서 확인 후 승인
   - 원격: Telegram /approve

4. 자동 디스패치
   - CLAUDE2: 백엔드 작업
   - CODEX: 인프라/데이터 작업
   - GEMINI: UI/퍼블리싱 작업

5. 완료 알림
   - Telegram으로 완료/에러 수신
   - devos/logs/에 세션 로그 기록

6. PR 리뷰
   - Claude 1이 검토 → 승인 또는 수정 요청
```

---

## 에이전트별 운용

### Claude 1 (계정 A, 플래너)
- 로컬: `claude` 실행 → `.claude/CLAUDE.md` 자동 로드
- 원격: os2-server가 `claude -p`로 호출
- 코딩 금지 가드: `.claude/hooks/guard-no-impl.sh`

### Claude 2 (계정 B, 백엔드)
- os2-server가 `CLAUDE_CONFIG_DIR=.claude-b claude -p`로 실행
- 티켓의 `files:` 범위만 수정 가능

### Codex (인프라/데이터)
- os2-server가 `codex exec -s workspace-write`로 실행
- 토큰 여유 가장 많음 → 복잡/대형 티켓 우선 배정

### Gemini (UI/퍼블리싱)
- tmux 세션에서 실행
- `apps/web/`, `styles/` 만 수정

---

## SSOT 관리 원칙

```
진실 우선순위:
1. devos/PROJECT_STATE.md
2. devos/docs/API_CONTRACT.md + UI_CONTRACT.md
3. devos/docs/ADR/
4. devos/tasks/QUEUE.yaml
5. 코드
6. devos/logs/ (세션 로그)
7. 채팅 (최하위)
```

- QUEUE.yaml 쓰기: 승인 후 os2-server만
- PROJECT_STATE.md 쓰기: Claude 1만
- 계약서 변경: 코드 변경 전 먼저 커밋

---

## 티켓 라이프사이클

```
todo → doing → done
           └→ blocked (에러 시)
```

- `make queue`로 현재 상태 확인
- blocked 티켓: `devos/logs/`에서 에러 원인 확인
- 재시도: `make dispatch T=T-XXX`

---

## 문제 해결

### 서버가 응답 없음
```bash
make ps       # 상태 확인
make tail     # 로그 확인
make restart  # 재시작
```

### Telegram 봇이 응답 없음
```bash
# 서브 컴에서
make ps
# 중지 상태면 launchd 재시작
launchctl kickstart -k gui/$(id -u)/com.os2.server
```

### git 충돌
```bash
# 양쪽에서 동시에 작업한 경우
git pull --rebase
# devos/ 파일은 Claude 1이 최종본 기준으로 재작성
```

### 에이전트 크래시
```bash
make logs           # 세션 로그 확인
make queue          # blocked 티켓 확인
make dispatch T=T-XXX  # 재시도
```
