"""os2-server entry point.

Usage:
    python3 -m server
    OS2_TG_TOKEN=<token> OS2_TG_ALLOWED_USER=<user_id> python3 -m server
"""
from __future__ import annotations

import logging
import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from server.approval import ApprovalManager
from server.config import get_allowed_user, get_paths, get_telegram_token, load_config
from server.dispatcher import Dispatcher
from server.telegram import OS2Bot

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("os2")


def main() -> None:
    # Load config
    config_path = Path("os2.yaml")
    if not config_path.exists():
        logger.error("os2.yaml not found. Run from project root.")
        sys.exit(1)

    config = load_config()
    paths = get_paths(config)

    # Telegram token
    try:
        token = get_telegram_token(config)
    except ValueError as e:
        logger.error(str(e))
        logger.error("Set OS2_TG_TOKEN environment variable and retry.")
        sys.exit(1)

    allowed_user = get_allowed_user(config)
    if not allowed_user:
        logger.warning(
            "OS2_TG_ALLOWED_USER not set — bot will respond to ALL users. "
            "Set this for security."
        )

    # Initialize components
    bot = OS2Bot(token, allowed_user, paths, config)

    approval = ApprovalManager(paths["plans"], paths["queue"])

    dispatcher = Dispatcher(
        config=config,
        paths=paths,
        notify_callback=bot.send_notification,
    )

    bot.setup(dispatcher, approval)

    logger.info(f"os2-server starting (devos: {paths['devos']})")
    logger.info(f"Allowed user: {allowed_user or 'ALL (insecure)'}")

    # Start bot (blocking)
    bot.run()


if __name__ == "__main__":
    main()
