from typing import Annotated

from fastapi import APIRouter, Depends, File, Form, UploadFile
from sqlalchemy.orm import Session

from app.core.response import api_response
from app.db.session import get_db
from app.dependencies.permissions import require_permission
from app.models.rbac.user import User
from app.schemas.course import LessonMaterialCreate, LessonMaterialUpdate, LessonThumbnailUpdate
from app.services.course_service import LessonMaterialService
from app.utils.file import get_upload_file_size, validate_file_extension, validate_file_size

router = APIRouter(tags=["lesson-materials"])


@router.post("/lessons/{lesson_id}/materials")
def create_material(
    lesson_id: str,
    payload: LessonMaterialCreate,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("lesson_material.create")),
):
    service = LessonMaterialService(db)
    material = service.create_material(lesson_id, payload, created_by=str(current_user.id))
    return api_response(True, "Lesson material created successfully", service.material_dict(material), None)


@router.get("/lessons/{lesson_id}/materials", dependencies=[Depends(require_permission("lesson_material.read"))])
def list_materials(lesson_id: str, db: Annotated[Session, Depends(get_db)]):
    service = LessonMaterialService(db)
    items = service.get_materials_by_lesson(lesson_id)
    return api_response(True, "Lesson materials retrieved successfully", [service.material_dict(item) for item in items], None)


@router.get("/lesson-materials/{material_id}", dependencies=[Depends(require_permission("lesson_material.read"))])
def get_material(material_id: str, db: Annotated[Session, Depends(get_db)]):
    service = LessonMaterialService(db)
    material = service.get_material_by_id(material_id)
    return api_response(True, "Lesson material retrieved successfully", service.material_dict(material), None)


@router.patch("/lesson-materials/{material_id}", dependencies=[Depends(require_permission("lesson_material.update"))])
def update_material(material_id: str, payload: LessonMaterialUpdate, db: Annotated[Session, Depends(get_db)]):
    service = LessonMaterialService(db)
    material = service.update_material(material_id, payload)
    return api_response(True, "Lesson material updated successfully", service.material_dict(material), None)


@router.post("/lessons/{lesson_id}/materials/upload")
def upload_material(
    lesson_id: str,
    title: Annotated[str, Form(...)],
    db: Annotated[Session, Depends(get_db)],
    file: UploadFile = File(...),
    description: Annotated[str | None, Form()] = None,
    external_url: Annotated[str | None, Form()] = None,
    order_index: Annotated[int, Form()] = 0,
    is_downloadable: Annotated[bool, Form()] = True,
    current_user: User = Depends(require_permission("lesson_material.create")),
):
    size = get_upload_file_size(file)
    validate_file_extension(file.filename or "file", "avatar")
    validate_file_size(size, "avatar")
    service = LessonMaterialService(db)
    material = service.upload_material_file(
        lesson_id=lesson_id,
        title=title,
        file=file,
        file_size=size,
        description=description,
        external_url=external_url,
        order_index=order_index,
        is_downloadable=is_downloadable,
        created_by=str(current_user.id),
    )
    return api_response(True, "Lesson material uploaded successfully", service.material_dict(material), None)


@router.patch("/lesson-materials/{material_id}/media", dependencies=[Depends(require_permission("lesson_material.update"))])
def set_material_media(material_id: str, payload: LessonThumbnailUpdate, db: Annotated[Session, Depends(get_db)]):
    service = LessonMaterialService(db)
    material = service.set_material_media(material_id, payload.media_id)
    return api_response(True, "Lesson material media updated successfully", service.material_dict(material), None)


@router.delete("/lesson-materials/{material_id}", dependencies=[Depends(require_permission("lesson_material.delete"))])
def delete_material(material_id: str, db: Annotated[Session, Depends(get_db)]):
    LessonMaterialService(db).soft_delete_material(material_id)
    return api_response(True, "Lesson material deleted successfully", None, None)
