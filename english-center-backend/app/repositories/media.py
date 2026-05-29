from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.course import Media
from app.repositories.base import BaseRepository


class MediaRepository(BaseRepository[Media]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, Media)

    def get_active_by_id(self, media_id: str) -> Media | None:
        return self.db.execute(
            select(Media).where(Media.id == media_id, Media.deleted_at.is_(None))
        ).scalar_one_or_none()
