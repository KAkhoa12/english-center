from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.commerce import CourseEnrollment
from app.repositories.base import BaseRepository


class CourseEnrollmentRepository(BaseRepository[CourseEnrollment]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, CourseEnrollment)

    def list_by_user_id(self, user_id: str) -> list[CourseEnrollment]:
        return list(
            self.db.execute(
                select(CourseEnrollment)
                .where(CourseEnrollment.user_id == user_id, CourseEnrollment.deleted_at.is_(None))
                .order_by(CourseEnrollment.created_at.desc())
            ).scalars().all()
        )

    def get_active_by_id(self, enrollment_id: str) -> CourseEnrollment | None:
        return self.get(enrollment_id)

    def get_by_user_and_course(self, user_id: str, course_id: str) -> CourseEnrollment | None:
        return self.db.execute(
            select(CourseEnrollment).where(
                CourseEnrollment.user_id == user_id,
                CourseEnrollment.course_id == course_id,
                CourseEnrollment.deleted_at.is_(None),
            )
        ).scalar_one_or_none()

    def list_by_course_id(self, course_id: str) -> list[CourseEnrollment]:
        return list(
            self.db.execute(
                select(CourseEnrollment)
                .where(CourseEnrollment.course_id == course_id, CourseEnrollment.deleted_at.is_(None))
                .order_by(CourseEnrollment.created_at.desc())
            ).scalars().all()
        )

    def list_filtered(self, user_id: str | None = None) -> list[CourseEnrollment]:
        stmt = select(CourseEnrollment).where(CourseEnrollment.deleted_at.is_(None))
        if user_id:
            stmt = stmt.where(CourseEnrollment.user_id == user_id)
        stmt = stmt.order_by(CourseEnrollment.enrolled_at.desc())
        return list(self.db.execute(stmt).scalars().all())
