from app.services.course_service import CourseService

from ..state import AdvisorState
from .task_helpers import course_info, filters, resolve_course_data, task_update


def course_info_node(state: AdvisorState) -> dict:
    service = CourseService(state.get("db"))
    course_data = resolve_course_data(service, state, filters(state.get("current_action")))

    if not course_data:
        result = {"task": "course_info", "status": "not_found", "message": "Không tìm thấy khóa học phù hợp."}
        return {
            **task_update(state, result),
        }

    info = course_info(course_data)
    result = {
        "task": "course_info",
        "status": "ok",
        "item": info.model_dump(mode="json"),
        "detail": course_data,
    }
    return {
        "last_course_info_found": info,
        **task_update(state, result),
    }
