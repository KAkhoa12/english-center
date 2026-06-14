
from app.ai.agents.advisor_bot.state import AdvisorState
from app.ai.agents.advisor_bot.schemas import UserInfo, CourseInfo, ClassByCourse, CourseFilter
from app.ai.agents.advisor_bot.nodes.base import merge_model


async def merge_context_node(state: AdvisorState):
    classification = state.get("classification")

    if not classification:
        return {}

    return {
        "user_info": merge_model(
            state.get("user_info"),
            classification.user_info,
            UserInfo,
        ),
        "course_info": merge_model(
            state.get("course_info"),
            classification.course_info,
            CourseInfo,
        ),
        "class_by_course": merge_model(
            state.get("class_by_course"),
            classification.class_by_course,
            ClassByCourse,
        ),
        "course_filter": merge_model(
            state.get("course_filter"),
            classification.course_filter,
            CourseFilter,
        ),
    }
