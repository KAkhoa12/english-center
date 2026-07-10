import re
import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile, status

ALLOWED_EXTENSIONS: dict[str, set[str]] = {
    "avatar": {"jpg", "jpeg", "png", "webp"},
    "media": {"jpg", "jpeg", "png", "webp", "mp4", "webm", "mov"},
    "material": {"pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx", "txt", "jpg", "jpeg", "png", "webp", "gif"},
    "submission": {"pdf", "doc", "docx", "txt", "zip"},
    "video": {"mp4", "webm", "mov"},
    "export": {"csv", "xlsx", "pdf"},
}

MAX_FILE_SIZE_BYTES: dict[str, int] = {
    "avatar": 5 * 1024 * 1024,
    "media": 500 * 1024 * 1024,
    "material": 50 * 1024 * 1024,
    "submission": 50 * 1024 * 1024,
    "video": 500 * 1024 * 1024,
    "export": 50 * 1024 * 1024,
}


def sanitize_filename(filename: str) -> str:
    name = Path(filename).name
    return re.sub(r"[^a-zA-Z0-9._-]", "_", name)


def get_file_extension(filename: str) -> str:
    return Path(filename).suffix.lower().lstrip(".")


def validate_file_extension(filename: str, bucket_type: str) -> None:
    ext = get_file_extension(filename)
    if ext not in ALLOWED_EXTENSIONS[bucket_type]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File extension is not allowed")


def validate_file_size(size: int, bucket_type: str) -> None:
    max_size = MAX_FILE_SIZE_BYTES[bucket_type]
    if size > max_size:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File size exceeds allowed limit")


def get_upload_file_size(file: UploadFile) -> int:
    current = file.file.tell()
    file.file.seek(0, 2)
    size = file.file.tell()
    file.file.seek(current)
    return size


def generate_object_name(original_filename: str, folder: str | None = None) -> str:
    safe_name = sanitize_filename(original_filename)
    ext = get_file_extension(safe_name)
    generated = f"{uuid.uuid4().hex}.{ext}" if ext else uuid.uuid4().hex
    if folder:
        clean_folder = "/".join(part.strip() for part in folder.strip("/").split("/") if part.strip())
        if not clean_folder:
            return generated
        return f"{clean_folder}/{generated}"
    return generated
