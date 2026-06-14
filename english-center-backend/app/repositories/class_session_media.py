from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.class_session import ClassSessionMedia
from app.repositories.base import BaseRepository


class ClassSessionMediaRepository(BaseRepository[ClassSessionMedia]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, ClassSessionMedia)

    def get_active_by_id(self, media_id: str) -> ClassSessionMedia | None:
        return self.get(media_id)

    def list_by_session_id(self, session_id: str) -> list[ClassSessionMedia]:
        return list(
            self.db.execute(
                select(ClassSessionMedia)
                .where(
                    ClassSessionMedia.class_session_id == session_id,
                    ClassSessionMedia.deleted_at.is_(None),
                )
                .order_by(ClassSessionMedia.order_index.asc(), ClassSessionMedia.created_at.asc())
            ).scalars().all()
        )
