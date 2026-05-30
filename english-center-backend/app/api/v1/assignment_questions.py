from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.response import api_response
from app.db.session import get_db
from app.dependencies.permissions import require_permission
from app.models.rbac.user import User
from app.schemas.assignment import AssignmentQuestionCreate, AssignmentQuestionUpdate
from app.services.assignment_service import AssignmentQuestionService

router = APIRouter(tags=["assignment-questions"])


@router.post("/assignments/{assignment_id}/questions")
def create_assignment_question(
    assignment_id: str,
    payload: AssignmentQuestionCreate,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("assignment.update")),
):
    service = AssignmentQuestionService(db)
    item = service.create_question(assignment_id, payload, current_user)
    return api_response(True, "Assignment question created successfully", service._question_dict(item), None)


@router.get("/assignments/{assignment_id}/questions")
def list_assignment_questions(
    assignment_id: str,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("assignment.read")),
):
    service = AssignmentQuestionService(db)
    items = service.list_questions(assignment_id, current_user)
    return api_response(True, "Assignment questions retrieved successfully", [service._question_dict(item) for item in items], None)


@router.patch("/assignment-questions/{question_id}")
def update_assignment_question(
    question_id: str,
    payload: AssignmentQuestionUpdate,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("assignment.update")),
):
    service = AssignmentQuestionService(db)
    item = service.update_question(question_id, payload, current_user)
    return api_response(True, "Assignment question updated successfully", service._question_dict(item), None)


@router.delete("/assignment-questions/{question_id}")
def delete_assignment_question(
    question_id: str,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("assignment.update")),
):
    AssignmentQuestionService(db).soft_delete_question(question_id, current_user)
    return api_response(True, "Assignment question deleted successfully", None, None)
