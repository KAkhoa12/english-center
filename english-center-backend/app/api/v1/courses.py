from typing import Annotated

from fastapi import APIRouter, Depends, File, Query, UploadFile
from sqlalchemy.orm import Session

from app.core.response import api_response, build_pagination
from app.db.session import get_db
from app.dependencies.permissions import require_permission
from app.schemas.common import PaginationParams
from app.schemas.course import (
    CourseCreate,
    CourseMediaCreate,
    CourseMediaUpdate,
    CourseOutcomeCreate,
    CourseOutcomeUpdate,
    CourseRequirementCreate,
    CourseRequirementUpdate,
    CourseUpdate,
)
from app.services.course_service import CourseMediaService, CourseOutcomeService, CourseRequirementService, CourseService
from app.utils.file import get_upload_file_size, validate_file_extension, validate_file_size

router = APIRouter(tags=["courses"])


@router.post("/courses", dependencies=[Depends(require_permission("course.create"))])
def create_course(payload: CourseCreate, db: Annotated[Session, Depends(get_db)]):
    service = CourseService(db)
    course = service.create_course(payload)
    return api_response(True, "Course created successfully", service.course_detail_dict(course), None)


@router.get("/courses")
def list_courses(
    db: Annotated[Session, Depends(get_db)],
    page: int = Query(1),
    page_size: int = Query(10),
    search: str | None = None,
    sort_by: str | None = None,
    sort_order: str = Query("desc", pattern="^(asc|desc)$"),
    status: str | None = None,
    mode: str | None = None,
    target_level: str | None = None,
    category_id: str | None = None,
    tag_id: str | None = None,
    tag_ids: list[str] | None = Query(None),
    min_price: float | None = None,
    max_price: float | None = None,
):
    query = PaginationParams(page=page, page_size=page_size, search=search, sort_by=sort_by, sort_order=sort_order)
    items, total = CourseService(db).get_courses(
        query,
        status=status,
        mode=mode,
        target_level=target_level,
        category_id=category_id,
        tag_id=tag_id,
        tag_ids=tag_ids,
        min_price=min_price,
        max_price=max_price,
    )
    return api_response(True, "Courses retrieved successfully", items, build_pagination(page, page_size, total))


@router.get("/courses/slug/{slug}")
def get_course_by_slug(slug: str, db: Annotated[Session, Depends(get_db)]):
    service = CourseService(db)
    course = service.get_course_by_slug(slug)
    return api_response(True, "Course retrieved successfully", service.course_detail_dict(course), None)


@router.get("/courses/statistics/{mode}", dependencies=[Depends(require_permission("course.read"))])
def get_course_statistics(mode: str, db: Annotated[Session, Depends(get_db)]):
    service = CourseService(db)
    return api_response(True, "Course statistics retrieved successfully", service.get_course_statistics(mode), None)


@router.get("/courses/{course_id}")
def get_course(course_id: str, db: Annotated[Session, Depends(get_db)]):
    service = CourseService(db)
    course = service.get_course_by_id(course_id)
    return api_response(True, "Course retrieved successfully", service.course_detail_dict(course), None)


@router.patch("/courses/{course_id}", dependencies=[Depends(require_permission("course.update"))])
def update_course(course_id: str, payload: CourseUpdate, db: Annotated[Session, Depends(get_db)]):
    service = CourseService(db)
    course = service.update_course(course_id, payload)
    return api_response(True, "Course updated successfully", service.course_detail_dict(course), None)


@router.post("/courses/{course_id}/thumbnail", dependencies=[Depends(require_permission("course.update"))])
def upload_course_thumbnail(course_id: str, db: Annotated[Session, Depends(get_db)], file: UploadFile = File(...)):
    size = get_upload_file_size(file)
    validate_file_extension(file.filename or "file", "avatar")
    validate_file_size(size, "avatar")
    payload = CourseService(db).upload_course_thumbnail(course_id, file=file, file_size=size)
    return api_response(True, "Course thumbnail uploaded successfully", payload, None)


@router.post("/courses/{course_id}/media", dependencies=[Depends(require_permission("course.update"))])
def attach_course_media(course_id: str, payload: CourseMediaCreate, db: Annotated[Session, Depends(get_db)]):
    item = CourseMediaService(db).attach_media(course_id, payload)
    return api_response(True, "Course media attached successfully", item, None)


@router.get("/courses/{course_id}/media")
def list_course_media(course_id: str, db: Annotated[Session, Depends(get_db)]):
    items = CourseMediaService(db).list_media(course_id)
    return api_response(True, "Course media retrieved successfully", items, None)


@router.post("/courses/{course_id}/media/upload", dependencies=[Depends(require_permission("course.update"))])
def upload_course_media(course_id: str, db: Annotated[Session, Depends(get_db)], file: UploadFile = File(...)):
    size = get_upload_file_size(file)
    validate_file_extension(file.filename or "file", "avatar")
    validate_file_size(size, "avatar")
    item = CourseMediaService(db).upload_and_attach_media(course_id, file=file, file_size=size, media_type="thumbnail", is_primary=True)
    return api_response(True, "Course media uploaded successfully", item, None)


