from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.response import api_response
from app.db.session import get_db
from app.dependencies.permissions import require_permission
from app.models.rbac.user import User
from app.schemas.assignment import AssignmentQuestionOptionCreate, AssignmentQuestionOptionUpdate
from app.services.assignment_service import AssignmentQuestionOptionService

router = APIRouter(tags=["assignment-question-options"])


@router.post("/assignment-questions/{question_id}/options")
def create_assignment_question_option(
    question_id: str,
    payload: AssignmentQuestionOptionCreate,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("assignment.update")),
):
    service = AssignmentQuestionOptionService(db)
    item = service.create_option(question_id, payload, current_user)
    return api_response(True, "Assignment question option created successfully", service.option_dict(item), None)


@router.get("/assignment-questions/{question_id}/options")
def list_assignment_question_options(
    question_id: str,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("assignment.read")),
):
    service = AssignmentQuestionOptionService(db)
    items = service.list_options(question_id, current_user)
    return api_response(True, "Assignment question options retrieved successfully", [service.option_dict(item) for item in items], None)


@router.patch("/assignment-question-options/{option_id}")
def update_assignment_question_option(
    option_id: str,
    payload: AssignmentQuestionOptionUpdate,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("assignment.update")),
):
    service = AssignmentQuestionOptionService(db)
    item = service.update_option(option_id, payload, current_user)
    return api_response(True, "Assignment question option updated successfully", service.option_dict(item), None)


@router.delete("/assignment-question-options/{option_id}")
def delete_assignment_question_option(
    option_id: str,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("assignment.update")),
):
    AssignmentQuestionOptionService(db).soft_delete_option(option_id, current_user)
    return api_response(True, "Assignment question option deleted successfully", None, None)
