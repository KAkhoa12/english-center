from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.models.course import Lesson, LessonStatus
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

    def list_filtered_by_course(
        self,
        course_id: str,
        module_id: str | None = None,
        status: LessonStatus | None = None,
        search: str | None = None,
    ) -> list[Lesson]:
        stmt = select(Lesson).where(Lesson.course_id == course_id, Lesson.deleted_at.is_(None))
        if module_id:
            stmt = stmt.where(Lesson.module_id == module_id)
        if status:
            stmt = stmt.where(Lesson.status == status)
        if search:
            term = f"%{search}%"
            stmt = stmt.where(or_(Lesson.title.ilike(term), Lesson.description.ilike(term)))
        return list(self.db.execute(stmt).scalars().all())