@router.post("/courses/{course_id}/media/bulk-upload", dependencies=[Depends(require_permission("course.update"))])
def upload_course_media_bulk(course_id: str, db: Annotated[Session, Depends(get_db)], files: list[UploadFile] = File(...)):
    if not files:
        return api_response(True, "Course media uploaded successfully", [], None)
    for file in files:
        size = get_upload_file_size(file)
        validate_file_extension(file.filename or "file", "avatar")
        validate_file_size(size, "avatar")
    items = CourseMediaService(db).upload_and_attach_media_many(course_id, files=files, media_type="gallery")
    return api_response(True, "Course media uploaded successfully", items, None)


@router.patch("/course-media/{course_media_id}", dependencies=[Depends(require_permission("course.update"))])
def update_course_media(course_media_id: str, payload: CourseMediaUpdate, db: Annotated[Session, Depends(get_db)]):
    item = CourseMediaService(db).update_media(course_media_id, payload)
    return api_response(True, "Course media updated successfully", item, None)


@router.delete("/course-media/{course_media_id}", dependencies=[Depends(require_permission("course.update"))])
def delete_course_media(course_media_id: str, db: Annotated[Session, Depends(get_db)]):
    CourseMediaService(db).delete_media(course_media_id)
    return api_response(True, "Course media deleted successfully", None, None)


@router.delete("/courses/{course_id}", dependencies=[Depends(require_permission("course.delete"))])
def delete_course(course_id: str, db: Annotated[Session, Depends(get_db)]):
    CourseService(db).soft_delete_course(course_id)
    return api_response(True, "Course deleted successfully", None, None)


@router.post("/courses/{course_id}/requirements", dependencies=[Depends(require_permission("course_requirement.create"))])
def create_requirement(course_id: str, payload: CourseRequirementCreate, db: Annotated[Session, Depends(get_db)]):
    service = CourseRequirementService(db)
    item = service.create_requirement(course_id, payload)
    return api_response(True, "Course requirement created successfully", service._requirement_dict(item), None)


@router.get("/courses/{course_id}/requirements")
def list_requirements(course_id: str, db: Annotated[Session, Depends(get_db)]):
    service = CourseRequirementService(db)
    items = service.get_requirements_by_course(course_id)
    return api_response(True, "Course requirements retrieved successfully", [service._requirement_dict(item) for item in items], None)


@router.patch("/course-requirements/{requirement_id}", dependencies=[Depends(require_permission("course_requirement.update"))])
def update_requirement(requirement_id: str, payload: CourseRequirementUpdate, db: Annotated[Session, Depends(get_db)]):
    service = CourseRequirementService(db)
    item = service.update_requirement(requirement_id, payload)
    return api_response(True, "Course requirement updated successfully", service._requirement_dict(item), None)


@router.delete("/course-requirements/{requirement_id}", dependencies=[Depends(require_permission("course_requirement.delete"))])
def delete_requirement(requirement_id: str, db: Annotated[Session, Depends(get_db)]):
    CourseRequirementService(db).soft_delete_requirement(requirement_id)
    return api_response(True, "Course requirement deleted successfully", None, None)


@router.post("/courses/{course_id}/outcomes", dependencies=[Depends(require_permission("course_outcome.create"))])
def create_outcome(course_id: str, payload: CourseOutcomeCreate, db: Annotated[Session, Depends(get_db)]):
    service = CourseOutcomeService(db)
    item = service.create_outcome(course_id, payload)
    return api_response(True, "Course outcome created successfully", service._outcome_dict(item), None)


@router.get("/courses/{course_id}/outcomes")
def list_outcomes(course_id: str, db: Annotated[Session, Depends(get_db)]):
    service = CourseOutcomeService(db)
    items = service.get_outcomes_by_course(course_id)
    return api_response(True, "Course outcomes retrieved successfully", [service._outcome_dict(item) for item in items], None)


@router.patch("/course-outcomes/{outcome_id}", dependencies=[Depends(require_permission("course_outcome.update"))])
def update_outcome(outcome_id: str, payload: CourseOutcomeUpdate, db: Annotated[Session, Depends(get_db)]):
    service = CourseOutcomeService(db)
    item = service.update_outcome(outcome_id, payload)
    return api_response(True, "Course outcome updated successfully", service._outcome_dict(item), None)


@router.delete("/course-outcomes/{outcome_id}", dependencies=[Depends(require_permission("course_outcome.delete"))])
def delete_outcome(outcome_id: str, db: Annotated[Session, Depends(get_db)]):
    CourseOutcomeService(db).soft_delete_outcome(outcome_id)
    return api_response(True, "Course outcome deleted successfully", None, None)
