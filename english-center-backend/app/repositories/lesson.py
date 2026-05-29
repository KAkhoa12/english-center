from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.course import Lesson
from app.repositories.base import BaseRepository


class LessonRepository(BaseRepository[Lesson]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, Lesson)

    def list_by_course_id(self, course_id: str) -> list[Lesson]:
        return list(
            self.db.execute(
                select(Lesson)
                .where(Lesson.course_id == course_id, Lesson.deleted_at.is_(None))
                .order_by(Lesson.order_index.asc())
            ).scalars().all()
        )

    def get_active_by_id(self, lesson_id: str) -> Lesson | None:
        return self.get(lesson_id)

    def list_by_module_id(self, module_id: str) -> list[Lesson]:
        return list(
            self.db.execute(
                select(Lesson)
                .where(Lesson.module_id == module_id, Lesson.deleted_at.is_(None))
                .order_by(Lesson.order_index.asc())
            ).scalars().all()
        )
