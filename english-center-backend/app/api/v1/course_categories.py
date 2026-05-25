from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.response import api_response, build_pagination
from app.db.session import get_db
from app.dependencies.permissions import require_permission
from app.schemas.common import PaginationParams
from app.schemas.course import CourseCategoryCreate, CourseCategoryUpdate
from app.services.course_service import CourseCategoryService

router = APIRouter(prefix="/course-categories", tags=["course-categories"])


def _category_dict(category) -> dict:
    return {
        "id": str(category.id),
        "name": category.name,
        "slug": category.slug,
        "description": category.description,
        "status": category.status.value,
        "created_at": category.created_at,
        "updated_at": category.updated_at,
    }


@router.post("", dependencies=[Depends(require_permission("course_category.create"))])
def create_category(payload: CourseCategoryCreate, db: Annotated[Session, Depends(get_db)]):
    category = CourseCategoryService(db).create_category(payload)
    return api_response(True, "Course category created successfully", _category_dict(category), None)


@router.get("", dependencies=[Depends(require_permission("course_category.read"))])
def list_categories(
    db: Annotated[Session, Depends(get_db)],
    page: int = Query(1),
    page_size: int = Query(10),
    search: str | None = None,
    sort_by: str | None = None,
    sort_order: str = Query("desc", pattern="^(asc|desc)$"),
    status: str | None = None,
):
    query = PaginationParams(page=page, page_size=page_size, search=search, sort_by=sort_by, sort_order=sort_order)
    items, total = CourseCategoryService(db).get_categories(query, status)
    return api_response(True, "Course categories retrieved successfully", [_category_dict(item) for item in items], build_pagination(page, page_size, total))


@router.get("/{category_id}", dependencies=[Depends(require_permission("course_category.read"))])
def get_category(category_id: str, db: Annotated[Session, Depends(get_db)]):
    category = CourseCategoryService(db).get_category_by_id(category_id)
    return api_response(True, "Course category retrieved successfully", _category_dict(category), None)


@router.patch("/{category_id}", dependencies=[Depends(require_permission("course_category.update"))])
def update_category(category_id: str, payload: CourseCategoryUpdate, db: Annotated[Session, Depends(get_db)]):
    category = CourseCategoryService(db).update_category(category_id, payload)
    return api_response(True, "Course category updated successfully", _category_dict(category), None)


@router.delete("/{category_id}", dependencies=[Depends(require_permission("course_category.delete"))])
def delete_category(category_id: str, db: Annotated[Session, Depends(get_db)]):
    CourseCategoryService(db).soft_delete_category(category_id)
    return api_response(True, "Course category deleted successfully", None, None)

