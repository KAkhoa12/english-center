from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.course import CourseMedia
from app.repositories.base import BaseRepository


class CourseMediaRepository(BaseRepository[CourseMedia]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, CourseMedia)

    def get_active_by_id(self, course_media_id: str) -> CourseMedia | None:
        return self.db.execute(
            select(CourseMedia).where(CourseMedia.id == course_media_id, CourseMedia.deleted_at.is_(None))
        ).scalar_one_or_none()

    def get_active_by_course(self, course_id: str) -> list[CourseMedia]:
        return list(
            self.db.execute(
                select(CourseMedia)
                .where(CourseMedia.course_id == course_id, CourseMedia.deleted_at.is_(None))
                .order_by(CourseMedia.order_index.asc(), CourseMedia.created_at.asc())
            ).scalars().all()
        )
