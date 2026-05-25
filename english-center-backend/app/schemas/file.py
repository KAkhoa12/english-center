from enum import Enum

from pydantic import BaseModel


class BucketType(str, Enum):
    avatar = "avatar"
    material = "material"
    submission = "submission"
    video = "video"
    export = "export"


class FileUploadPayload(BaseModel):
    bucket: str
    object_name: str
    original_filename: str
    content_type: str | None
    size: int
    presigned_url: str


class PresignedUrlPayload(BaseModel):
    bucket: str
    object_name: str
    url: str
    expires_in: int


class DeleteFilePayload(BaseModel):
    bucket: str
    object_name: str
