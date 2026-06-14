
from app.ai.agents.advisor_bot.state import AdvisorState


async def route_node(state: AdvisorState):
    classification = state.get("classification")

    if not classification:
        return {
            "route": "advisor_answer",
        }

    allowed_action_names = [
        action.name for action in classification.allowed_actions
    ]

    if not allowed_action_names and classification.rejected_intents:
        return {
            "route": "reject_only",
        }

    if "list_current_courses" in allowed_action_names:
        return {
            "route": "list_current_courses",
        }

    if "filter_courses" in allowed_action_names:
        return {
            "route": "filter_courses",
        }

    if "search_course" in allowed_action_names:
        return {
            "route": "search_course",
        }

    if "get_classes_by_course" in allowed_action_names:
        return {
            "route": "get_classes_by_course",
        }

    if "save_lead" in allowed_action_names:
        return {
            "route": "save_lead",
        }

    if "collect_user_info" in allowed_action_names:
        return {
            "route": "collect_user_info",
        }

    return {
        "route": "advisor_answer",
    }
