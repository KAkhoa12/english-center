from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.models import StaffProfile, User
from app.repositories.base import BaseRepository
from app.schemas.common import PaginationParams


class StaffRepository(BaseRepository[StaffProfile]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, StaffProfile)

    def get_by_user_id(self, user_id: str) -> StaffProfile | None:
        return self.db.execute(
            select(StaffProfile).where(StaffProfile.user_id == user_id, StaffProfile.deleted_at.is_(None))
        ).scalar_one_or_none()

    def get_active_by_id(self, staff_id: str) -> StaffProfile | None:
        return self.get(staff_id)

    def list_with_user(self, query: PaginationParams) -> tuple[list[tuple[StaffProfile, User]], int]:
        stmt = select(StaffProfile, User).join(User, User.id == StaffProfile.user_id).where(
            StaffProfile.deleted_at.is_(None),
            User.deleted_at.is_(None),
        )
        if query.search:
            term = f"%{query.search}%"
            stmt = stmt.where(
                or_(
                    User.full_name.ilike(term),
                    User.email.ilike(term),
                    User.phone.ilike(term),
                    StaffProfile.position.ilike(term),
                    StaffProfile.department.ilike(term),
                )
            )
        total = int(self.db.execute(select(func.count()).select_from(stmt.subquery())).scalar_one())
        stmt = stmt.order_by(StaffProfile.created_at.asc() if query.sort_order == "asc" else StaffProfile.created_at.desc())
        stmt = stmt.offset((query.page - 1) * query.page_size).limit(query.page_size)
        rows = self.db.execute(stmt).all()
        return [(row[0], row[1]) for row in rows], total

    def list_all_with_user(self) -> list[tuple[StaffProfile, User]]:
        rows = self.db.execute(
            select(StaffProfile, User)
            .join(User, User.id == StaffProfile.user_id)
            .where(StaffProfile.deleted_at.is_(None), User.deleted_at.is_(None))
            .order_by(StaffProfile.created_at.asc())
        ).all()
        return [(row[0], row[1]) for row in rows]

    def get_with_user_by_id(self, staff_id: str) -> tuple[StaffProfile, User] | None:
        row = self.db.execute(
            select(StaffProfile, User)
            .join(User, User.id == StaffProfile.user_id)
            .where(
                StaffProfile.id == staff_id,
                StaffProfile.deleted_at.is_(None),
                User.deleted_at.is_(None),
            )
        ).first()
        return None if row is None else (row[0], row[1])
