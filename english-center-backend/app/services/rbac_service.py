from sqlalchemy.orm import Session

from app.core.rbac import has_permission
from app.repositories.permission import PermissionRepository
from app.repositories.role import RoleRepository
from app.repositories.role_permission import RolePermissionRepository
from app.repositories.user_role import UserRoleRepository


class RBACService:
    def __init__(self, db: Session) -> None:
        self.user_role_repo = UserRoleRepository(db)
        self.role_repo = RoleRepository(db)
        self.role_permission_repo = RolePermissionRepository(db)
        self.permission_repo = PermissionRepository(db)

    def get_user_roles(self, user_id: str) -> list[str]:
        role_ids = self.user_role_repo.list_active_role_ids_by_user_id(user_id)
        return self.role_repo.list_active_role_names_by_ids(role_ids)

    def get_user_permissions(self, user_id: str) -> list[str]:
        role_ids = self.user_role_repo.list_active_role_ids_by_user_id(user_id)
        permission_ids = self.role_permission_repo.list_active_permission_ids_by_role_ids(role_ids)
        return list(set(self.permission_repo.list_active_codes_by_ids(permission_ids)))

    def has_permission(self, user_id: str, required_permission: str) -> bool:
        return has_permission(self.get_user_permissions(user_id), required_permission)
