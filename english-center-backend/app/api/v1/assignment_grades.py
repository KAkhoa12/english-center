from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.response import api_response, build_pagination
from app.db.session import get_db
from app.dependencies.permissions import require_permission
from app.models.user import User
from app.schemas.assignment import AssignmentGradeCreate, AssignmentGradeUpdate
from app.schemas.common import PaginationParams
from app.services.assignment_service import AssignmentGradeService, AssignmentSubmissionService

router = APIRouter(tags=["assignment-grades"])


@router.post("/submissions/{submission_id}/grade")
def grade_submission(
    submission_id: str,
    payload: AssignmentGradeCreate,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("assignment_grade.create")),
):
    service = AssignmentGradeService(db)
    grade = service.grade_submission(submission_id, payload, current_user)
    return api_response(True, "Submission graded successfully", service.grade_dict(grade), None)


@router.get("/submissions/{submission_id}/grade")
def get_submission_grade(
    submission_id: str,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("assignment_grade.read")),
):
    submission = AssignmentSubmissionService(db).get_submission_by_id(submission_id)
    AssignmentSubmissionService(db).assert_can_read_submission(submission, current_user)
    service = AssignmentGradeService(db)
    grade = service.get_grade_by_submission(submission_id)
    return api_response(True, "Assignment grade retrieved successfully", service.grade_dict(grade), None)


@router.patch("/assignment-grades/{grade_id}")
def update_grade(
    grade_id: str,
    payload: AssignmentGradeUpdate,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("assignment_grade.update")),
):
    service = AssignmentGradeService(db)
    grade = service.update_grade(grade_id, payload, current_user)
    return api_response(True, "Assignment grade updated successfully", service.grade_dict(grade), None)


@router.delete("/assignment-grades/{grade_id}")
def delete_grade(
    grade_id: str,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("assignment_grade.delete")),
):
    AssignmentGradeService(db).soft_delete_grade(grade_id, current_user)
    return api_response(True, "Assignment grade deleted successfully", None, None)


@router.get("/students/{student_id}/assignment-grades")
def get_student_grades(
    student_id: str,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("assignment_grade.read")),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    class_id: str | None = None,
    assignment_type: str | None = None,
):
    query = PaginationParams(page=page, page_size=page_size)
    service = AssignmentGradeService(db)
    items, total = service.get_student_grades(student_id, query, current_user, class_id, assignment_type)
    return api_response(True, "Student assignment grades retrieved successfully", [service.grade_dict(item) for item in items], build_pagination(page, page_size, total))
