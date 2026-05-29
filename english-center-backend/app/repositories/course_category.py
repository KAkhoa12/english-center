from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.course import CourseCategory
from app.repositories.base import BaseRepository


class CourseCategoryRepository(BaseRepository[CourseCategory]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, CourseCategory)

    def get_by_name(self, name: str) -> CourseCategory | None:
        return self.db.execute(
            select(CourseCategory).where(CourseCategory.name == name, CourseCategory.deleted_at.is_(None))
        ).scalar_one_or_none()

    def get_by_slug(self, slug: str) -> CourseCategory | None:
        return self.db.execute(
            select(CourseCategory).where(CourseCategory.slug == slug, CourseCategory.deleted_at.is_(None))
        ).scalar_one_or_none()

    def get_active_by_ids(self, category_ids: list[str]) -> list[CourseCategory]:
        return list(
            self.db.execute(
                select(CourseCategory).where(CourseCategory.id.in_(category_ids), CourseCategory.deleted_at.is_(None))
            ).scalars().all()
        )
