from typing import Annotated

from fastapi import APIRouter, Depends, Query, UploadFile, File
from sqlalchemy.orm import Session

from app.core.response import api_response, build_pagination
from app.db.session import get_db
from app.dependencies.permissions import require_permission
from app.schemas.common import PaginationParams
from app.schemas.user import AssignRolesRequest, UserCreate, UserUpdate
from app.services.media_service import MediaService
from app.services.user_service import UserService
from app.utils.file import get_upload_file_size, validate_file_extension, validate_file_size

router = APIRouter(prefix="/users", tags=["users"])


def _user_dict(user):
    return {
        "id": str(user.id),
        "full_name": user.full_name,
        "email": user.email,
        "phone": user.phone,
        "avatar_url": user.avatar_url,
        "status": user.status.value,
        "is_verified": user.is_verified,
        "guardian_id": str(user.guardian_id) if user.guardian_id else None,
    }


@router.post("", dependencies=[Depends(require_permission("user.create"))])
def create_user(payload: UserCreate, db: Annotated[Session, Depends(get_db)]):
    user = UserService(db).create_user(payload)
    return api_response(True, "User created successfully", _user_dict(user), None)


@router.get("", dependencies=[Depends(require_permission("user.read"))])
def list_users(
    db: Annotated[Session, Depends(get_db)],
    page: int = Query(1),
    page_size: int = Query(10),
    search: str | None = None,
    sort_by: str | None = None,
    sort_order: str = Query("desc", pattern="^(asc|desc)$"),
):
    q = PaginationParams(page=page, page_size=page_size, search=search, sort_by=sort_by, sort_order=sort_order)
    items, total = UserService(db).get_users(q)
    return api_response(True, "Users retrieved successfully", [_user_dict(x) for x in items], build_pagination(page, page_size, total))


@router.get("/{user_id}", dependencies=[Depends(require_permission("user.read"))])
def get_user(user_id: str, db: Annotated[Session, Depends(get_db)]):
    return api_response(True, "User retrieved successfully", _user_dict(UserService(db).get_user_by_id(user_id)), None)


@router.patch("/{user_id}", dependencies=[Depends(require_permission("user.update"))])
def update_user(user_id: str, payload: UserUpdate, db: Annotated[Session, Depends(get_db)]):
    return api_response(True, "User updated successfully", _user_dict(UserService(db).update_user(user_id, payload)), None)


@router.post("/{user_id}/avatar", dependencies=[Depends(require_permission("user.update"))])
def upload_user_avatar(user_id: str, db: Annotated[Session, Depends(get_db)], file: UploadFile = File(...)):
    file_size = get_upload_file_size(file)
    validate_file_extension(file.filename, "avatar")
    validate_file_size(file_size, "avatar")
    media = MediaService(db).upload_media(
        bucket_name="avatars",
        file=file,
        file_size=file_size,
        folder=f"users/{user_id}",
    )
    user = UserService(db).update_avatar_url(user_id, media.object_name)
    return api_response(True, "Avatar updated successfully", _user_dict(user), None)


@router.delete("/{user_id}/soft", dependencies=[Depends(require_permission("user.delete"))])
def soft_delete_user(user_id: str, db: Annotated[Session, Depends(get_db)]):
    UserService(db).soft_delete_user(user_id)
    return api_response(True, "User soft deleted successfully", None, None)


@router.post("/{user_id}/restore", dependencies=[Depends(require_permission("user.update"))])
def restore_user(user_id: str, db: Annotated[Session, Depends(get_db)]):
    user = UserService(db).restore_user(user_id)
    return api_response(True, "User restored successfully", _user_dict(user), None)


@router.delete("/{user_id}", dependencies=[Depends(require_permission("user.delete"))])
def delete_user(user_id: str, db: Annotated[Session, Depends(get_db)]):
    UserService(db).soft_delete_user(user_id)
    return api_response(True, "User deleted successfully", None, None)


@router.post("/{user_id}/roles", dependencies=[Depends(require_permission("user.update"))])
def assign_user_roles(user_id: str, payload: AssignRolesRequest, db: Annotated[Session, Depends(get_db)]):
    UserService(db).assign_roles(user_id, payload.role_ids)
    return api_response(True, "Roles assigned successfully", None, None)


@router.delete("/{user_id}/roles/{role_id}", dependencies=[Depends(require_permission("user.update"))])
def remove_user_role(user_id: str, role_id: str, db: Annotated[Session, Depends(get_db)]):
    UserService(db).remove_role(user_id, role_id)
    return api_response(True, "Role removed successfully", None, None)
