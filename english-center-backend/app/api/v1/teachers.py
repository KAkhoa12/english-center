import json
from typing import Annotated

from fastapi import APIRouter, Depends, File, HTTPException, Query, Response, UploadFile
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.response import api_response, build_pagination
from app.db.session import get_db
from app.dependencies.admin import require_admin
from app.dependencies.permissions import require_permission
from app.schemas.common import PaginationParams
from app.schemas.teacher import TeacherCreate, TeacherUpdate
from app.services.admin_data_transfer_service import AdminDataTransferService
from app.services.storage_service import StorageService
from app.services.teacher_service import TeacherService
from app.services.user_service import UserService
from app.utils.file import get_upload_file_size, validate_file_extension, validate_file_size
from app.utils.serializers import user_to_dict

router = APIRouter(prefix="/teachers", tags=["teachers"])


def _teacher_dict(teacher, user):
    return {
        "id": str(teacher.id),
        "user": user_to_dict(user, include_meta=True),
        "specialization": teacher.specialization,
        "bio": teacher.bio,
        "experience_years": teacher.experience_years,
        "certificates": teacher.certificates,
        "hourly_rate": float(teacher.hourly_rate) if teacher.hourly_rate is not None else None,
    }


def _json_download(filename: str, payload: dict) -> Response:
    content = json.dumps(payload, ensure_ascii=False, default=str).encode("utf-8")
    return Response(
        content=content,
        media_type="application/json",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.post("", dependencies=[Depends(require_permission("teacher.create"))])
def create_teacher(payload: TeacherCreate, db: Annotated[Session, Depends(get_db)]):
    svc = TeacherService(db)
    obj = svc.create_teacher(payload)
    user = UserService(db).get_user_by_id(str(obj.user_id))
    return api_response(True, "Teacher created successfully", _teacher_dict(obj, user), None)


@router.get("", dependencies=[Depends(require_permission("teacher.read"))])
def list_teachers(db: Annotated[Session, Depends(get_db)], page: int = Query(1), page_size: int = Query(10), search: str | None = None, sort_by: str | None = None, sort_order: str = Query("desc", pattern="^(asc|desc)$")):
    q = PaginationParams(page=page, page_size=page_size, search=search, sort_by=sort_by, sort_order=sort_order)
    items, total = TeacherService(db).get_teachers(q)
    return api_response(True, "Teachers retrieved successfully", [_teacher_dict(t, u) for t, u in items], build_pagination(page, page_size, total))


@router.get("/export", dependencies=[Depends(require_admin)])
def export_teachers(db: Annotated[Session, Depends(get_db)]):
    payload = AdminDataTransferService(db).export_teachers()
    return _json_download("teachers-export.json", payload)


@router.post("/import", dependencies=[Depends(require_admin)])
def import_teachers(file: UploadFile = File(...), db: Annotated[Session, Depends(get_db)] = None):
    try:
        payload = json.loads(file.file.read().decode("utf-8"))
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Invalid JSON file") from exc
    result = AdminDataTransferService(db).import_teachers(payload)
    return api_response(True, "Teachers imported successfully", result.model_dump(mode="json"), None)


@router.get("/{teacher_id}", dependencies=[Depends(require_permission("teacher.read"))])
def get_teacher(teacher_id: str, db: Annotated[Session, Depends(get_db)]):
    t, u = TeacherService(db).get_teacher_by_id(teacher_id)
    return api_response(True, "Teacher retrieved successfully", _teacher_dict(t, u), None)


@router.patch("/{teacher_id}", dependencies=[Depends(require_permission("teacher.update"))])
def update_teacher(teacher_id: str, payload: TeacherUpdate, db: Annotated[Session, Depends(get_db)]):
    svc = TeacherService(db)
    t = svc.update_teacher(teacher_id, payload)
    u = UserService(db).get_user_by_id(str(t.user_id))
    return api_response(True, "Teacher updated successfully", _teacher_dict(t, u), None)


@router.patch("/{teacher_id}/avatar", dependencies=[Depends(require_permission("teacher.update"))])
def update_teacher_avatar(teacher_id: str, file: UploadFile = File(...), db: Annotated[Session, Depends(get_db)] = None):
    svc = TeacherService(db)
    t, _ = svc.get_teacher_by_id(teacher_id)

    size = get_upload_file_size(file)
    validate_file_extension(file.filename or "avatar", "avatar")
    validate_file_size(size, "avatar")

    storage = StorageService()
    upload = storage.upload_file(
        bucket_name=settings.MINIO_BUCKET_AVATARS,
        file=file,
        file_size=size,
        folder=f"avatars/{t.user_id}",
    )

    user = svc.update_avatar(teacher_id, upload["object_name"])
    t, _ = svc.get_teacher_by_id(teacher_id)
    return api_response(True, "Teacher avatar updated successfully", _teacher_dict(t, user), None)


@router.delete("/{teacher_id}", dependencies=[Depends(require_permission("teacher.delete"))])
def delete_teacher(teacher_id: str, db: Annotated[Session, Depends(get_db)]):
    TeacherService(db).soft_delete_teacher(teacher_id)
    return api_response(True, "Teacher deleted successfully", None, None)
