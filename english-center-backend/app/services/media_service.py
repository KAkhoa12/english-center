from typing import Any

from fastapi import HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.course import Media
from app.schemas.common import PaginationParams
from app.repositories.media import MediaRepository
from app.services.storage_service import StorageService


class MediaService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.media_repo = MediaRepository(db)
        self.storage_service = StorageService()

    @staticmethod
    def _normalize_folder(folder: str | None) -> str | None:
        if folder is None:
            return None
        normalized = folder.strip().strip("/")
        if not normalized:
            return None
        parts = [part.strip() for part in normalized.split("/") if part.strip()]
        return "/".join(parts) or None

    def media_dict(self, media: Media, include_url: bool = True) -> dict[str, Any]:
        payload = {
            "id": str(media.id),
            "bucket": media.bucket,
            "folder": media.folder,
            "object_name": media.object_name,
            "original_filename": media.original_filename,
            "content_type": media.content_type,
            "size": media.size,
            "created_at": media.created_at,
            "updated_at": media.updated_at,
        }
        if include_url:
            payload["url"] = self.storage_service.get_presigned_url(media.bucket, media.object_name)
        return payload

    def get_media(self, media_id: str) -> Media:
        media = self.media_repo.get_active_by_id(media_id)
        if not media:
            raise HTTPException(status_code=404, detail="Media not found")
        return media

    def list_media(self, bucket: str | None = None, folder: str | None = None) -> list[Media]:
        return self.media_repo.list_active(bucket=bucket, folder=self._normalize_folder(folder))

    def list_media_paginated(
        self,
        query: PaginationParams,
        bucket: str | None = None,
        folder: str | None = None,
    ) -> tuple[list[Media], int]:
        return self.media_repo.list_filtered(query, bucket=bucket, folder=self._normalize_folder(folder))

    def upload_media(
        self,
        bucket_name: str,
        file: UploadFile,
        file_size: int,
        folder: str | None = None,
        uploaded_by: str | None = None,
    ) -> Media:
        folder = self._normalize_folder(folder)
        uploaded = self.storage_service.upload_file(
            bucket_name=bucket_name,
            file=file,
            file_size=file_size,
            folder=folder,
        )
        media = Media(
            bucket=uploaded["bucket"],
            folder=folder,
            object_name=uploaded["object_name"],
            original_filename=file.filename,
            content_type=file.content_type,
            size=file_size,
            uploaded_by=uploaded_by,
        )
        self.media_repo.create(media)
        self.db.commit()
        self.db.refresh(media)
        return media

    def delete_media(self, media_id: str) -> None:
        media = self.get_media(media_id)
        self.storage_service.delete_file(media.bucket, media.object_name)
        self.media_repo.soft_delete(media)
        self.db.commit()

    def get_presigned_url(self, media_id: str, expires: int | None = None) -> str:
        media = self.get_media(media_id)
        expiry = expires or settings.MINIO_PRESIGNED_EXPIRE_SECONDS
        return self.storage_service.get_presigned_url(media.bucket, media.object_name, expires=expiry)
