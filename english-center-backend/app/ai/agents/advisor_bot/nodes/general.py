from ..state import AdvisorState
from .task_helpers import task_update


def general_node(state: AdvisorState) -> dict:
    action = state.get("current_action")
    result = {
        "task": "general",
        "status": "ok",
        "reason": action.reason if action else None,
    }
    return {
        **task_update(state, result),
    }
