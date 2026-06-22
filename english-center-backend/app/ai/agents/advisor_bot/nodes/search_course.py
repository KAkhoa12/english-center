from app.services.course_service import CourseService

from ..state import AdvisorState
from .task_helpers import course_info, course_query, filters, task_update


def search_course_node(state: AdvisorState) -> dict:
    action = state.get("current_action")
    task_filters = filters(action)
    service = CourseService(state.get("db"))
    courses, total = service.get_courses(
        course_query(task_filters),
        status="active",
        mode=task_filters.course_mode,
        target_level=task_filters.level,
    )
    course_infos = [course_info(item) for item in courses]
    result = {
        "task": "search_course",
        "status": "ok",
        "total": total,
        "items": [item.model_dump(mode="json") for item in course_infos],
    }
    update_state = {
        "last_courses_found": course_infos,
        **task_update(state, result),
    }
    if total == 1:
        update_state["last_course_info_found"] = course_infos[0]
    return update_state
