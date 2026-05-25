from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.response import api_response, build_pagination
from app.db.session import get_db
from app.dependencies.permissions import require_permission
from app.schemas.common import PaginationParams
from app.schemas.course import CourseTagCreate, CourseTagUpdate
from app.services.course_service import CourseTagService

router = APIRouter(prefix="/course-tags", tags=["course-tags"])


def _tag_dict(tag) -> dict:
    return {"id": str(tag.id), "name": tag.name, "slug": tag.slug, "created_at": tag.created_at, "updated_at": tag.updated_at}


@router.post("", dependencies=[Depends(require_permission("course_tag.create"))])
def create_tag(payload: CourseTagCreate, db: Annotated[Session, Depends(get_db)]):
    tag = CourseTagService(db).create_tag(payload)
    return api_response(True, "Course tag created successfully", _tag_dict(tag), None)


@router.get("", dependencies=[Depends(require_permission("course_tag.read"))])
def list_tags(
    db: Annotated[Session, Depends(get_db)],
    page: int = Query(1),
    page_size: int = Query(10),
    search: str | None = None,
    sort_by: str | None = None,
    sort_order: str = Query("desc", pattern="^(asc|desc)$"),
):
    query = PaginationParams(page=page, page_size=page_size, search=search, sort_by=sort_by, sort_order=sort_order)
    items, total = CourseTagService(db).get_tags(query)
    return api_response(True, "Course tags retrieved successfully", [_tag_dict(item) for item in items], build_pagination(page, page_size, total))


@router.get("/{tag_id}", dependencies=[Depends(require_permission("course_tag.read"))])
def get_tag(tag_id: str, db: Annotated[Session, Depends(get_db)]):
    tag = CourseTagService(db).get_tag_by_id(tag_id)
    return api_response(True, "Course tag retrieved successfully", _tag_dict(tag), None)


@router.patch("/{tag_id}", dependencies=[Depends(require_permission("course_tag.update"))])
def update_tag(tag_id: str, payload: CourseTagUpdate, db: Annotated[Session, Depends(get_db)]):
    tag = CourseTagService(db).update_tag(tag_id, payload)
    return api_response(True, "Course tag updated successfully", _tag_dict(tag), None)


@router.delete("/{tag_id}", dependencies=[Depends(require_permission("course_tag.delete"))])
def delete_tag(tag_id: str, db: Annotated[Session, Depends(get_db)]):
    CourseTagService(db).soft_delete_tag(tag_id)
    return api_response(True, "Course tag deleted successfully", None, None)

