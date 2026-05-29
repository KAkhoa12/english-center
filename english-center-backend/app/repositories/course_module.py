from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.course import CourseModule
from app.repositories.base import BaseRepository


class CourseModuleRepository(BaseRepository[CourseModule]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, CourseModule)

    def list_by_course_id(self, course_id: str) -> list[CourseModule]:
        return list(
            self.db.execute(
                select(CourseModule)
                .where(CourseModule.course_id == course_id, CourseModule.deleted_at.is_(None))
                .order_by(CourseModule.order_index.asc())
            ).scalars().all()
        )
