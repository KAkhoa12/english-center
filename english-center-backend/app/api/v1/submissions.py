from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.response import api_response, build_pagination
from app.db.session import get_db
from app.dependencies.permissions import require_permission
from app.models.user import User
from app.schemas.assignment import AssignmentSubmissionCreate, AssignmentSubmissionUpdate
from app.schemas.common import PaginationParams
from app.services.assignment_service import AssignmentSubmissionService

router = APIRouter(tags=["submissions"])


@router.post("/assignments/{assignment_id}/submissions")
def submit_assignment(
    assignment_id: str,
    payload: AssignmentSubmissionCreate,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("assignment_submission.create")),
):
    service = AssignmentSubmissionService(db)
    item = service.submit_assignment(assignment_id, payload, current_user)
    return api_response(True, "Assignment submitted successfully", service.submission_dict(item, current_user), None)


@router.get("/assignments/{assignment_id}/submissions")
def list_assignment_submissions(
    assignment_id: str,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("assignment_submission.read")),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    search: str | None = None,
    status: str | None = None,
    is_late: bool | None = None,
    graded: bool | None = None,
):
    query = PaginationParams(page=page, page_size=page_size, search=search)
    service = AssignmentSubmissionService(db)
    items, total = service.get_submissions_by_assignment(assignment_id, query, current_user, status, is_late, graded)
    return api_response(True, "Assignment submissions retrieved successfully", [service.submission_dict(item, current_user) for item in items], build_pagination(page, page_size, total))


@router.get("/submissions/{submission_id}")
def get_submission(
    submission_id: str,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("assignment_submission.read")),
):
    service = AssignmentSubmissionService(db)
    item = service.get_submission_by_id(submission_id)
    service.assert_can_read_submission(item, current_user)
    return api_response(True, "Submission retrieved successfully", service.submission_dict(item, current_user), None)


@router.patch("/submissions/{submission_id}")
def update_submission(
    submission_id: str,
    payload: AssignmentSubmissionUpdate,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("assignment_submission.update")),
):
    service = AssignmentSubmissionService(db)
    item = service.update_submission(submission_id, payload, current_user)
    return api_response(True, "Submission updated successfully", service.submission_dict(item, current_user), None)


@router.delete("/submissions/{submission_id}")
def delete_submission(
    submission_id: str,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("assignment_submission.delete")),
):
    AssignmentSubmissionService(db).soft_delete_submission(submission_id, current_user)
    return api_response(True, "Submission deleted successfully", None, None)


@router.get("/students/me/submissions")
def my_submissions(
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("assignment_submission.read")),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    class_id: str | None = None,
    assignment_id: str | None = None,
    status: str | None = None,
    graded: bool | None = None,
):
    query = PaginationParams(page=page, page_size=page_size)
    service = AssignmentSubmissionService(db)
    items, total = service.get_my_submissions(current_user, query, class_id, assignment_id, status, graded)
    return api_response(True, "My submissions retrieved successfully", [service.submission_dict(item, current_user) for item in items], build_pagination(page, page_size, total))
