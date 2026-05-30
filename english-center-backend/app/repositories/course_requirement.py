from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.course import CourseRequirement
from app.repositories.base import BaseRepository


class CourseRequirementRepository(BaseRepository[CourseRequirement]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, CourseRequirement)

    def list_by_course_id(self, course_id: str) -> list[CourseRequirement]:
        return list(
            self.db.execute(
                select(CourseRequirement)
                .where(CourseRequirement.course_id == course_id, CourseRequirement.deleted_at.is_(None))
                .order_by(CourseRequirement.order_index.asc())
            ).scalars().all()
        )

    def get_active_by_id(self, requirement_id: str) -> CourseRequirement | None:
        return self.get(requirement_id)
