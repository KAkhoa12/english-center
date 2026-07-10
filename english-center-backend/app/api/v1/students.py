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
from app.schemas.student import StudentCreate, StudentUpdate
from app.services.admin_data_transfer_service import AdminDataTransferService
from app.services.storage_service import StorageService
from app.services.student_service import StudentService
from app.services.user_service import UserService
from app.utils.file import get_upload_file_size, validate_file_extension, validate_file_size
from app.utils.serializers import user_to_dict

router = APIRouter(prefix="/students", tags=["students"])


def _student_dict(student, user):
    return {
        "id": str(student.id),
        "user": user_to_dict(user, include_meta=True),
        "date_of_birth": student.date_of_birth,
        "gender": student.gender,
        "address": student.address,
        "level": student.level.value if student.level else None,
        "learning_goal": student.learning_goal,
        "parent_name": student.parent_name,
        "parent_phone": student.parent_phone,
    }


def _json_download(filename: str, payload: dict) -> Response:
    content = json.dumps(payload, ensure_ascii=False, default=str).encode("utf-8")
    return Response(
        content=content,
        media_type="application/json",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.post("", dependencies=[Depends(require_permission("student.create"))])
def create_student(payload: StudentCreate, db: Annotated[Session, Depends(get_db)]):
    svc = StudentService(db)
    st = svc.create_student(payload)
    user = UserService(db).get_user_by_id(str(st.user_id))
    return api_response(True, "Student created successfully", _student_dict(st, user), None)


@router.get("", dependencies=[Depends(require_permission("student.read"))])
def list_students(db: Annotated[Session, Depends(get_db)], page: int = Query(1), page_size: int = Query(10), search: str | None = None, sort_by: str | None = None, sort_order: str = Query("desc", pattern="^(asc|desc)$"), level: str | None = None):
    q = PaginationParams(page=page, page_size=page_size, search=search, sort_by=sort_by, sort_order=sort_order)
    items, total = StudentService(db).get_students(q, level)
    payload = [_student_dict(st, user) for st, user in items]
    return api_response(True, "Students retrieved successfully", payload, build_pagination(page, page_size, total))


@router.get("/export", dependencies=[Depends(require_admin)])
def export_students(db: Annotated[Session, Depends(get_db)]):
    payload = AdminDataTransferService(db).export_students()
    return _json_download("students-export.json", payload)


@router.post("/import", dependencies=[Depends(require_admin)])
def import_students(file: UploadFile = File(...), db: Annotated[Session, Depends(get_db)] = None):
    try:
        payload = json.loads(file.file.read().decode("utf-8"))
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Invalid JSON file") from exc
    result = AdminDataTransferService(db).import_students(payload)
    return api_response(True, "Students imported successfully", result.model_dump(mode="json"), None)


@router.get("/{student_id}", dependencies=[Depends(require_permission("student.read"))])
def get_student(student_id: str, db: Annotated[Session, Depends(get_db)]):
    st, user = StudentService(db).get_student_by_id(student_id)
    return api_response(True, "Student retrieved successfully", _student_dict(st, user), None)


@router.patch("/{student_id}", dependencies=[Depends(require_permission("student.update"))])
def update_student(student_id: str, payload: StudentUpdate, db: Annotated[Session, Depends(get_db)]):
    svc = StudentService(db)
    st = svc.update_student(student_id, payload)
    user = UserService(db).get_user_by_id(str(st.user_id))
    return api_response(True, "Student updated successfully", _student_dict(st, user), None)


@router.patch("/{student_id}/avatar", dependencies=[Depends(require_permission("student.update"))])
def update_student_avatar(student_id: str, file: UploadFile = File(...), db: Annotated[Session, Depends(get_db)] = None):
    svc = StudentService(db)
    st, _ = svc.get_student_by_id(student_id)

    size = get_upload_file_size(file)
    validate_file_extension(file.filename or "avatar", "avatar")
    validate_file_size(size, "avatar")

    storage = StorageService()
    upload = storage.upload_file(
        bucket_name=settings.MINIO_BUCKET_AVATARS,
        file=file,
        file_size=size,
        folder=f"avatars/{st.user_id}",
    )

    user = svc.update_avatar(student_id, upload["object_name"])
    st, _ = svc.get_student_by_id(student_id)
    return api_response(True, "Student avatar updated successfully", _student_dict(st, user), None)


@router.delete("/{student_id}", dependencies=[Depends(require_permission("student.delete"))])
def delete_student(student_id: str, db: Annotated[Session, Depends(get_db)]):
    StudentService(db).soft_delete_student(student_id)
    return api_response(True, "Student deleted successfully", None, None)
