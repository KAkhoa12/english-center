from langchain_core.messages import AIMessage

from app.ai.helper.prompt_convert import render_prompt
from app.ai.llms.client import get_llm

from ..state import AdvisorState


def _format_messages(messages: list, limit: int = 8) -> str:
    """Convert recent messages to plain text for response prompt."""
    if not messages:
        return "Không có lịch sử hội thoại."

    formatted = []

    for msg in messages[-limit:]:
        role = getattr(msg, "type", "unknown")
        content = getattr(msg, "content", "")

        if content:
            formatted.append(f"{role}: {content}")

    return "\n".join(formatted)


def response_node(state: AdvisorState) -> dict:
    """
    Generate final answer for user.

    This node does not plan tasks and does not call business services.
    It only converts current state + tool results into a natural response.
    """

    planner_decision = state.get("planner_decision")

    if planner_decision and planner_decision.needs_clarification:
        answer = planner_decision.clarification_question or (
            "Dạ anh/chị cho em thêm thông tin để em hỗ trợ chính xác hơn nhé."
        )

        return {
            "final_answer": answer,
            "messages": [AIMessage(content=answer)],
        }

    if state.get("needs_clarification"):
        answer = state.get("clarification_question") or (
            "Dạ anh/chị cho em thêm thông tin để em hỗ trợ chính xác hơn nhé."
        )

        return {
            "final_answer": answer,
            "messages": [AIMessage(content=answer)],
        }

    llm = get_llm(tier="low")

    prompt = render_prompt(
        "advisor_bot/prompts/response.j2",
        messages=_format_messages(state.get("messages", [])),

        planner_decision=state.get("planner_decision"),
        tool_results=state.get("tool_results", []),

        user_info=state.get("user_info"),

        last_courses_found=state.get("last_courses_found", []),
        last_course_info_found=state.get("last_course_info_found"),

        last_classes_found=state.get("last_classes_found", []),
        last_class_info_found=state.get("last_class_info_found"),
    )

    response = llm.invoke(prompt)

    answer = response.content.strip() if hasattr(response, "content") else str(response).strip()

    return {
        "final_answer": answer,
        "messages": [AIMessage(content=answer)],
    }
