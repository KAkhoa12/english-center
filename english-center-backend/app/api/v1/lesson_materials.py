from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.response import api_response
from app.db.session import get_db
from app.dependencies.permissions import require_permission
from app.models.user import User
from app.schemas.course import LessonMaterialCreate, LessonMaterialUpdate
from app.services.course_service import LessonMaterialService

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


@router.delete("/lesson-materials/{material_id}", dependencies=[Depends(require_permission("lesson_material.delete"))])
def delete_material(material_id: str, db: Annotated[Session, Depends(get_db)]):
    LessonMaterialService(db).soft_delete_material(material_id)
    return api_response(True, "Lesson material deleted successfully", None, None)
