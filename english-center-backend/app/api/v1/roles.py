from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.response import api_response, build_pagination
from app.db.session import get_db
from app.dependencies.permissions import require_permission
from app.schemas.common import PaginationParams
from app.schemas.role import AssignPermissionsRequest, RoleCreate, RoleUpdate
from app.services.role_service import RoleService

router = APIRouter(prefix="/roles", tags=["roles"])


def _role_dict(x):
    return {"id": str(x.id), "name": x.name, "description": x.description}


def _permission_dict(x):
    return {"id": str(x.id), "code": x.code, "name": x.name, "description": x.description}


@router.get("", dependencies=[Depends(require_permission("role.read"))])
def list_roles(db: Annotated[Session, Depends(get_db)], page: int = Query(1), page_size: int = Query(10), search: str | None = None, sort_by: str | None = None, sort_order: str = Query("desc", pattern="^(asc|desc)$")):
    q = PaginationParams(page=page, page_size=page_size, search=search, sort_by=sort_by, sort_order=sort_order)
    items, total = RoleService(db).get_roles(q)
    return api_response(True, "Roles retrieved successfully", [_role_dict(x) for x in items], build_pagination(page, page_size, total))


@router.post("", dependencies=[Depends(require_permission("role.create"))])
def create_role(payload: RoleCreate, db: Annotated[Session, Depends(get_db)]):
    return api_response(True, "Role created successfully", _role_dict(RoleService(db).create_role(payload)), None)


@router.get("/{role_id}", dependencies=[Depends(require_permission("role.read"))])
def get_role(role_id: str, db: Annotated[Session, Depends(get_db)]):
    service = RoleService(db)
    role = service.get_role(role_id)
    permissions = service.get_role_permissions(role_id)
    payload = _role_dict(role)
    payload["permission_ids"] = [str(item.id) for item in permissions]
    payload["permissions"] = [_permission_dict(item) for item in permissions]
    return api_response(True, "Role retrieved successfully", payload, None)


@router.patch("/{role_id}", dependencies=[Depends(require_permission("role.update"))])
def update_role(role_id: str, payload: RoleUpdate, db: Annotated[Session, Depends(get_db)]):
    return api_response(True, "Role updated successfully", _role_dict(RoleService(db).update_role(role_id, payload)), None)


@router.delete("/{role_id}", dependencies=[Depends(require_permission("role.delete"))])
def delete_role(role_id: str, db: Annotated[Session, Depends(get_db)]):
    RoleService(db).soft_delete_role(role_id)
    return api_response(True, "Role deleted successfully", None, None)


@router.post("/{role_id}/permissions", dependencies=[Depends(require_permission("role.update"))])
def assign_permissions(role_id: str, payload: AssignPermissionsRequest, db: Annotated[Session, Depends(get_db)]):
    RoleService(db).assign_permissions(role_id, payload.permission_ids)
    return api_response(True, "Permissions assigned successfully", None, None)


@router.delete("/{role_id}/permissions/{permission_id}", dependencies=[Depends(require_permission("role.update"))])
def remove_permission(role_id: str, permission_id: str, db: Annotated[Session, Depends(get_db)]):
    RoleService(db).remove_permission(role_id, permission_id)
    return api_response(True, "Permission removed successfully", None, None)
