from datetime import datetime
from zoneinfo import ZoneInfo

from langchain_core.tools import tool

@tool
def get_current_time(timezone: str = "Asia/Ho_Chi_Minh") -> str:
    """
    Lấy thời gian hiện tại theo timezone.
    Args:
        timezone: IANA timezone, ví dụ Asia/Ho_Chi_Minh.
    """
    return datetime.now(ZoneInfo(timezone)).isoformat()
