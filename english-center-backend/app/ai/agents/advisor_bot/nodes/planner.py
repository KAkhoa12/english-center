from app.ai.helper.prompt_convert import render_prompt
from app.ai.llms.client import get_llm
from ..state import AdvisorState
from ..schemas import Action, DEFAULT_TASK_PRIORITY, PlannerDecision

def normalize_action_priority(action: Action) -> Action:
    default_priority = DEFAULT_TASK_PRIORITY.get(action.task, 99)

    return action.model_copy(
        update={
            "priority": default_priority
        }
    )

def sort_actions(actions: list[Action]) -> list[Action]:
    normalized_actions = [
        normalize_action_priority(action)
        for action in actions
    ]

    return sorted(normalized_actions, key=lambda action: action.priority)
def _format_messages(messages: list) -> str:
    """Convert LangChain messages to short text for prompt."""
    return "\n".join(
        f"{msg.type}: {msg.content}"
        for msg in messages[-6:]
        if getattr(msg, "content", None)
    )


def _normalize_planner_decision(decision: PlannerDecision) -> PlannerDecision:
    """Sort actions and force priority by backend rule."""
    normalized_actions = []

    for action in decision.actions:
        fixed_priority = DEFAULT_TASK_PRIORITY.get(action.task, action.priority)

        normalized_actions.append(
            action.model_copy(
                update={"priority": fixed_priority}
            )
        )

    normalized_actions = sorted(
        normalized_actions,
        key=lambda action: action.priority
    )

    return decision.model_copy(
        update={"actions": normalized_actions}
    )


def _decision_flow(decision: PlannerDecision) -> dict:
    return {
        "actions": [action.model_dump(mode="json") for action in decision.actions],
        "needs_clarification": decision.needs_clarification,
        "clarification_question": decision.clarification_question,
    }


def planner_node(state: AdvisorState) -> dict:
    llm = get_llm(tier="low")
    structured_llm = llm.with_structured_output(PlannerDecision)

    prompt = render_prompt(
        "advisor_bot/prompts/planner.j2",
        messages=_format_messages(state.get("messages", [])),
        last_courses_found=state.get("last_courses_found", []),
        last_course_info_found=state.get("last_course_info_found"),
        action_context=state.get("action_context"),
        last_classes_found=state.get("last_classes_found", []),
        last_class_info_found=state.get("last_class_info_found"),
    )

    decision: PlannerDecision = structured_llm.invoke(prompt)
    decision = _normalize_planner_decision(decision)
    return {
        "planner_decision": decision,
        "action_context": (
            decision.actions[0].action_context
            if decision.actions
            else "normal_question"
        ),
        "needs_clarification": decision.needs_clarification,
        "clarification_question": decision.clarification_question,
        "flow": _decision_flow(decision),

    }
