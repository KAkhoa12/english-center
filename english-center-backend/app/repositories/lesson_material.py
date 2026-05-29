from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.course import LessonMaterial
from app.repositories.base import BaseRepository


class LessonMaterialRepository(BaseRepository[LessonMaterial]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, LessonMaterial)

    def list_by_lesson_id(self, lesson_id: str) -> list[LessonMaterial]:
        return list(
            self.db.execute(
                select(LessonMaterial)
                .where(LessonMaterial.lesson_id == lesson_id, LessonMaterial.deleted_at.is_(None))
                .order_by(LessonMaterial.order_index.asc())
            ).scalars().all()
        )
