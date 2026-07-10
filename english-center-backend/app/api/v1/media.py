from typing import Annotated

from fastapi import APIRouter, Depends, File, Form, Query, UploadFile
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.response import api_response, build_pagination
from app.db.session import get_db
from app.dependencies.auth import require_jwt
from app.schemas.common import PaginationParams
from app.schemas.file import BucketType
from app.services.media_service import MediaService
from app.services.storage_service import StorageService
from app.utils.file import get_upload_file_size, validate_file_extension, validate_file_size


def resolve_bucket(bucket_type: BucketType) -> str:
    mapping = {
        BucketType.avatar: settings.MINIO_BUCKET_AVATARS,
        BucketType.material: settings.MINIO_BUCKET_MATERIALS,
        BucketType.submission: settings.MINIO_BUCKET_SUBMISSIONS,
        BucketType.video: settings.MINIO_BUCKET_VIDEOS,
        BucketType.export: settings.MINIO_BUCKET_EXPORTS,
    }
    return mapping[bucket_type]


def build_media_router(prefix: str, tag: str) -> APIRouter:
    router = APIRouter(prefix=prefix, tags=[tag])

    @router.get("")
    def list_media(
        db: Annotated[Session, Depends(get_db)],
        current_user=Depends(require_jwt),
        page: int = Query(1),
        page_size: int = Query(10),
        search: str | None = None,
        sort_by: str | None = None,
        sort_order: str = Query("desc", pattern="^(asc|desc)$"),
        bucket_type: BucketType | None = Query(None),
        folder: str | None = Query(None),
    ):
        _ = current_user
        service = MediaService(db)
        bucket = resolve_bucket(bucket_type) if bucket_type else None
        query = PaginationParams(page=page, page_size=page_size, search=search, sort_by=sort_by, sort_order=sort_order)
        items, total = service.list_media_paginated(query, bucket=bucket, folder=folder)
        return api_response(
            True,
            "Media retrieved successfully",
            [service.media_dict(item, include_url=False) for item in items],
            build_pagination(page, page_size, total),
        )

    @router.post("/upload")
    def upload_media(
        db: Annotated[Session, Depends(get_db)],
        current_user=Depends(require_jwt),
        file: UploadFile = File(...),
        bucket_type: BucketType = Form(...),
        folder: str | None = Form(None),
    ):
        bucket = resolve_bucket(bucket_type)
        size = get_upload_file_size(file)
        validate_file_extension(file.filename or "file", bucket_type.value)
        validate_file_size(size, bucket_type.value)
        service = MediaService(db)
        media = service.upload_media(bucket_name=bucket, file=file, file_size=size, folder=folder, uploaded_by=str(current_user.id))
        return api_response(True, "Media uploaded successfully", service.media_dict(media), None)

    @router.get("/presigned-url")
    def get_presigned_url(
        db: Annotated[Session, Depends(get_db)],
        current_user=Depends(require_jwt),
        media_id: str | None = Query(None),
        bucket_type: BucketType | None = Query(None),
        object_name: str | None = Query(None),
    ):
        _ = current_user
        service = MediaService(db)
        if media_id:
            media = service.get_media(media_id)
            url = service.get_presigned_url(media_id)
            payload = {
                "bucket": media.bucket,
                "folder": media.folder,
                "object_name": media.object_name,
                "url": url,
                "expires_in": settings.MINIO_PRESIGNED_EXPIRE_SECONDS,
            }
            return api_response(True, "Presigned URL generated successfully", payload, None)

        if not bucket_type or not object_name:
            return api_response(False, "media_id or bucket_type/object_name is required", None, None)

        bucket = resolve_bucket(bucket_type)
        url = StorageService().get_presigned_url(bucket, object_name)
        payload = {
            "bucket": bucket,
            "object_name": object_name,
            "url": url,
            "expires_in": settings.MINIO_PRESIGNED_EXPIRE_SECONDS,
        }
        return api_response(True, "Presigned URL generated successfully", payload, None)

    @router.get("/buckets")
    def list_buckets(current_user=Depends(require_jwt)):
        _ = current_user
        service = StorageService()
        payload = [{"bucket": bucket} for bucket in service.list_allowed_buckets()]
        return api_response(True, "Buckets retrieved successfully", payload, None)

    @router.get("/buckets/{bucket_type}/objects")
    def list_bucket_objects(
        bucket_type: BucketType,
        current_user=Depends(require_jwt),
        prefix: str | None = Query(None),
        images_only: bool = Query(True),
    ):
        _ = current_user
        bucket = resolve_bucket(bucket_type)
        service = StorageService()
        payload = {
            "bucket": bucket,
            "prefix": prefix,
            "items": service.list_objects(bucket_name=bucket, prefix=prefix, images_only=images_only),
        }
        return api_response(True, "Bucket objects retrieved successfully", payload, None)

    @router.delete("")
    def delete_media(
        db: Annotated[Session, Depends(get_db)],
        current_user=Depends(require_jwt),
        media_id: str | None = Query(None),
        bucket_type: BucketType | None = Query(None),
        object_name: str | None = Query(None),
    ):
        _ = current_user
        service = MediaService(db)
        if media_id:
            service.delete_media(media_id)
            return api_response(True, "Media deleted successfully", {"media_id": media_id}, None)

        if not bucket_type or not object_name:
            return api_response(False, "media_id or bucket_type/object_name is required", None, None)

        bucket = resolve_bucket(bucket_type)
        storage = StorageService()
        if not storage.object_exists(bucket, object_name):
            return api_response(False, "File not found", None, None)
        storage.delete_file(bucket, object_name)
        return api_response(True, "File deleted successfully", {"bucket": bucket, "object_name": object_name}, None)

    return router


router = build_media_router("/media", "media")
