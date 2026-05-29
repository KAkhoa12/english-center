from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models import Permission
from app.repositories.permission import PermissionRepository
from app.repositories.role_permission import RolePermissionRepository
from app.schemas.common import PaginationParams
from app.schemas.permission import PermissionCreate, PermissionUpdate


class PermissionService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.permission_repo = PermissionRepository(db)
        self.role_permission_repo = RolePermissionRepository(db)

    def create_permission(self, payload: PermissionCreate) -> Permission:
        try:
            if self.permission_repo.code_exists(payload.code):
                raise HTTPException(status_code=400, detail="Permission already exists")
            obj = Permission(code=payload.code, name=payload.name, description=payload.description)
            created = self.permission_repo.create(obj)
            self.db.commit()
            return created
        except Exception:
            self.db.rollback()
            raise

    def get_permissions(self, query: PaginationParams) -> tuple[list[Permission], int]:
        return self.permission_repo.list_filtered(query)

    def get_permission(self, permission_id: str) -> Permission:
        obj = self.permission_repo.get_active_by_id(permission_id)
        if not obj:
            raise HTTPException(status_code=404, detail="Permission not found")
        return obj

    def update_permission(self, permission_id: str, payload: PermissionUpdate) -> Permission:
        try:
            obj = self.get_permission(permission_id)
            if payload.code is not None and payload.code != obj.code:
                if self.permission_repo.code_exists(payload.code, exclude_permission_id=str(obj.id)):
                    raise HTTPException(status_code=400, detail="Permission already exists")
                obj.code = payload.code
            for field in ["name", "description"]:
                val = getattr(payload, field)
                if val is not None:
                    setattr(obj, field, val)
            updated = self.permission_repo.update(obj)
            self.db.commit()
            return updated
        except Exception:
            self.db.rollback()
            raise

    def soft_delete_permission(self, permission_id: str) -> None:
        try:
            obj = self.get_permission(permission_id)
            if self.role_permission_repo.has_active_by_permission_id(permission_id):
                raise HTTPException(status_code=400, detail="Permission is in use")
            self.permission_repo.soft_delete(obj)
            self.db.commit()
        except Exception:
            self.db.rollback()
            raise
