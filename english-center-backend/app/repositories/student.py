from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.models import User
from app.models.student import Student, StudentLevel
from app.repositories.base import BaseRepository
from app.schemas.common import PaginationParams


class StudentRepository(BaseRepository[Student]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, Student)

    def get_by_user_id(self, user_id: str) -> Student | None:
        return self.db.execute(
            select(Student).where(Student.user_id == user_id, Student.deleted_at.is_(None))
        ).scalar_one_or_none()

    def get_active_by_id(self, student_id: str) -> Student | None:
        return self.get(student_id)

    def list_with_user(self, query: PaginationParams, level: str | None = None) -> tuple[list[tuple[Student, User]], int]:
        stmt = select(Student, User).join(User, User.id == Student.user_id).where(
            Student.deleted_at.is_(None),
            User.deleted_at.is_(None),
        )
        if level:
            stmt = stmt.where(Student.level == StudentLevel(level))
        if query.search:
            term = f"%{query.search}%"
            stmt = stmt.where(
                or_(
                    User.full_name.ilike(term),
                    User.email.ilike(term),
                    User.phone.ilike(term),
                )
            )
        total = int(self.db.execute(select(func.count()).select_from(stmt.subquery())).scalar_one())
        stmt = stmt.order_by(Student.created_at.asc() if query.sort_order == "asc" else Student.created_at.desc())
        stmt = stmt.offset((query.page - 1) * query.page_size).limit(query.page_size)
        rows = self.db.execute(stmt).all()
        return [(row[0], row[1]) for row in rows], total

    def get_with_user_by_id(self, student_id: str) -> tuple[Student, User] | None:
        row = self.db.execute(
            select(Student, User)
            .join(User, User.id == Student.user_id)
            .where(
                Student.id == student_id,
                Student.deleted_at.is_(None),
                User.deleted_at.is_(None),
            )
        ).first()
        return None if row is None else (row[0], row[1])
