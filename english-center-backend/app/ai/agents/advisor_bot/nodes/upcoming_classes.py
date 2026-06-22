from app.schemas.common import PaginationParams
from app.services.class_service import ClassService
from app.services.course_service import CourseService

from ..state import AdvisorState
from .task_helpers import class_info, course_info, filters, resolve_course_data, task_update


def upcoming_classes_node(state: AdvisorState) -> dict:
    db = state.get("db")
    course_service = CourseService(db)
    class_service = ClassService(db)
    course_data = resolve_course_data(course_service, state, filters(state.get("current_action")))

    if not course_data:
        result = {"task": "upcoming_classes", "status": "not_found", "message": "Không xác định được khóa học."}
        return {
            **task_update(state, result),
        }

    classes, total = class_service.get_classes_by_course(
        course_data["id"],
        PaginationParams(page=1, page_size=10, sort_by="start_date", sort_order="asc"),
        status="planned",
    )
    class_infos = [class_info(class_service.class_list_dict(item)) for item in classes]
    selected_course = course_info(course_data)
    result = {
        "task": "upcoming_classes",
        "status": "ok",
        "total": total,
        "course": selected_course.model_dump(mode="json"),
        "items": [item.model_dump(mode="json") for item in class_infos],
    }

    return {
        "last_course_info_found": selected_course,
        "last_classes_found": class_infos,
        **task_update(state, result),
    }
