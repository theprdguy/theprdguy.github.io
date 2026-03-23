"""Configuration loader for os2-server."""
from __future__ import annotations

import os
from pathlib import Path

import yaml


def load_config(config_path: str = "os2.yaml") -> dict:
    """Load os2.yaml configuration."""
    path = Path(config_path)
    if not path.exists():
        raise FileNotFoundError(f"Config file not found: {config_path}")
    with open(path) as f:
        return yaml.safe_load(f)


def get_telegram_token(config: dict) -> str:
    """Get Telegram bot token from environment."""
    env_var = config.get("telegram", {}).get("token_env", "OS2_TG_TOKEN")
    token = os.environ.get(env_var)
    if not token:
        raise ValueError(f"Telegram token not set. Set {env_var} environment variable.")
    return token


def get_allowed_user(config: dict) -> int | None:
    """Get allowed Telegram user ID from environment."""
    env_var = config.get("telegram", {}).get("allowed_user_env", "OS2_TG_ALLOWED_USER")
    user_id = os.environ.get(env_var)
    if user_id:
        return int(user_id)
    return None


def get_paths(config: dict) -> dict:
    """Get key file paths from config."""
    root = Path(config.get("project_root", "."))
    return {
        "root": root,
        "devos": root / config.get("devos_dir", "devos"),
        "queue": root / config.get("queue_file", "devos/tasks/QUEUE.yaml"),
        "plans": root / config.get("plans_dir", "devos/plans"),
        "logs": root / config.get("logs_dir", "devos/logs"),
    }
