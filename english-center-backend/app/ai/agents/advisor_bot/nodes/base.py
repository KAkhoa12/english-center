import json
from typing import Any

from langchain_core.messages import (
    AIMessage,
    HumanMessage,
    SystemMessage,
    RemoveMessage,
)

from app.ai.agents.advisor_bot.state import AdvisorState
from app.ai.agents.advisor_bot.schemas import (
    UserInfo,
    CourseInfo,
    ClassByCourse,
    CourseFilter,
    QuestionClassification,
)
from app.ai.llms.client import get_llm
from app.ai.helper.prompt_convert import render_prompt


classifier_llm = get_llm(
    temperature=0,
    streaming=False,
)

advisor_llm = get_llm(
    temperature=0.3,
    streaming=True,
)

summary_llm = get_llm(
    temperature=0,
    streaming=False,
)

def build_business_context(state: AdvisorState) -> dict[str, Any]:
    return {
        "user_info": state.get("user_info"),
        "course_info": state.get("course_info"),
        "class_by_course": state.get("class_by_course"),
        "course_filter": state.get("course_filter"),
        "last_topic": state.get("last_topic"),
        "last_course_action": state.get("last_course_action"),
        "last_suggested_courses": state.get("last_suggested_courses", []),
        "selected_course_id": state.get("selected_course_id"),
        "selected_course_code": state.get("selected_course_code"),
    }


def model_to_dict(value: Any) -> Any:
    if hasattr(value, "model_dump"):
        return value.model_dump()
    return value


def merge_model(old: Any, new: Any, model_cls: type):
    old_data = model_to_dict(old) or {}
    new_data = model_to_dict(new) or {}

    merged = dict(old_data)

    for key, value in new_data.items():
        if value is not None:
            merged[key] = value

    return model_cls(**merged)
