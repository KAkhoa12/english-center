from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.course import CourseTag
from app.repositories.base import BaseRepository


class CourseTagRepository(BaseRepository[CourseTag]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, CourseTag)

    def get_by_name(self, name: str) -> CourseTag | None:
        return self.db.execute(
            select(CourseTag).where(CourseTag.name == name, CourseTag.deleted_at.is_(None))
        ).scalar_one_or_none()

    def get_by_slug(self, slug: str) -> CourseTag | None:
        return self.db.execute(
            select(CourseTag).where(CourseTag.slug == slug, CourseTag.deleted_at.is_(None))
        ).scalar_one_or_none()

    def get_active_by_ids(self, tag_ids: list[str]) -> list[CourseTag]:
        return list(
            self.db.execute(
                select(CourseTag).where(CourseTag.id.in_(tag_ids), CourseTag.deleted_at.is_(None))
            ).scalars().all()
        )
