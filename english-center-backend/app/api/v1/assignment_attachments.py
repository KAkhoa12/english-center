from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.response import api_response
from app.db.session import get_db
from app.dependencies.permissions import require_permission
from app.models.user import User
from app.schemas.assignment import AssignmentAttachmentCreate, AssignmentAttachmentUpdate
from app.services.assignment_service import AssignmentAttachmentService, AssignmentService

router = APIRouter(tags=["assignment-attachments"])


@router.post("/assignments/{assignment_id}/attachments")
def create_assignment_attachment(
    assignment_id: str,
    payload: AssignmentAttachmentCreate,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("assignment_attachment.create")),
):
    service = AssignmentAttachmentService(db)
    item = service.create_attachment(assignment_id, payload, current_user)
    return api_response(True, "Assignment attachment created successfully", service.attachment_dict(item), None)


@router.get("/assignments/{assignment_id}/attachments")
def list_assignment_attachments(
    assignment_id: str,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("assignment_attachment.read")),
):
    assignment = AssignmentService(db).get_assignment_by_id(assignment_id)
    AssignmentService(db).assert_can_read_assignment(assignment, current_user)
    service = AssignmentAttachmentService(db)
    return api_response(True, "Assignment attachments retrieved successfully", [service.attachment_dict(item) for item in service.get_attachments_by_assignment(assignment_id)], None)


@router.patch("/assignment-attachments/{attachment_id}")
def update_assignment_attachment(
    attachment_id: str,
    payload: AssignmentAttachmentUpdate,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("assignment_attachment.update")),
):
    service = AssignmentAttachmentService(db)
    item = service.update_attachment(attachment_id, payload, current_user)
    return api_response(True, "Assignment attachment updated successfully", service.attachment_dict(item), None)


@router.delete("/assignment-attachments/{attachment_id}")
def delete_assignment_attachment(
    attachment_id: str,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("assignment_attachment.delete")),
):
    AssignmentAttachmentService(db).soft_delete_attachment(attachment_id, current_user)
    return api_response(True, "Assignment attachment deleted successfully", None, None)
