from typing import Annotated

from fastapi import APIRouter, Depends, File, Query, UploadFile
from sqlalchemy.orm import Session

from app.core.response import api_response, build_pagination
from app.db.session import get_db
from app.dependencies.permissions import require_permission
from app.models.rbac.user import User
from app.schemas.common import PaginationParams
from app.schemas.course import LessonCreate, LessonThumbnailUpdate, LessonUpdate
from app.services.course_service import LessonService
from app.utils.file import get_upload_file_size, validate_file_extension, validate_file_size

router = APIRouter(tags=["lessons"])


@router.post("/courses/{course_id}/lessons")
def create_lesson(
    course_id: str,
    payload: LessonCreate,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("lesson.create")),
):
    service = LessonService(db)
    lesson = service.create_lesson(course_id, payload, created_by=str(current_user.id))
    return api_response(True, "Lesson created successfully", service.lesson_detail_dict(lesson), None)


@router.get("/courses/{course_id}/lessons", dependencies=[Depends(require_permission("lesson.read"))])
def list_lessons(
    course_id: str,
    db: Annotated[Session, Depends(get_db)],
    page: int = Query(1),
    page_size: int = Query(10),
    search: str | None = None,
    sort_by: str | None = None,
    sort_order: str = Query("asc", pattern="^(asc|desc)$"),
    module_id: str | None = None,
    status: str | None = None,
):
    query = PaginationParams(page=page, page_size=page_size, search=search, sort_by=sort_by, sort_order=sort_order)
    items, total = LessonService(db).get_lessons_by_course(course_id, query, module_id, status)
    return api_response(True, "Lessons retrieved successfully", [LessonService(db).lesson_list_dict(item) for item in items], build_pagination(page, page_size, total))


@router.get("/lessons/{lesson_id}", dependencies=[Depends(require_permission("lesson.read"))])
def get_lesson(lesson_id: str, db: Annotated[Session, Depends(get_db)]):
    service = LessonService(db)
    lesson = service.get_lesson_by_id(lesson_id)
    return api_response(True, "Lesson retrieved successfully", service.lesson_detail_dict(lesson), None)


@router.patch("/lessons/{lesson_id}", dependencies=[Depends(require_permission("lesson.update"))])
def update_lesson(lesson_id: str, payload: LessonUpdate, db: Annotated[Session, Depends(get_db)]):
    service = LessonService(db)
    lesson = service.update_lesson(lesson_id, payload)
    return api_response(True, "Lesson updated successfully", service.lesson_detail_dict(lesson), None)


@router.post("/lessons/{lesson_id}/thumbnail", dependencies=[Depends(require_permission("lesson.update"))])
def upload_lesson_thumbnail(lesson_id: str, db: Annotated[Session, Depends(get_db)], file: UploadFile = File(...)):
    size = get_upload_file_size(file)
    validate_file_extension(file.filename or "file", "media")
    validate_file_size(size, "media")
    lesson = LessonService(db).upload_thumbnail(lesson_id, file=file, file_size=size)
    return api_response(True, "Lesson thumbnail uploaded successfully", LessonService(db).lesson_detail_dict(lesson), None)


@router.patch("/lessons/{lesson_id}/thumbnail", dependencies=[Depends(require_permission("lesson.update"))])
def set_lesson_thumbnail(lesson_id: str, payload: LessonThumbnailUpdate, db: Annotated[Session, Depends(get_db)]):
    lesson = LessonService(db).set_thumbnail_media(lesson_id, payload.media_id)
    return api_response(True, "Lesson thumbnail updated successfully", LessonService(db).lesson_detail_dict(lesson), None)


@router.delete("/lessons/{lesson_id}", dependencies=[Depends(require_permission("lesson.delete"))])
def delete_lesson(lesson_id: str, db: Annotated[Session, Depends(get_db)]):
    LessonService(db).soft_delete_lesson(lesson_id)
    return api_response(True, "Lesson deleted successfully", None, None)
