from collections.abc import Callable
from typing import Annotated

from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.rbac import has_permission
from app.db.session import get_db
from app.dependencies.auth import get_current_active_user
from app.models.rbac.user import User
from app.services.rbac_service import RBACService


def require_permission(permission_code: str) -> Callable:
    def dependency(
        db: Annotated[Session, Depends(get_db)],
        current_user: Annotated[User, Depends(get_current_active_user)],
    ) -> User:
        perms = RBACService(db).get_user_permissions(str(current_user.id))
        if not has_permission(perms, permission_code):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Permission denied")
        return current_user

    return dependency


def require_auth_and_permission(permission_code: str) -> Callable:
    return require_permission(permission_code)
