from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.response import api_response, build_pagination
from app.db.session import get_db
from app.dependencies.permissions import require_permission
from app.schemas.assignment import AssignmentTypeCreate, AssignmentTypeUpdate
from app.schemas.common import PaginationParams
from app.services.assignment_type_service import AssignmentTypeService

router = APIRouter(prefix="/assignment-types", tags=["assignment-types"])


@router.get("", dependencies=[Depends(require_permission("assignment_type.read"))])
def list_assignment_types(
    db: Annotated[Session, Depends(get_db)],
    page: int = Query(1),
    page_size: int = Query(10),
    search: str | None = None,
    sort_by: str | None = None,
    sort_order: str = Query("desc", pattern="^(asc|desc)$"),
    status: str | None = None,
):
    query = PaginationParams(page=page, page_size=page_size, search=search, sort_by=sort_by, sort_order=sort_order)
    service = AssignmentTypeService(db)
    items, total = service.list_assignment_types(query, status)
    return api_response(
        True,
        "Assignment types retrieved successfully",
        [service.assignment_type_dict(item) for item in items],
        build_pagination(page, page_size, total),
    )


@router.post("", dependencies=[Depends(require_permission("assignment_type.create"))])
def create_assignment_type(payload: AssignmentTypeCreate, db: Annotated[Session, Depends(get_db)]):
    service = AssignmentTypeService(db)
    item = service.create_assignment_type(payload)
    return api_response(True, "Assignment type created successfully", service.assignment_type_dict(item), None)


@router.get("/{assignment_type_id}", dependencies=[Depends(require_permission("assignment_type.read"))])
def get_assignment_type(assignment_type_id: str, db: Annotated[Session, Depends(get_db)]):
    service = AssignmentTypeService(db)
    item = service.get_assignment_type(assignment_type_id)
    return api_response(True, "Assignment type retrieved successfully", service.assignment_type_dict(item), None)


@router.patch("/{assignment_type_id}", dependencies=[Depends(require_permission("assignment_type.update"))])
def update_assignment_type(
    assignment_type_id: str,
    payload: AssignmentTypeUpdate,
    db: Annotated[Session, Depends(get_db)],
):
    service = AssignmentTypeService(db)
    item = service.update_assignment_type(assignment_type_id, payload)
    return api_response(True, "Assignment type updated successfully", service.assignment_type_dict(item), None)


@router.delete("/{assignment_type_id}", dependencies=[Depends(require_permission("assignment_type.delete"))])
def delete_assignment_type(assignment_type_id: str, db: Annotated[Session, Depends(get_db)]):
    AssignmentTypeService(db).soft_delete_assignment_type(assignment_type_id)
    return api_response(True, "Assignment type deleted successfully", None, None)
