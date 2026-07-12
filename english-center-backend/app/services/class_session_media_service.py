from typing import Any

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.class_session import ClassSessionMedia
from app.repositories.class_session_media import ClassSessionMediaRepository
from app.repositories.media import MediaRepository
from app.schemas.class_session_media import ClassSessionMediaCreate, ClassSessionMediaUpdate
from app.services.class_session_service import ClassSessionService
from app.services.media_service import MediaService


class ClassSessionMediaService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.media_repo = ClassSessionMediaRepository(db)
        self.file_repo = MediaRepository(db)
        self.media_service = MediaService(db)

    def _media_dict(self, media) -> dict[str, Any] | None:
        if not media:
            return None
        return self.media_service.media_dict(media)

    def media_dict(self, item: ClassSessionMedia) -> dict[str, Any]:
        media = self.file_repo.get_active_by_id(str(item.media_id))
        return {
            "id": str(item.id),
            "class_session_id": str(item.class_session_id),
            "media_id": str(item.media_id),
            "title": item.title,
            "description": item.description,
            "order_index": item.order_index,
            "media": self._media_dict(media),
        }

    def list_by_session(self, session_id: str) -> list[ClassSessionMedia]:
        ClassSessionService(self.db).get_session_by_id(session_id)
        return self.media_repo.list_by_session_id(session_id)

    def create_media(self, session_id: str, payload: ClassSessionMediaCreate) -> ClassSessionMedia:
        ClassSessionService(self.db).get_session_by_id(session_id)
        media = self.file_repo.get_active_by_id(payload.media_id)
        if not media:
            raise HTTPException(status_code=404, detail="Media not found")
        item = ClassSessionMedia(
            class_session_id=session_id,
            media_id=media.id,
            title=payload.title,
            description=payload.description,
            order_index=payload.order_index,
        )
        created = self.media_repo.create(item)
        self.db.commit()
        return created

    def upload_media_file(
        self,
        session_id: str,
        file,
        file_size: int,
        title: str | None = None,
        description: str | None = None,
        order_index: int = 0,
        uploaded_by: str | None = None,
    ) -> ClassSessionMedia:
        ClassSessionService(self.db).get_session_by_id(session_id)
        media = self.media_service.upload_media(
            bucket_name=settings.MINIO_BUCKET_MATERIALS,
            file=file,
            file_size=file_size,
            folder=f"class-sessions/{session_id}/materials",
            uploaded_by=uploaded_by,
        )
        item = ClassSessionMedia(
            class_session_id=session_id,
            media_id=media.id,
            title=title or file.filename,
            description=description,
            order_index=order_index,
        )
        created = self.media_repo.create(item)
        self.db.commit()
        return created

    def get_media_by_id(self, media_id: str) -> ClassSessionMedia:
        item = self.media_repo.get_active_by_id(media_id)
        if not item:
            raise HTTPException(status_code=404, detail="Class session media not found")
        return item

    def update_media(self, media_id: str, payload: ClassSessionMediaUpdate) -> ClassSessionMedia:
        item = self.get_media_by_id(media_id)
        for field in ["title", "description", "order_index"]:
            value = getattr(payload, field)
            if value is not None:
                setattr(item, field, value)
        updated = self.media_repo.update(item)
        self.db.commit()
        return updated

    def soft_delete_media(self, media_id: str) -> None:
        item = self.get_media_by_id(media_id)
        self.media_repo.soft_delete(item)
        self.db.commit()
