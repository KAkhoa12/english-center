from ..schemas import PlannerDecision
from ..state import AdvisorState


def extract_task_node(state: AdvisorState) -> dict:
    decision = state.get("planner_decision")
    if not decision or decision.needs_clarification or not decision.actions:
        return {"current_action": None}

    current_action = decision.actions[0]
    remaining_actions = decision.actions[1:]

    return {
        "current_action": current_action,
        "planner_decision": PlannerDecision(
            actions=remaining_actions,
            needs_clarification=decision.needs_clarification,
            clarification_question=decision.clarification_question,
        ),
        "action_context": current_action.action_context,
    }


def route_extracted_task(state: AdvisorState) -> str:
    routes = {
        "general": "general_node",
        "search_course": "search_course_node",
        "course_info": "course_info_node",
        "class_info": "class_info_node",
        "upcoming_classes": "upcoming_classes_node",
        "enrollments": "enrollments_node",
    }

    if state.get("needs_clarification"):
        return "response_node"

    current_action = state.get("current_action")
    if not current_action:
        return "response_node"

    return routes.get(current_action.task, "response_node")
