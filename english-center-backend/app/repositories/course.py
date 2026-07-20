from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.models.course import Course, CourseStatus, CourseTargetLevel
from app.repositories.base import BaseRepository


class CourseRepository(BaseRepository[Course]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, Course)

    def get_by_code(self, code: str) -> Course | None:
        return self.db.execute(
            select(Course).where(Course.code == code, Course.deleted_at.is_(None))
        ).scalar_one_or_none()

    def get_by_slug(self, slug: str) -> Course | None:
        return self.db.execute(
            select(Course).where(Course.slug == slug, Course.deleted_at.is_(None))
        ).scalar_one_or_none()

    def get_active_by_id(self, course_id: str) -> Course | None:
        return self.get(course_id)

    def list_filtered(
        self,
        search: str | None = None,
        status: CourseStatus | None = None,
        target_level: CourseTargetLevel | None = None,
        category_id: str | None = None,
        min_price: float | None = None,
        max_price: float | None = None,
    ) -> list[Course]:
        stmt = select(Course).where(Course.deleted_at.is_(None))
        if search:
            term = f"%{search}%"
            stmt = stmt.where(or_(Course.name.ilike(term), Course.code.ilike(term), Course.slug.ilike(term), Course.description.ilike(term)))
        if status:
            stmt = stmt.where(Course.status == status)
        if target_level:
            stmt = stmt.where(Course.target_level == target_level)
        if min_price is not None:
            stmt = stmt.where(Course.price >= min_price)
        if max_price is not None:
            stmt = stmt.where(Course.price <= max_price)
        if category_id:
            stmt = stmt.where(Course.category_id == category_id)
        return list(self.db.execute(stmt).scalars().all())
