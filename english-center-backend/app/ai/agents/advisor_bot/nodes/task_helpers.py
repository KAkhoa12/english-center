from typing import Any

from app.schemas.common import PaginationParams
from app.services.course_service import CourseService

from ..schemas import Action, ClassInfo, CourseInfo, Filters, Schedules
from ..state import AdvisorState


def as_list(value: Any) -> list[Any]:
    if value is None:
        return []
    if isinstance(value, list):
        return value
    return [value]


def tool_results(state: AdvisorState, result: dict[str, Any]) -> list[dict[str, Any]]:
    return [*as_list(state.get("tool_results")), result]


def task_results(state: AdvisorState, result: dict[str, Any]) -> list[dict[str, Any]]:
    return [*as_list(state.get("task_result")), result]


def task_update(state: AdvisorState, result: dict[str, Any]) -> dict[str, list[dict[str, Any]]]:
    return {
        "tool_results": tool_results(state, result),
        "task_result": task_results(state, result),
    }


def value(item: Any, key: str) -> Any:
    if isinstance(item, dict):
        return item.get(key)
    return getattr(item, key, None)


def course_info(data: dict[str, Any]) -> CourseInfo:
    category = data.get("category") or {}
    return CourseInfo(
        id=data.get("id"),
        name=data.get("name"),
        code=data.get("code"),
        description=data.get("description"),
        category_name=category.get("name"),
        mode=data.get("mode"),
        level=data.get("target_level"),
        total_lesson=data.get("total_sessions") or data.get("lessons_count"),
        price=int(float(data.get("price") or 0)),
        status=data.get("status"),
        tags=[tag.get("name") for tag in data.get("tags", []) if tag.get("name")],
    )


def class_info(data: dict[str, Any]) -> ClassInfo:
    course = data.get("course") or {}
    teacher = data.get("teacher") or {}
    return ClassInfo(
        course_id=data.get("course_id") or course.get("id"),
        course_name=course.get("name"),
        course_code=course.get("code"),
        class_name=data.get("name"),
        class_code=data.get("code"),
        class_type=data.get("class_type"),
        max_students=data.get("max_students"),
        current_students=data.get("current_students_count") or data.get("students_count"),
        start_date=data.get("start_date"),
        class_status=data.get("status"),
        teacher_name=teacher.get("full_name"),
        schedules=[
            Schedules(
                schedule_name=schedule.get("schedule_name"),
                start_time=str(schedule.get("start_time")) if schedule.get("start_time") else None,
                end_time=str(schedule.get("end_time")) if schedule.get("end_time") else None,
            )
            for schedule in data.get("schedules", [])
        ],
    )


def filters(action: Action | None) -> Filters:
    return action.filters if action and action.filters else Filters()


def course_query(filters: Filters) -> PaginationParams:
    return PaginationParams(
        page=1,
        page_size=10,
        search=filters.name or filters.course_code,
        sort_by="created_at",
        sort_order="desc",
    )


def class_query(filters: Filters) -> PaginationParams:
    return PaginationParams(
        page=1,
        page_size=10,
        search=filters.class_code or filters.name,
        sort_by="start_date",
        sort_order="asc",
    )


def resolve_course_data(service: CourseService, state: AdvisorState, filters: Filters) -> dict[str, Any] | None:
    if filters.course_id:
        return service.course_detail_dict(service.get_course_by_id(filters.course_id))

    courses, _ = service.get_courses(
        course_query(filters),
        status="active",
        mode=filters.course_mode,
        target_level=filters.level,
    )

    if filters.course_code:
        exact = next((item for item in courses if item.get("code") == filters.course_code), None)
        if exact:
            return service.course_detail_dict(service.get_course_by_id(exact["id"]))

    if courses:
        return service.course_detail_dict(service.get_course_by_id(courses[0]["id"]))

    last_course_id = value(state.get("last_course_info_found"), "id")
    if last_course_id:
        return service.course_detail_dict(service.get_course_by_id(last_course_id))

    last_courses = state.get("last_courses_found", [])
    first_course_id = value(last_courses[0], "id") if last_courses else None
    if first_course_id:
        return service.course_detail_dict(service.get_course_by_id(first_course_id))

    return None
