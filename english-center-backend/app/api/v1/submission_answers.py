from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.response import api_response
from app.db.session import get_db
from app.dependencies.permissions import require_permission
from app.models.rbac.user import User
from app.schemas.assignment import SubmissionAnswerCreate, SubmissionAnswerUpdate
from app.services.assignment_service import SubmissionAnswerService

router = APIRouter(tags=["submission-answers"])


@router.post("/submissions/{submission_id}/answers")
def create_submission_answer(
    submission_id: str,
    payload: SubmissionAnswerCreate,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("assignment_submission.update")),
):
    service = SubmissionAnswerService(db)
    item = service.create_answer(submission_id, payload, current_user)
    return api_response(True, "Submission answer created successfully", service.answer_dict(item), None)


@router.get("/submissions/{submission_id}/answers")
def list_submission_answers(
    submission_id: str,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("assignment_submission.read")),
):
    service = SubmissionAnswerService(db)
    items = service.list_answers(submission_id, current_user)
    return api_response(True, "Submission answers retrieved successfully", [service.answer_dict(item) for item in items], None)


@router.patch("/submission-answers/{answer_id}")
def update_submission_answer(
    answer_id: str,
    payload: SubmissionAnswerUpdate,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("assignment_submission.update")),
):
    service = SubmissionAnswerService(db)
    item = service.update_answer(answer_id, payload, current_user)
    return api_response(True, "Submission answer updated successfully", service.answer_dict(item), None)


@router.delete("/submission-answers/{answer_id}")
def delete_submission_answer(
    answer_id: str,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("assignment_submission.update")),
):
    SubmissionAnswerService(db).soft_delete_answer(answer_id, current_user)
    return api_response(True, "Submission answer deleted successfully", None, None)
