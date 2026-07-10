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
from app.schemas.staff import StaffCreate, StaffUpdate
from app.services.admin_data_transfer_service import AdminDataTransferService
from app.services.staff_service import StaffService
from app.services.storage_service import StorageService
from app.services.user_service import UserService
from app.utils.file import get_upload_file_size, validate_file_extension, validate_file_size
from app.utils.serializers import user_to_dict

router = APIRouter(prefix="/staff", tags=["staff"])


def _staff_dict(st, user):
    return {
        "id": str(st.id),
        "user": user_to_dict(user, include_meta=True),
        "position": st.position,
        "department": st.department,
        "note": st.note,
    }


def _json_download(filename: str, payload: dict) -> Response:
    content = json.dumps(payload, ensure_ascii=False, default=str).encode("utf-8")
    return Response(
        content=content,
        media_type="application/json",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.post("", dependencies=[Depends(require_permission("staff.create"))])
def create_staff(payload: StaffCreate, db: Annotated[Session, Depends(get_db)]):
    svc = StaffService(db)
    st = svc.create_staff(payload)
    user = UserService(db).get_user_by_id(str(st.user_id))
    return api_response(True, "Staff created successfully", _staff_dict(st, user), None)


@router.get("", dependencies=[Depends(require_permission("staff.read"))])
def list_staff(db: Annotated[Session, Depends(get_db)], page: int = Query(1), page_size: int = Query(10), search: str | None = None, sort_by: str | None = None, sort_order: str = Query("desc", pattern="^(asc|desc)$")):
    q = PaginationParams(page=page, page_size=page_size, search=search, sort_by=sort_by, sort_order=sort_order)
    items, total = StaffService(db).get_staff(q)
    return api_response(True, "Staff retrieved successfully", [_staff_dict(st, u) for st, u in items], build_pagination(page, page_size, total))


@router.get("/export", dependencies=[Depends(require_admin)])
def export_staff(db: Annotated[Session, Depends(get_db)]):
    payload = AdminDataTransferService(db).export_staff()
    return _json_download("staff-export.json", payload)


@router.post("/import", dependencies=[Depends(require_admin)])
def import_staff(file: UploadFile = File(...), db: Annotated[Session, Depends(get_db)] = None):
    try:
        payload = json.loads(file.file.read().decode("utf-8"))
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Invalid JSON file") from exc
    result = AdminDataTransferService(db).import_staff(payload)
    return api_response(True, "Staff imported successfully", result.model_dump(mode="json"), None)


@router.get("/{staff_id}", dependencies=[Depends(require_permission("staff.read"))])
def get_staff(staff_id: str, db: Annotated[Session, Depends(get_db)]):
    st, u = StaffService(db).get_staff_by_id(staff_id)
    return api_response(True, "Staff retrieved successfully", _staff_dict(st, u), None)


@router.patch("/{staff_id}", dependencies=[Depends(require_permission("staff.update"))])
def update_staff(staff_id: str, payload: StaffUpdate, db: Annotated[Session, Depends(get_db)]):
    svc = StaffService(db)
    st = svc.update_staff(staff_id, payload)
    u = UserService(db).get_user_by_id(str(st.user_id))
    return api_response(True, "Staff updated successfully", _staff_dict(st, u), None)


@router.patch("/{staff_id}/avatar", dependencies=[Depends(require_permission("staff.update"))])
def update_staff_avatar(staff_id: str, file: UploadFile = File(...), db: Annotated[Session, Depends(get_db)] = None):
    svc = StaffService(db)
    st, _ = svc.get_staff_by_id(staff_id)

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

    user = svc.update_avatar(staff_id, upload["object_name"])
    st, _ = svc.get_staff_by_id(staff_id)
    return api_response(True, "Staff avatar updated successfully", _staff_dict(st, user), None)


@router.delete("/{staff_id}", dependencies=[Depends(require_permission("staff.delete"))])
def delete_staff(staff_id: str, db: Annotated[Session, Depends(get_db)]):
    StaffService(db).soft_delete_staff(staff_id)
    return api_response(True, "Staff deleted successfully", None, None)
