from typing import Any

from app.services.guest_enrollment_service import GuestEnrollmentService

from ..state import AdvisorState
from .task_helpers import task_update, value


def _guest_content(state: AdvisorState, user_info: Any, course: Any, class_info: Any) -> str:
    return "\n".join(
        [
            "Khách vãng lai đăng ký tư vấn",
            f"Tên: {value(user_info, 'name')}",
            f"Số điện thoại: {value(user_info, 'phone')}",
            f"Email: {value(user_info, 'email') or 'Không cung cấp'}",
            f"Khóa học: {value(course, 'name')} ({value(course, 'code') or value(course, 'id')})",
            f"Lớp học: {value(class_info, 'class_name')} ({value(class_info, 'class_code')})",
            f"Lý do: {value(state.get('current_action'), 'reason') or 'Khách muốn đăng ký lớp học.'}",
        ]
    )


def enrollments_node(state: AdvisorState) -> dict:
    action = state.get("current_action")
    user_info = action.user_info if action and action.user_info else state.get("user_info")
    course = state.get("last_course_info_found")
    class_info = state.get("last_class_info_found")
    missing = []

    if not value(user_info, "name"):
        missing.append("tên")
    if not value(user_info, "phone"):
        missing.append("số điện thoại")
    if not course:
        missing.append("khóa học")
    if not class_info:
        missing.append("lớp học")

    if missing:
        result = {
            "task": "enrollments",
            "status": "missing_required_info",
            "missing": missing,
            "message": "Thiếu thông tin bắt buộc để ghi nhận đăng ký.",
        }
        return {
            "user_info": user_info,
            **task_update(state, result),
        }

    created = GuestEnrollmentService(state.get("db")).create_guest_enrollment(
        _guest_content(state, user_info, course, class_info),
        commit=False,
    )
    result = {
        "task": "enrollments",
        "status": "created",
        "guest_enrollment_id": str(created.id),
        "message": "Đã ghi nhận thông tin khách vãng lai để tư vấn viên liên hệ.",
    }
    updates: dict[str, Any] = {
        "user_info": user_info,
        **task_update(state, result),
    }
    return updates
