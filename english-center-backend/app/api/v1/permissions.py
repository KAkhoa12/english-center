from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.response import api_response, build_pagination
from app.db.session import get_db
from app.dependencies.permissions import require_permission
from app.schemas.common import PaginationParams
from app.schemas.permission import PermissionCreate, PermissionUpdate
from app.services.permission_service import PermissionService

router = APIRouter(prefix="/permissions", tags=["permissions"])


def _perm_dict(x):
    return {"id": str(x.id), "code": x.code, "name": x.name, "description": x.description}


@router.get("", dependencies=[Depends(require_permission("permission.read"))])
def list_permissions(db: Annotated[Session, Depends(get_db)], page: int = Query(1), page_size: int = Query(10), search: str | None = None, sort_by: str | None = None, sort_order: str = Query("desc", pattern="^(asc|desc)$")):
    q = PaginationParams(page=page, page_size=page_size, search=search, sort_by=sort_by, sort_order=sort_order)
    items, total = PermissionService(db).get_permissions(q)
    return api_response(True, "Permissions retrieved successfully", [_perm_dict(x) for x in items], build_pagination(page, page_size, total))


@router.post("", dependencies=[Depends(require_permission("permission.create"))])
def create_permission(payload: PermissionCreate, db: Annotated[Session, Depends(get_db)]):
    return api_response(True, "Permission created successfully", _perm_dict(PermissionService(db).create_permission(payload)), None)


@router.get("/{permission_id}", dependencies=[Depends(require_permission("permission.read"))])
def get_permission(permission_id: str, db: Annotated[Session, Depends(get_db)]):
    return api_response(True, "Permission retrieved successfully", _perm_dict(PermissionService(db).get_permission(permission_id)), None)


@router.patch("/{permission_id}", dependencies=[Depends(require_permission("permission.update"))])
def update_permission(permission_id: str, payload: PermissionUpdate, db: Annotated[Session, Depends(get_db)]):
    return api_response(True, "Permission updated successfully", _perm_dict(PermissionService(db).update_permission(permission_id, payload)), None)


@router.delete("/{permission_id}", dependencies=[Depends(require_permission("permission.delete"))])
def delete_permission(permission_id: str, db: Annotated[Session, Depends(get_db)]):
    PermissionService(db).soft_delete_permission(permission_id)
    return api_response(True, "Permission deleted successfully", None, None)

