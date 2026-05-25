from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.rbac import has_permission
from app.models.permission import Permission, RolePermission
from app.models.role import Role, UserRole


class RBACService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_user_roles(self, user_id: str) -> list[str]:
        stmt = (
            select(Role.name)
            .join(UserRole, UserRole.role_id == Role.id)
            .where(UserRole.user_id == user_id, UserRole.deleted_at.is_(None), Role.deleted_at.is_(None))
        )
        return list(self.db.execute(stmt).scalars().all())

    def get_user_permissions(self, user_id: str) -> list[str]:
        stmt = (
            select(Permission.code)
            .join(RolePermission, RolePermission.permission_id == Permission.id)
            .join(Role, Role.id == RolePermission.role_id)
            .join(UserRole, UserRole.role_id == Role.id)
            .where(
                UserRole.user_id == user_id,
                UserRole.deleted_at.is_(None),
                Role.deleted_at.is_(None),
                RolePermission.deleted_at.is_(None),
                Permission.deleted_at.is_(None),
            )
        )
        return list(set(self.db.execute(stmt).scalars().all()))

    def has_permission(self, user_id: str, required_permission: str) -> bool:
        return has_permission(self.get_user_permissions(user_id), required_permission)
