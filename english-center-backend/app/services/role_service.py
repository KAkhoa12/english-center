from datetime import datetime, timezone

from fastapi import HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.permission import Permission, RolePermission
from app.models.role import Role, UserRole
from app.schemas.common import PaginationParams
from app.schemas.role import RoleCreate, RoleUpdate


class RoleService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create_role(self, payload: RoleCreate) -> Role:
        exists = self.db.execute(select(Role).where(Role.name == payload.name, Role.deleted_at.is_(None))).scalar_one_or_none()
        if exists:
            raise HTTPException(status_code=400, detail="Role already exists")
        role = Role(name=payload.name, description=payload.description)
        self.db.add(role)
        self.db.commit()
        self.db.refresh(role)
        return role

    def get_roles(self, query: PaginationParams) -> tuple[list[Role], int]:
        stmt = select(Role).where(Role.deleted_at.is_(None))
        if query.search:
            stmt = stmt.where(Role.name.ilike(f"%{query.search}%"))
        total = self.db.execute(select(func.count()).select_from(stmt.subquery())).scalar_one()
        sort_field = getattr(Role, query.sort_by, Role.created_at) if query.sort_by else Role.created_at
        stmt = stmt.order_by(sort_field.asc() if query.sort_order == "asc" else sort_field.desc())
        stmt = stmt.offset((query.page - 1) * query.page_size).limit(query.page_size)
        return list(self.db.execute(stmt).scalars().all()), int(total)

    def get_role(self, role_id: str) -> Role:
        role = self.db.execute(select(Role).where(Role.id == role_id, Role.deleted_at.is_(None))).scalar_one_or_none()
        if not role:
            raise HTTPException(status_code=404, detail="Role not found")
        return role

    def update_role(self, role_id: str, payload: RoleUpdate) -> Role:
        role = self.get_role(role_id)
        if payload.name is not None:
            role.name = payload.name
        if payload.description is not None:
            role.description = payload.description
        self.db.commit()
        self.db.refresh(role)
        return role

    def soft_delete_role(self, role_id: str) -> None:
        role = self.get_role(role_id)
        using = self.db.execute(select(UserRole).where(UserRole.role_id == role_id, UserRole.deleted_at.is_(None))).first()
        if using:
            raise HTTPException(status_code=400, detail="Role is in use")
        role.deleted_at = datetime.now(timezone.utc)
        self.db.commit()

    def assign_permissions(self, role_id: str, permission_ids: list[str]) -> None:
        self.get_role(role_id)
        perms = self.db.execute(select(Permission).where(Permission.id.in_(permission_ids), Permission.deleted_at.is_(None))).scalars().all()
        if len(perms) != len(set(permission_ids)):
            raise HTTPException(status_code=404, detail="One or more permissions not found")
        for pid in set(permission_ids):
            existing = self.db.execute(
                select(RolePermission).where(
                    RolePermission.role_id == role_id,
                    RolePermission.permission_id == pid,
                    RolePermission.deleted_at.is_(None),
                )
            ).scalar_one_or_none()
            if not existing:
                self.db.add(RolePermission(role_id=role_id, permission_id=pid))
        self.db.commit()

    def remove_permission(self, role_id: str, permission_id: str) -> None:
        rp = self.db.execute(
            select(RolePermission).where(
                RolePermission.role_id == role_id,
                RolePermission.permission_id == permission_id,
                RolePermission.deleted_at.is_(None),
            )
        ).scalar_one_or_none()
        if not rp:
            raise HTTPException(status_code=404, detail="Role permission not found")
        rp.deleted_at = datetime.now(timezone.utc)
        self.db.commit()
