from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Role, RolePermission
from app.repositories.base import BaseRepository


class RolePermissionRepository(BaseRepository[RolePermission]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, RolePermission)

    def get_active_relation(self, role_id: str, permission_id: str) -> RolePermission | None:
        return self.db.execute(
            select(RolePermission).where(
                RolePermission.role_id == role_id,
                RolePermission.permission_id == permission_id,
                RolePermission.deleted_at.is_(None),
            )
        ).scalar_one_or_none()

    def has_active_by_permission_id(self, permission_id: str) -> bool:
        return self.db.execute(
            select(RolePermission.role_id)
            .join(Role, Role.id == RolePermission.role_id)
            .where(
                RolePermission.permission_id == permission_id,
                RolePermission.deleted_at.is_(None),
                Role.deleted_at.is_(None),
            )
        ).first() is not None

    def has_active_by_role_id(self, role_id: str) -> bool:
        return self.db.execute(
            select(RolePermission.permission_id).where(
                RolePermission.role_id == role_id,
                RolePermission.deleted_at.is_(None),
            )
        ).first() is not None

    def create_relation(self, role_id: str, permission_id: str) -> RolePermission:
        return self.create_or_restore_relation(role_id, permission_id)

    def create_or_restore_relation(self, role_id: str, permission_id: str) -> RolePermission:
        existing = self.db.execute(
            select(RolePermission).where(
                RolePermission.role_id == role_id,
                RolePermission.permission_id == permission_id,
            )
        ).scalar_one_or_none()

        if existing:
            if existing.deleted_at is None:
                return existing
            existing.deleted_at = None
            self.db.add(existing)
            self.db.flush()
            self.db.refresh(existing)
            return existing

        relation = RolePermission(role_id=role_id, permission_id=permission_id)
        self.db.add(relation)
        self.db.flush()
        self.db.refresh(relation)
        return relation

    def list_active_permission_ids_by_role_ids(self, role_ids: list[str]) -> list[str]:
        if not role_ids:
            return []
        return list(
            self.db.execute(
                select(RolePermission.permission_id).where(
                    RolePermission.role_id.in_(role_ids),
                    RolePermission.deleted_at.is_(None),
                )
            ).scalars().all()
        )
