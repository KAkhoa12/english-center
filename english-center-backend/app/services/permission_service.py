from datetime import datetime, timezone

from fastapi import HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.permission import Permission, RolePermission
from app.schemas.common import PaginationParams
from app.schemas.permission import PermissionCreate, PermissionUpdate


class PermissionService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create_permission(self, payload: PermissionCreate) -> Permission:
        exists = self.db.execute(select(Permission).where(Permission.code == payload.code, Permission.deleted_at.is_(None))).scalar_one_or_none()
        if exists:
            raise HTTPException(status_code=400, detail="Permission already exists")
        obj = Permission(code=payload.code, name=payload.name, description=payload.description)
        self.db.add(obj)
        self.db.commit()
        self.db.refresh(obj)
        return obj

    def get_permissions(self, query: PaginationParams) -> tuple[list[Permission], int]:
        stmt = select(Permission).where(Permission.deleted_at.is_(None))
        if query.search:
            q = f"%{query.search}%"
            stmt = stmt.where((Permission.code.ilike(q)) | (Permission.name.ilike(q)))
        total = self.db.execute(select(func.count()).select_from(stmt.subquery())).scalar_one()
        sort_field = getattr(Permission, query.sort_by, Permission.created_at) if query.sort_by else Permission.created_at
        stmt = stmt.order_by(sort_field.asc() if query.sort_order == "asc" else sort_field.desc())
        stmt = stmt.offset((query.page - 1) * query.page_size).limit(query.page_size)
        return list(self.db.execute(stmt).scalars().all()), int(total)

    def get_permission(self, permission_id: str) -> Permission:
        obj = self.db.execute(select(Permission).where(Permission.id == permission_id, Permission.deleted_at.is_(None))).scalar_one_or_none()
        if not obj:
            raise HTTPException(status_code=404, detail="Permission not found")
        return obj

    def update_permission(self, permission_id: str, payload: PermissionUpdate) -> Permission:
        obj = self.get_permission(permission_id)
        for field in ["code", "name", "description"]:
            val = getattr(payload, field)
            if val is not None:
                setattr(obj, field, val)
        self.db.commit()
        self.db.refresh(obj)
        return obj

    def soft_delete_permission(self, permission_id: str) -> None:
        obj = self.get_permission(permission_id)
        using = self.db.execute(select(RolePermission).where(RolePermission.permission_id == permission_id, RolePermission.deleted_at.is_(None))).first()
        if using:
            raise HTTPException(status_code=400, detail="Permission is in use")
        obj.deleted_at = datetime.now(timezone.utc)
        self.db.commit()
