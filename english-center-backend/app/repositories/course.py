from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.course import Course
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
