from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.course import CourseTag, CourseTagMapping
from app.repositories.base import BaseRepository


class CourseTagMappingRepository(BaseRepository[CourseTagMapping]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, CourseTagMapping)

    def get_active_by_course_id(self, course_id: str) -> list[CourseTagMapping]:
        return list(
            self.db.execute(
                select(CourseTagMapping).where(
                    CourseTagMapping.course_id == course_id,
                    CourseTagMapping.deleted_at.is_(None),
                )
            ).scalars().all()
        )

    def get_relation(self, course_id: str, tag_id: str) -> CourseTagMapping | None:
        return self.db.execute(
            select(CourseTagMapping).where(
                CourseTagMapping.course_id == course_id,
                CourseTagMapping.tag_id == tag_id,
            )
        ).scalar_one_or_none()

    def get_tags_by_course_id(self, course_id: str) -> list[CourseTag]:
        return list(
            self.db.execute(
                select(CourseTag)
                .join(CourseTagMapping, CourseTagMapping.tag_id == CourseTag.id)
                .where(
                    CourseTagMapping.course_id == course_id,
                    CourseTagMapping.deleted_at.is_(None),
                    CourseTag.deleted_at.is_(None),
                )
            ).scalars().all()
        )
