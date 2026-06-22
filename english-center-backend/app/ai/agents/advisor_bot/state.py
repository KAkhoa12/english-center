from typing import TypedDict, Annotated, Optional, Any, Literal

from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages

from .schemas import (
    ActionContext,
    Action,
    UserInfo,
    CourseInfo,
    ClassInfo,
    PlannerDecision,
)


class AdvisorState(TypedDict, total=False):
    # Request/session info
    thread_id: Optional[str]
    client_message_id: Optional[str]
    messages: Annotated[list[BaseMessage], add_messages]
    summary: Optional[str]

    # Structured business memory
    user_info: UserInfo
    last_courses_found: list[CourseInfo]
    last_course_info_found: Optional[CourseInfo]
    last_classes_found: list[ClassInfo]
    last_class_info_found: Optional[ClassInfo]

    planner_decision: Optional[PlannerDecision]
    current_action: Optional[Action]
    action_context: ActionContext
    needs_clarification: bool
    clarification_question: Optional[str]
    tool_results: list[dict[str, Any]]
    task_result: list[dict[str, Any]]
    final_answer: Optional[str]
    flow: Optional[dict[str, Any]]
    db: Any
