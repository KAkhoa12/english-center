from collections.abc import Callable
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.rbac import has_permission
from app.core.security import decode_access_token
from app.db.session import get_db
from app.models.rbac.user import User, UserStatus
from app.services.rbac_service import RBACService

bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    db: Annotated[Session, Depends(get_db)],
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
) -> User:
    if not credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
    try:
        payload = decode_access_token(credentials.credentials)
        user_id = payload.get("user_id")
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token") from exc

    user = db.execute(select(User).where(User.id == user_id, User.deleted_at.is_(None))).scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
    return user


def optional_current_user(
    db: Annotated[Session, Depends(get_db)],
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
) -> User | None:
    if not credentials:
        return None
    try:
        payload = decode_access_token(credentials.credentials)
    except Exception:
        return None
    return db.execute(select(User).where(User.id == payload.get("user_id"), User.deleted_at.is_(None))).scalar_one_or_none()


def get_current_active_user(current_user: Annotated[User, Depends(get_current_user)]) -> User:
    if current_user.status != UserStatus.active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Permission denied")
    return current_user


def require_jwt(current_user: Annotated[User, Depends(get_current_user)]) -> User:
    return current_user


def require_authorize(
    permissions: list[str] | None = None,
    roles: list[str] | None = None,
    is_require_access_token: bool = False,
    require_all_permissions: bool = True,
    require_all_roles: bool = True,
) -> Callable:
    if permissions:
        is_require_access_token = True

    if is_require_access_token and not permissions and not roles:
        return require_jwt

    def dependency(
        db: Annotated[Session, Depends(get_db)],
        current_user: Annotated[User, Depends(get_current_active_user)],
    ) -> User:
        rbac = RBACService(db)
        uid = str(current_user.id)

        if roles:
            user_roles = rbac.get_user_roles(uid)
            matched = [r for r in roles if r in user_roles]
            if require_all_roles and len(matched) != len(roles):
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Permission denied")
            if not require_all_roles and not matched:
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Permission denied")

        if permissions:
            user_perms = rbac.get_user_permissions(uid)
            if require_all_permissions:
                if not all(has_permission(user_perms, p) for p in permissions):
                    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Permission denied")
            elif not any(has_permission(user_perms, p) for p in permissions):
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Permission denied")

        return current_user

    return dependency
