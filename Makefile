# os2 Makefile
# Usage: make <target>

.PHONY: start stop restart ps handoff pickup server status queue logs dispatch install setup help

PID_FILE := .os2-server.pid
LOG_FILE := .os2-server.log

# ── Server 시작/종료 ──────────────────────────────────────────────────────────

## 서버 시작 (백그라운드)
start:
	@if [ -f $(PID_FILE) ] && kill -0 $$(cat $(PID_FILE)) 2>/dev/null; then \
		echo "이미 실행 중 (PID: $$(cat $(PID_FILE)))"; \
	else \
		.venv/bin/python3 -m server >> $(LOG_FILE) 2>&1 & echo $$! > $(PID_FILE); \
		echo "os2-server 시작 (PID: $$(cat $(PID_FILE)), 로그: $(LOG_FILE))"; \
	fi

## 서버 종료
stop:
	@if [ -f $(PID_FILE) ] && kill -0 $$(cat $(PID_FILE)) 2>/dev/null; then \
		kill $$(cat $(PID_FILE)) && rm -f $(PID_FILE); \
		echo "os2-server 종료 완료"; \
	else \
		echo "실행 중인 서버 없음"; rm -f $(PID_FILE); \
	fi

## 서버 재시작
restart: stop start

## 서버 상태 확인
ps:
	@if [ -f $(PID_FILE) ] && kill -0 $$(cat $(PID_FILE)) 2>/dev/null; then \
		echo "실행 중 (PID: $$(cat $(PID_FILE)))"; \
	else \
		echo "중지됨"; \
	fi

## 서버 로그 실시간 보기
tail:
	@tail -f $(LOG_FILE)

# ── 두 컴퓨터 전환 ─────────────────────────────────────────────────────────────

## 이 컴에서 작업 마무리 후 다른 컴으로 넘기기 (stop → git push)
handoff:
	@make stop
	@git add devos/ && git diff --cached --quiet || git commit -m "handoff: $(shell date '+%Y-%m-%d %H:%M')"
	@git push
	@echo "핸드오프 완료. 다른 컴에서 'make pickup' 실행"

## 다른 컴에서 이어받기 (git pull → start)
pickup:
	@git pull
	@make start
	@echo "이어받기 완료"

## Install Python dependencies
install:
	python3 -m venv .venv && .venv/bin/pip install -r requirements.txt

## Run first-time setup
setup:
	bash scripts/setup.sh

## 서브 컴 전용: launchd에 등록 (부팅 시 자동 시작)
install-daemon:
	@cp com.os2.server.plist ~/Library/LaunchAgents/
	@launchctl load ~/Library/LaunchAgents/com.os2.server.plist
	@echo "launchd 등록 완료 — 재부팅 후에도 자동 시작됩니다"

## 서브 컴 전용: launchd 해제
uninstall-daemon:
	@launchctl unload ~/Library/LaunchAgents/com.os2.server.plist
	@rm -f ~/Library/LaunchAgents/com.os2.server.plist
	@echo "launchd 해제 완료"

# ── Status queries (no LLM) ──────────────────────────────────────────────────

## Show current project status
status:
	@cat devos/PROJECT_STATE.md

## Show ticket queue
queue:
	@cat devos/tasks/QUEUE.yaml

## Show recent session logs
logs:
	@ls -lt devos/logs/*.md 2>/dev/null | head -5 | awk '{print $$NF}' | xargs -I{} sh -c 'echo "=== {} ==="; cat {}'

## Show pending approval plans
pending:
	@ls devos/plans/pending/*.yaml 2>/dev/null && echo "---" || echo "No pending plans."

# ── Dispatch ─────────────────────────────────────────────────────────────────

## Dispatch a ticket: make dispatch T=T-001
dispatch:
	@if [ -z "$(T)" ]; then echo "Usage: make dispatch T=T-001"; exit 1; fi
	@.venv/bin/python3 -c "import time; from server.config import load_config, get_paths; from server.dispatcher import Dispatcher; c=load_config(); p=get_paths(c); d=Dispatcher(c,p); ok,msg=d.dispatch('$(T)'); print(msg); [time.sleep(2) for _ in iter(d.get_running, [])]"

## Dispatch all ready tickets
dispatch-all:
	@.venv/bin/python3 -c "import time; from server.config import load_config, get_paths; from server.dispatcher import Dispatcher; c=load_config(); p=get_paths(c); d=Dispatcher(c,p); [print(f'{t}: {m}') for t,m in d.dispatch_all_ready()]; [time.sleep(2) for _ in iter(d.get_running, [])]"

# ── Verification ─────────────────────────────────────────────────────────────

## Run all checks (wire to your stack's test/lint commands)
pr-check:
	@echo "Add your stack-specific checks here:"
	@echo "  make lint"
	@echo "  make test"
	@echo "  make typecheck"
	@echo "Update this target once your tech stack is defined."

# ── Help ─────────────────────────────────────────────────────────────────────

help:
	@echo "os2 Agentic Coding OS v3.0"
	@echo ""
	@echo "Setup:"
	@echo "  make setup            최초 설정 자동화"
	@echo "  make install          Python 의존성 설치"
	@echo ""
	@echo "Server:"
	@echo "  make start            서버 시작 (백그라운드)"
	@echo "  make stop             서버 종료"
	@echo "  make restart          서버 재시작"
	@echo "  make ps               서버 상태 확인"
	@echo "  make tail             서버 로그 실시간"
	@echo ""
	@echo "컴퓨터 전환:"
	@echo "  make handoff          서버 종료 + git push (다른 컴으로 넘기기)"
	@echo "  make pickup           git pull + 서버 시작 (이어받기)"
	@echo ""
	@echo "Status (no LLM):"
	@echo "  make status           프로젝트 상태"
	@echo "  make queue            티켓 큐"
	@echo "  make logs             최근 세션 로그"
	@echo "  make pending          승인 대기 플랜"
	@echo ""
	@echo "Dispatch:"
	@echo "  make dispatch T=T-001 티켓 디스패치"
	@echo "  make dispatch-all     준비된 티켓 전체 디스패치"
	@echo ""
	@echo "Verify:"
	@echo "  make pr-check         전체 검증"
