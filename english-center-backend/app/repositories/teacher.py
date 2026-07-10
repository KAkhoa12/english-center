from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.models import Teacher, User
from app.repositories.base import BaseRepository
from app.schemas.common import PaginationParams


class TeacherRepository(BaseRepository[Teacher]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, Teacher)

    def get_by_user_id(self, user_id: str) -> Teacher | None:
        return self.db.execute(
            select(Teacher).where(Teacher.user_id == user_id, Teacher.deleted_at.is_(None))
        ).scalar_one_or_none()

    def get_active_by_id(self, teacher_id: str) -> Teacher | None:
        return self.get(teacher_id)

    def list_with_user(self, query: PaginationParams) -> tuple[list[tuple[Teacher, User]], int]:
        stmt = select(Teacher, User).join(User, User.id == Teacher.user_id).where(
            Teacher.deleted_at.is_(None),
            User.deleted_at.is_(None),
        )
        if query.search:
            term = f"%{query.search}%"
            stmt = stmt.where(
                or_(
                    User.full_name.ilike(term),
                    User.email.ilike(term),
                    User.phone.ilike(term),
                    Teacher.specialization.ilike(term),
                )
            )
        total = int(self.db.execute(select(func.count()).select_from(stmt.subquery())).scalar_one())
        stmt = stmt.order_by(Teacher.created_at.asc() if query.sort_order == "asc" else Teacher.created_at.desc())
        stmt = stmt.offset((query.page - 1) * query.page_size).limit(query.page_size)
        rows = self.db.execute(stmt).all()
        return [(row[0], row[1]) for row in rows], total

    def list_all_with_user(self) -> list[tuple[Teacher, User]]:
        rows = self.db.execute(
            select(Teacher, User)
            .join(User, User.id == Teacher.user_id)
            .where(Teacher.deleted_at.is_(None), User.deleted_at.is_(None))
            .order_by(Teacher.created_at.asc())
        ).all()
        return [(row[0], row[1]) for row in rows]

    def get_with_user_by_id(self, teacher_id: str) -> tuple[Teacher, User] | None:
        row = self.db.execute(
            select(Teacher, User)
            .join(User, User.id == Teacher.user_id)
            .where(
                Teacher.id == teacher_id,
                Teacher.deleted_at.is_(None),
                User.deleted_at.is_(None),
            )
        ).first()
        return None if row is None else (row[0], row[1])
