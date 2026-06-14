from typing import Annotated

from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from app.core.response import api_response
from app.db.session import get_db
from app.dependencies.permissions import require_permission
from app.schemas.course import CourseModuleCreate, CourseModuleUpdate
from app.services.course_service import CourseModuleService
from app.utils.file import get_upload_file_size, validate_file_extension, validate_file_size

router = APIRouter(tags=["course-modules"])


@router.post("/courses/{course_id}/modules", dependencies=[Depends(require_permission("course_module.create"))])
def create_module(course_id: str, payload: CourseModuleCreate, db: Annotated[Session, Depends(get_db)]):
    service = CourseModuleService(db)
    module = service.create_module(course_id, payload)
    return api_response(True, "Course module created successfully", service._module_dict(module), None)


@router.get("/courses/{course_id}/modules", dependencies=[Depends(require_permission("course_module.read"))])
def list_modules(course_id: str, db: Annotated[Session, Depends(get_db)]):
    service = CourseModuleService(db)
    items = service.get_modules_by_course(course_id)
    return api_response(True, "Course modules retrieved successfully", [service._module_dict(item) for item in items], None)


@router.get("/course-modules/{module_id}", dependencies=[Depends(require_permission("course_module.read"))])
def get_module(module_id: str, db: Annotated[Session, Depends(get_db)]):
    service = CourseModuleService(db)
    module = service.get_module_by_id(module_id)
    return api_response(True, "Course module retrieved successfully", service.module_detail_dict(module), None)


@router.patch("/course-modules/{module_id}", dependencies=[Depends(require_permission("course_module.update"))])
def update_module(module_id: str, payload: CourseModuleUpdate, db: Annotated[Session, Depends(get_db)]):
    service = CourseModuleService(db)
    module = service.update_module(module_id, payload)
    return api_response(True, "Course module updated successfully", service._module_dict(module), None)


@router.post("/course-modules/{module_id}/media", dependencies=[Depends(require_permission("course_module.update"))])
def upload_module_media(module_id: str, db: Annotated[Session, Depends(get_db)], file: UploadFile = File(...)):
    size = get_upload_file_size(file)
    validate_file_extension(file.filename or "file", "media")
    validate_file_size(size, "media")
    service = CourseModuleService(db)
    module = service.upload_module_media(module_id, file=file, file_size=size)
    return api_response(True, "Course module media uploaded successfully", service.module_detail_dict(module), None)


@router.delete("/course-modules/{module_id}", dependencies=[Depends(require_permission("course_module.delete"))])
def delete_module(module_id: str, db: Annotated[Session, Depends(get_db)]):
    CourseModuleService(db).soft_delete_module(module_id)
    return api_response(True, "Course module deleted successfully", None, None)
