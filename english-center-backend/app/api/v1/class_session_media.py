from typing import Annotated

from fastapi import APIRouter, Depends, File, Form, UploadFile
from sqlalchemy.orm import Session

from app.core.response import api_response
from app.db.session import get_db
from app.dependencies.auth import require_jwt
from app.dependencies.permissions import require_permission
from app.models.rbac.user import User
from app.schemas.class_session_media import ClassSessionMediaCreate, ClassSessionMediaUpdate
from app.services.class_session_media_service import ClassSessionMediaService
from app.services.class_session_service import ClassSessionService
from app.utils.file import get_upload_file_size, validate_file_extension, validate_file_size

router = APIRouter(tags=["class-session-media"])


@router.get("/sessions/{session_id}/media", dependencies=[Depends(require_permission("class_session.read"))])
def list_session_media(session_id: str, db: Annotated[Session, Depends(get_db)]):
    service = ClassSessionMediaService(db)
    items = service.list_by_session(session_id)
    return api_response(True, "Class session media retrieved successfully", [service.media_dict(item) for item in items], None)


@router.post("/sessions/{session_id}/media", dependencies=[Depends(require_permission("class_session.update"))])
def create_session_media(session_id: str, payload: ClassSessionMediaCreate, db: Annotated[Session, Depends(get_db)]):
    service = ClassSessionMediaService(db)
    item = service.create_media(session_id, payload)
    return api_response(True, "Class session media created successfully", service.media_dict(item), None)


@router.post("/sessions/{session_id}/media/upload")
def upload_session_media(
    session_id: str,
    title: Annotated[str | None, Form()] = None,
    description: Annotated[str | None, Form()] = None,
    order_index: Annotated[int, Form()] = 0,
    db: Annotated[Session, Depends(get_db)] = None,
    file: UploadFile = File(...),
    current_user: User = Depends(require_jwt),
):
    session_svc = ClassSessionService(db)
    session_svc._assert_session_access(session_svc.get_session_by_id(session_id), current_user)
    size = get_upload_file_size(file)
    validate_file_extension(file.filename or "file", "material")
    validate_file_size(size, "material")
    service = ClassSessionMediaService(db)
    item = service.upload_media_file(
        session_id=session_id,
        file=file,
        file_size=size,
        title=title,
        description=description,
        order_index=order_index,
        uploaded_by=str(current_user.id),
    )
    return api_response(True, "Class session media uploaded successfully", service.media_dict(item), None)


@router.patch("/sessions/media/{media_id}", dependencies=[Depends(require_permission("class_session.update"))])
def update_session_media(media_id: str, payload: ClassSessionMediaUpdate, db: Annotated[Session, Depends(get_db)]):
    service = ClassSessionMediaService(db)
    item = service.update_media(media_id, payload)
    return api_response(True, "Class session media updated successfully", service.media_dict(item), None)


@router.delete("/sessions/media/{media_id}", dependencies=[Depends(require_permission("class_session.update"))])
def delete_session_media(media_id: str, db: Annotated[Session, Depends(get_db)]):
    ClassSessionMediaService(db).soft_delete_media(media_id)
    return api_response(True, "Class session media deleted successfully", None, None)
