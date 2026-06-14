from typing import TypedDict, Annotated, Optional, Any, Literal

from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages

from .schemas import (
    UserInfo,
    CourseInfo,
    ClassByCourse,
    CourseFilter,
    QuestionClassification,
)


class AdvisorState(TypedDict, total=False):
    # Request/session info
    thread_id: Optional[str]
    client_message_id: Optional[str]

    # Conversation memory
    messages: Annotated[list[BaseMessage], add_messages]
    summary: Optional[str]

    # Structured business memory
    user_info: UserInfo
    course_info: CourseInfo
    class_by_course: ClassByCourse
    course_filter: CourseFilter

    # Classifier result
    classification: QuestionClassification

    # Context reference
    last_topic: Optional[Literal["course", "class", "lead", "general"]]
    last_course_action: Optional[str]
    last_suggested_courses: list[dict[str, Any]]

    selected_course_id: Optional[str]
    selected_course_code: Optional[str]

    # Tool/business result
    tool_result: Optional[dict[str, Any]]

    # Router result
    route: Optional[Literal[
        "list_current_courses",
        "search_course",
        "filter_courses",
        "get_classes_by_course",
        "collect_user_info",
        "save_lead",
        "reject_only",
        "advisor_answer",
    ]]
