# START HERE — os2 Agentic Coding OS v3.0

## 1. 최초 1회 설정

### 공통 (메인 컴 + 서브 컴 모두)
```bash
# 1. 레포 클론
git clone <your-private-repo> os2 && cd os2

# 2. Python 의존성 설치
make install

# 3. 환경변수 설정

# 방법 A: .env 파일 (프로젝트별 토큰 관리 — 권장)
echo 'OS2_TG_TOKEN="BotFather에서 발급받은 토큰"' > .env
echo 'OS2_TG_ALLOWED_USER="본인 Telegram User ID"' >> .env
source .env

# 방법 B: ~/.zshrc 영구 등록 (토큰이 하나일 때)
echo 'export OS2_TG_TOKEN="토큰"' >> ~/.zshrc
echo 'export OS2_TG_ALLOWED_USER="User ID"' >> ~/.zshrc
source ~/.zshrc
```

> Telegram User ID 확인: @userinfobot 에게 아무 메시지 전송
> Telegram 봇 토큰 발급: @BotFather → /newbot

### 서브 컴 전용 (상시 서버)
```bash
# plist 파일에 경로 + 토큰 입력 후
make install-daemon   # 부팅 시 자동 시작 등록
```

### Claude 2 (Account B) 설정
```bash
# .claude-b/ 디렉토리에 Account B 인증
CLAUDE_CONFIG_DIR=.claude-b claude login
```

---

## 2. 데일리 루틴

### 메인 컴 출근
```bash
make pickup   # git pull + 서버 시작
claude        # Claude 1 CLI 시작
```

### 메인 컴 퇴근 / 외출
```bash
make handoff  # 서버 종료 + git push
```

### 서브 컴
```bash
# 아무것도 안 해도 됨 — launchd가 항상 서버를 켜둠
# Telegram으로 /status, /queue 등 명령
```

---

## 3. 새 프로젝트 시작

```
1. devos/PROJECT_STATE.md — 프로젝트 정보 업데이트
2. devos/CONTEXT.md       — 기술 스택 기록
3. Claude 1에게 PRD 제출  — CLI 직접 또는 TG /prd
4. 플랜 확인 후 승인
5. 에이전트 자동 디스패치
```

---

## 4. 명령어 치트시트

```bash
# 서버
make pickup       # 출근 (git pull + 시작)
make handoff      # 퇴근 (종료 + git push)
make ps           # 서버 상태
make tail         # 서버 로그 실시간

# 상태 확인
make status       # 프로젝트 현황
make queue        # 티켓 목록
make logs         # 최근 세션 로그
make pending      # 승인 대기 플랜

# 디스패치
make dispatch T=T-001   # 단일 티켓
make dispatch-all       # 전체 준비된 티켓

# Telegram
/status           # 프로젝트 상태
/queue            # 티켓 목록
/prd <내용>       # PRD 제출
/approve          # 플랜 승인
/reject <이유>    # 플랜 반려
/ask <질문>       # Claude 1에게 질문
/dispatch T-001   # 수동 디스패치
```
