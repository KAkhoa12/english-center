from datetime import timedelta
from typing import Any

from fastapi import HTTPException, UploadFile, status
from minio import Minio
from minio.error import S3Error

from app.core.config import settings
from app.utils.file import generate_object_name


class StorageService:
    def __init__(self) -> None:
        self._client: Minio | None = None
        self.allowed_buckets = {
            settings.MINIO_BUCKET_AVATARS,
            settings.MINIO_BUCKET_MATERIALS,
            settings.MINIO_BUCKET_SUBMISSIONS,
            settings.MINIO_BUCKET_VIDEOS,
            settings.MINIO_BUCKET_EXPORTS,
        }

    def get_client(self) -> Minio:
        if self._client is None:
            self._client = Minio(
                endpoint=settings.MINIO_ENDPOINT,
                access_key=settings.MINIO_ROOT_USER,
                secret_key=settings.MINIO_ROOT_PASSWORD,
                secure=settings.MINIO_SECURE,
            )
        return self._client

    def _validate_bucket(self, bucket_name: str) -> None:
        if bucket_name not in self.allowed_buckets:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Bucket is not allowed")

    def ensure_bucket(self, bucket_name: str) -> None:
        self._validate_bucket(bucket_name)
        client = self.get_client()
        try:
            if not client.bucket_exists(bucket_name):
                client.make_bucket(bucket_name)
        except S3Error as exc:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Bucket operation failed: {exc.code}") from exc

    def upload_file(
        self,
        bucket_name: str,
        file: UploadFile,
        file_size: int,
        object_name: str | None = None,
        folder: str | None = None,
    ) -> dict:
        self.ensure_bucket(bucket_name)
        client = self.get_client()
        object_key = object_name or generate_object_name(file.filename or "file", folder=folder)
        try:
            file.file.seek(0)
            client.put_object(
                bucket_name=bucket_name,
                object_name=object_key,
                data=file.file,
                length=file_size,
                content_type=file.content_type or "application/octet-stream",
            )
            return {
                "bucket": bucket_name,
                "object_name": object_key,
                "original_filename": file.filename or "",
                "content_type": file.content_type,
                "size": file_size,
            }
        except S3Error as exc:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Upload failed: {exc.code}") from exc

    def get_presigned_url(self, bucket_name: str, object_name: str, expires: int | None = None) -> str:
        self._validate_bucket(bucket_name)
        client = self.get_client()
        expiry = timedelta(seconds=expires or settings.MINIO_PRESIGNED_EXPIRE_SECONDS)
        try:
            return client.get_presigned_url("GET", bucket_name, object_name, expires=expiry)
        except S3Error as exc:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Cannot generate presigned URL: {exc.code}") from exc

    def object_exists(self, bucket_name: str, object_name: str) -> bool:
        self._validate_bucket(bucket_name)
        client = self.get_client()
        try:
            client.stat_object(bucket_name, object_name)
            return True
        except S3Error:
            return False

    def delete_file(self, bucket_name: str, object_name: str) -> None:
        self._validate_bucket(bucket_name)
        client = self.get_client()
        try:
            client.remove_object(bucket_name, object_name)
        except S3Error as exc:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Delete failed: {exc.code}") from exc

    def list_allowed_buckets(self) -> list[str]:
        return sorted(self.allowed_buckets)

    def build_public_url(self, bucket_name: str, object_name: str) -> str:
        scheme = "https" if settings.MINIO_SECURE else "http"
        return f"{scheme}://{settings.MINIO_PUBLIC_ENDPOINT}/{bucket_name}/{object_name}"

    def list_objects(
        self,
        bucket_name: str,
        prefix: str | None = None,
        recursive: bool = True,
        images_only: bool = True,
    ) -> list[dict[str, Any]]:
        self._validate_bucket(bucket_name)
        client = self.get_client()
        image_exts = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".svg"}
        try:
            items: list[dict[str, Any]] = []
            for obj in client.list_objects(bucket_name=bucket_name, prefix=prefix, recursive=recursive):
                object_name = obj.object_name or ""
                lower_name = object_name.lower()
                if images_only and not any(lower_name.endswith(ext) for ext in image_exts):
                    continue
                items.append(
                    {
                        "object_name": object_name,
                        "size": obj.size,
                        "last_modified": obj.last_modified,
                        "url": self.build_public_url(bucket_name, object_name),
                    }
                )
            return items
        except S3Error as exc:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"List objects failed: {exc.code}") from exc
