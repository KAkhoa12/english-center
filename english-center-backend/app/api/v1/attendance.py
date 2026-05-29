from datetime import date
from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.response import api_response, build_pagination
from app.db.session import get_db
from app.dependencies.auth import require_jwt
from app.dependencies.permissions import require_permission
from app.models.rbac.user import User
from app.schemas.attendance import AttendanceBulkItem, AttendanceUpdateRequest
from app.schemas.common import PaginationParams
from app.services.attendance_service import AttendanceService

router = APIRouter(tags=["attendance"])


@router.post("/sessions/{session_id}/attendance", dependencies=[Depends(require_permission("attendance.create"))])
def mark_attendance(
    session_id: str,
    payload: list[AttendanceBulkItem],
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_jwt),
):
    service = AttendanceService(db)
    items = service.mark_attendance_bulk(session_id, payload, current_user)
    return api_response(True, "Attendance marked successfully", [service.attendance_dict(item) for item in items], None)


@router.get("/sessions/{session_id}/attendance", dependencies=[Depends(require_permission("attendance.read"))])
def get_session_attendance(
    session_id: str,
    db: Annotated[Session, Depends(get_db)],
    page: int = Query(1),
    page_size: int = Query(10),
    search: str | None = None,
    status: str | None = None,
):
    query = PaginationParams(page=page, page_size=page_size, search=search)
    items, total = AttendanceService(db).get_attendance_by_session(session_id, query, status)
    return api_response(True, "Session attendance retrieved successfully", items, build_pagination(page, page_size, total))


@router.patch("/attendance/{attendance_id}", dependencies=[Depends(require_permission("attendance.update"))])
def update_attendance(
    attendance_id: str,
    payload: AttendanceUpdateRequest,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_jwt),
):
    service = AttendanceService(db)
    item = service.update_attendance(attendance_id, payload, current_user)
    return api_response(True, "Attendance updated successfully", service.attendance_dict(item), None)


@router.delete("/attendance/{attendance_id}", dependencies=[Depends(require_permission("attendance.delete"))])
def delete_attendance(attendance_id: str, db: Annotated[Session, Depends(get_db)], current_user: User = Depends(require_jwt)):
    AttendanceService(db).soft_delete_attendance(attendance_id, current_user)
    return api_response(True, "Attendance deleted successfully", None, None)


@router.get("/classes/{class_id}/attendance", dependencies=[Depends(require_permission("attendance.read"))])
def get_class_attendance(
    class_id: str,
    db: Annotated[Session, Depends(get_db)],
    page: int = Query(1),
    page_size: int = Query(10),
    session_id: str | None = None,
    student_id: str | None = None,
    status: str | None = None,
    from_date: date | None = None,
    to_date: date | None = None,
):
    query = PaginationParams(page=page, page_size=page_size)
    service = AttendanceService(db)
    items, total = service.get_attendance_by_class(class_id, query, session_id, student_id, status, from_date, to_date)
    return api_response(True, "Class attendance retrieved successfully", [service.attendance_dict(item) for item in items], build_pagination(page, page_size, total))


@router.get("/students/{student_id}/attendance", dependencies=[Depends(require_permission("attendance.read"))])
def get_student_attendance(
    student_id: str,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_jwt),
    page: int = Query(1),
    page_size: int = Query(10),
    class_id: str | None = None,
):
    query = PaginationParams(page=page, page_size=page_size)
    service = AttendanceService(db)
    items, total = service.get_attendance_by_student(student_id, query, current_user, class_id)
    return api_response(True, "Student attendance retrieved successfully", [service.attendance_dict(item) for item in items], build_pagination(page, page_size, total))


@router.get("/students/me/attendance")
def get_my_attendance(
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_jwt),
    page: int = Query(1),
    page_size: int = Query(10),
):
    query = PaginationParams(page=page, page_size=page_size)
    service = AttendanceService(db)
    items, total = service.get_my_attendance(query, current_user)
    return api_response(True, "My attendance retrieved successfully", [service.attendance_dict(item) for item in items], build_pagination(page, page_size, total))
