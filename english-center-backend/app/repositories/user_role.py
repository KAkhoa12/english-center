from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import User, UserRole, UserStatus
from app.repositories.base import BaseRepository


class UserRoleRepository(BaseRepository[UserRole]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, UserRole)

    def get_active_relation(self, user_id: str, role_id: str) -> UserRole | None:
        return self.db.execute(
            select(UserRole).where(
                UserRole.user_id == user_id,
                UserRole.role_id == role_id,
                UserRole.deleted_at.is_(None),
            )
        ).scalar_one_or_none()

    def has_active_by_role_id(self, role_id: str) -> bool:
        return self.db.execute(
            select(UserRole.user_id)
            .join(User, User.id == UserRole.user_id)
            .where(
                UserRole.role_id == role_id,
                UserRole.deleted_at.is_(None),
                User.deleted_at.is_(None),
                User.status == UserStatus.active,
            )
        ).first() is not None

    def create_relation(self, user_id: str, role_id: str) -> UserRole:
        return self.create_or_restore_relation(user_id, role_id)

    def create_or_restore_relation(self, user_id: str, role_id: str) -> UserRole:
        existing = self.db.execute(
            select(UserRole).where(
                UserRole.user_id == user_id,
                UserRole.role_id == role_id,
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

        relation = UserRole(user_id=user_id, role_id=role_id)
        self.db.add(relation)
        self.db.flush()
        self.db.refresh(relation)
        return relation

    def list_active_role_ids_by_user_id(self, user_id: str) -> list[str]:
        return list(
            self.db.execute(
                select(UserRole.role_id).where(
                    UserRole.user_id == user_id,
                    UserRole.deleted_at.is_(None),
                )
            ).scalars().all()
        )
