from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.commerce import CourseWishlist
from app.models.course import Course
from app.repositories.base import BaseRepository


class CourseWishlistRepository(BaseRepository[CourseWishlist]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, CourseWishlist)

    def list_by_user_id(self, user_id: str) -> list[CourseWishlist]:
        return list(
            self.db.execute(
                select(CourseWishlist).where(CourseWishlist.user_id == user_id, CourseWishlist.deleted_at.is_(None))
            ).scalars().all()
        )

    def get_by_user_and_course(self, user_id: str, course_id: str) -> CourseWishlist | None:
        return self.db.execute(
            select(CourseWishlist).where(
                CourseWishlist.user_id == user_id,
                CourseWishlist.course_id == course_id,
            )
        ).scalar_one_or_none()

    def get_active_by_user_and_course(self, user_id: str, course_id: str) -> CourseWishlist | None:
        return self.db.execute(
            select(CourseWishlist).where(
                CourseWishlist.user_id == user_id,
                CourseWishlist.course_id == course_id,
                CourseWishlist.deleted_at.is_(None),
            )
        ).scalar_one_or_none()

    def list_with_course_by_user_id(self, user_id: str) -> list[tuple[CourseWishlist, Course]]:
        return list(
            self.db.execute(
                select(CourseWishlist, Course)
                .join(Course, Course.id == CourseWishlist.course_id)
                .where(
                    CourseWishlist.user_id == user_id,
                    CourseWishlist.deleted_at.is_(None),
                    Course.deleted_at.is_(None),
                )
            ).all()
        )

    def count_active_by_user_id(self, user_id: str) -> int:
        return int(
            self.db.execute(
                select(func.count())
                .select_from(CourseWishlist)
                .where(CourseWishlist.user_id == user_id, CourseWishlist.deleted_at.is_(None))
            ).scalar_one()
        )
