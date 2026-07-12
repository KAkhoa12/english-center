from typing import Annotated

from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session

from app.core.response import api_response
from app.db.session import get_db
from app.dependencies.permissions import require_permission
from app.models.rbac.user import User
from app.schemas.assignment import SubmissionAttachmentCreate
from app.services.assignment_service import AssignmentSubmissionService, SubmissionAttachmentService
from app.services.media_service import MediaService
from app.utils.file import get_upload_file_size, validate_file_extension, validate_file_size

router = APIRouter(tags=["submission-attachments"])


@router.post("/submissions/{submission_id}/attachments")
def create_submission_attachment(
    submission_id: str,
    payload: SubmissionAttachmentCreate,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("submission_attachment.create")),
):
    service = SubmissionAttachmentService(db)
    item = service.create_submission_attachment(submission_id, payload, current_user)
    return api_response(True, "Submission attachment created successfully", service.attachment_dict(item), None)


@router.post("/submissions/{submission_id}/attachments/upload")
def upload_submission_attachment(
    submission_id: str,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("submission_attachment.create")),
    file: UploadFile = File(...),
):
    file_size = get_upload_file_size(file)
    validate_file_extension(file.filename, "submission")
    validate_file_size(file_size, "submission")
    media = MediaService(db).upload_media(
        bucket_name="submissions",
        file=file,
        file_size=file_size,
        folder=f"submissions/{submission_id}",
        uploaded_by=str(current_user.id),
    )
    payload = SubmissionAttachmentCreate(media_id=str(media.id), original_filename=file.filename)
    service = SubmissionAttachmentService(db)
    item = service.create_submission_attachment(submission_id, payload, current_user)
    return api_response(True, "Submission attachment uploaded successfully", service.attachment_dict(item), None)


@router.get("/submissions/{submission_id}/attachments")
def list_submission_attachments(
    submission_id: str,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("submission_attachment.read")),
):
    submission = AssignmentSubmissionService(db).get_submission_by_id(submission_id)
    AssignmentSubmissionService(db).assert_can_read_submission(submission, current_user)
    service = SubmissionAttachmentService(db)
    return api_response(True, "Submission attachments retrieved successfully", [service.attachment_dict(item) for item in service.get_attachments_by_submission(submission_id)], None)


@router.delete("/submission-attachments/{attachment_id}")
def delete_submission_attachment(
    attachment_id: str,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("submission_attachment.delete")),
):
    SubmissionAttachmentService(db).soft_delete_submission_attachment(attachment_id, current_user)
    return api_response(True, "Submission attachment deleted successfully", None, None)
