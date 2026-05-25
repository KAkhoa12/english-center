from fastapi import APIRouter, Depends, File, Form, Query, UploadFile

from app.core.config import settings
from app.core.response import api_response
from app.dependencies.auth import require_jwt
from app.schemas.file import BucketType
from app.services.storage_service import StorageService
from app.utils.file import get_upload_file_size, validate_file_extension, validate_file_size

router = APIRouter(prefix="/files", tags=["files"])


def resolve_bucket(bucket_type: BucketType) -> str:
    mapping = {
        BucketType.avatar: settings.MINIO_BUCKET_AVATARS,
        BucketType.material: settings.MINIO_BUCKET_MATERIALS,
        BucketType.submission: settings.MINIO_BUCKET_SUBMISSIONS,
        BucketType.video: settings.MINIO_BUCKET_VIDEOS,
        BucketType.export: settings.MINIO_BUCKET_EXPORTS,
    }
    return mapping[bucket_type]


@router.post("/upload")
def upload_file(
    current_user = Depends(require_jwt),
    file: UploadFile = File(...),
    bucket_type: BucketType = Form(...),
    folder: str | None = Form(None),
):
    _ = current_user
    bucket = resolve_bucket(bucket_type)
    size = get_upload_file_size(file)
    validate_file_extension(file.filename or "file", bucket_type.value)
    validate_file_size(size, bucket_type.value)

    service = StorageService()
    data = service.upload_file(bucket_name=bucket, file=file, file_size=size, folder=folder)
    return api_response(True, "File uploaded successfully", data, None)


@router.get("/presigned-url")
def get_presigned_url(
    current_user = Depends(require_jwt),
    bucket_type: BucketType = Query(...),
    object_name: str = Query(...),
):
    _ = current_user
    bucket = resolve_bucket(bucket_type)
    service = StorageService()
    url = service.get_presigned_url(bucket, object_name)
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
def delete_file(
    current_user = Depends(require_jwt),
    bucket_type: BucketType = Query(...),
    object_name: str = Query(...),
):
    _ = current_user
    bucket = resolve_bucket(bucket_type)
    service = StorageService()
    if not service.object_exists(bucket, object_name):
        return api_response(False, "File not found", None, None)
    service.delete_file(bucket, object_name)
    return api_response(True, "File deleted successfully", {"bucket": bucket, "object_name": object_name}, None)
