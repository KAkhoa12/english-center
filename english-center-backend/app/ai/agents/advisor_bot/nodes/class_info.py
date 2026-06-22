from app.services.class_service import ClassService

from ..schemas import Filters
from ..state import AdvisorState
from .task_helpers import class_info, class_query, filters, task_update, value


def _resolve_class_data(service: ClassService, task_filters: Filters) -> dict | None:
    if task_filters.class_id:
        return service.class_detail_dict(service.get_class_by_id(task_filters.class_id))

    classes, _ = service.get_classes(class_query(task_filters), course_id=task_filters.course_id)
    if task_filters.class_code:
        exact = next((item for item in classes if item.code == task_filters.class_code), None)
        if exact:
            return service.class_detail_dict(exact)

    return service.class_detail_dict(classes[0]) if classes else None


def class_info_node(state: AdvisorState) -> dict:
    service = ClassService(state.get("db"))
    task_filters = filters(state.get("current_action"))
    class_data = _resolve_class_data(service, task_filters)

    if not class_data:
        last_class_code = value(state.get("last_class_info_found"), "class_code")
        if last_class_code:
            task_filters.class_code = last_class_code
            class_data = _resolve_class_data(service, task_filters)

    if not class_data:
        result = {"task": "class_info", "status": "not_found", "message": "Không tìm thấy lớp học phù hợp."}
        return {
            **task_update(state, result),
        }

    info = class_info(class_data)
    result = {
        "task": "class_info",
        "status": "ok",
        "item": info.model_dump(mode="json"),
        "detail": class_data,
    }
    return {
        "last_class_info_found": info,
        **task_update(state, result),
    }
