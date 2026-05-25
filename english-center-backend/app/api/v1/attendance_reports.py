from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.response import api_response, build_pagination
from app.db.session import get_db
from app.dependencies.auth import require_jwt
from app.dependencies.permissions import require_permission
from app.models.user import User
from app.schemas.common import PaginationParams
from app.services.attendance_service import AttendanceReportService

router = APIRouter(tags=["attendance-reports"])


@router.get("/classes/{class_id}/attendance/summary", dependencies=[Depends(require_permission("attendance_report.read"))])
def get_class_attendance_summary(class_id: str, db: Annotated[Session, Depends(get_db)]):
    return api_response(True, "Class attendance summary retrieved successfully", AttendanceReportService(db).get_class_attendance_summary(class_id), None)


@router.get("/classes/{class_id}/attendance/students-summary", dependencies=[Depends(require_permission("attendance_report.read"))])
def get_class_students_summary(
    class_id: str,
    db: Annotated[Session, Depends(get_db)],
    page: int = Query(1),
    page_size: int = Query(10),
    search: str | None = None,
):
    query = PaginationParams(page=page, page_size=page_size, search=search)
    items, total = AttendanceReportService(db).get_class_students_attendance_summary(class_id, query)
    return api_response(True, "Class students attendance summary retrieved successfully", items, build_pagination(page, page_size, total))


@router.get("/students/{student_id}/attendance/summary", dependencies=[Depends(require_permission("attendance_report.read"))])
def get_student_attendance_summary(
    student_id: str,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_jwt),
):
    return api_response(True, "Student attendance summary retrieved successfully", AttendanceReportService(db).get_student_attendance_summary(student_id, current_user), None)

