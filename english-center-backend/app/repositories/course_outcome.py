from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.course import CourseOutcome
from app.repositories.base import BaseRepository


class CourseOutcomeRepository(BaseRepository[CourseOutcome]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, CourseOutcome)

    def list_by_course_id(self, course_id: str) -> list[CourseOutcome]:
        return list(
            self.db.execute(
                select(CourseOutcome)
                .where(CourseOutcome.course_id == course_id, CourseOutcome.deleted_at.is_(None))
                .order_by(CourseOutcome.order_index.asc())
            ).scalars().all()
        )
