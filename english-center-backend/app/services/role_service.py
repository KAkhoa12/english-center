from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models import Role
from app.models.rbac.permission import Permission
from app.repositories.permission import PermissionRepository
from app.repositories.role import RoleRepository
from app.repositories.role_permission import RolePermissionRepository
from app.repositories.user_role import UserRoleRepository
from app.schemas.common import PaginationParams
from app.schemas.role import RoleCreate, RoleUpdate


class RoleService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.role_repo = RoleRepository(db)
        self.permission_repo = PermissionRepository(db)
        self.role_permission_repo = RolePermissionRepository(db)
        self.user_role_repo = UserRoleRepository(db)

    def create_role(self, payload: RoleCreate) -> Role:
        try:
            if self.role_repo.name_exists(payload.name):
                raise HTTPException(status_code=400, detail="Role already exists")
            role = Role(name=payload.name, description=payload.description)
            created = self.role_repo.create(role)
            self.db.commit()
            return created
        except Exception:
            self.db.rollback()
            raise

    def get_roles(self, query: PaginationParams) -> tuple[list[Role], int]:
        return self.role_repo.list_filtered(query)

    def get_role(self, role_id: str) -> Role:
        role = self.role_repo.get_active_by_id(role_id)
        if not role:
            raise HTTPException(status_code=404, detail="Role not found")
        return role

    def get_role_permissions(self, role_id: str) -> list[Permission]:
        self.get_role(role_id)
        return self.role_permission_repo.list_active_permissions_by_role_id(role_id)

    def update_role(self, role_id: str, payload: RoleUpdate) -> Role:
        try:
            role = self.get_role(role_id)
            if payload.name is not None and payload.name != role.name:
                if self.role_repo.name_exists(payload.name, exclude_role_id=str(role.id)):
                    raise HTTPException(status_code=400, detail="Role already exists")
                role.name = payload.name
            if payload.description is not None:
                role.description = payload.description
            updated = self.role_repo.update(role)
            self.db.commit()
            return updated
        except Exception:
            self.db.rollback()
            raise

    def soft_delete_role(self, role_id: str) -> None:
        try:
            role = self.get_role(role_id)
            if self.user_role_repo.has_active_by_role_id(role_id):
                raise HTTPException(status_code=400, detail="Role is in use")
            self.role_repo.soft_delete(role)
            self.db.commit()
        except Exception:
            self.db.rollback()
            raise

    def assign_permissions(self, role_id: str, permission_ids: list[str]) -> None:
        try:
            self.get_role(role_id)
            unique_permission_ids = list(set(permission_ids))
            perms = self.permission_repo.get_active_by_ids(unique_permission_ids)
            if len(perms) != len(unique_permission_ids):
                raise HTTPException(status_code=404, detail="One or more permissions not found")
            for permission_id in unique_permission_ids:
                self.role_permission_repo.create_or_restore_relation(role_id, permission_id)
            self.db.commit()
        except Exception:
            self.db.rollback()
            raise

    def remove_permission(self, role_id: str, permission_id: str) -> None:
        try:
            rp = self.role_permission_repo.get_active_relation(role_id, permission_id)
            if not rp:
                raise HTTPException(status_code=404, detail="Role permission not found")
            self.role_permission_repo.soft_delete(rp)
            self.db.commit()
        except Exception:
            self.db.rollback()
            raise
