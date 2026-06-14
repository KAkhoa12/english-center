from datetime import date
from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.response import api_response, build_pagination
from app.db.session import get_db
from app.dependencies.auth import require_jwt
from app.dependencies.permissions import require_permission
from app.models.rbac.user import User
from app.schemas.class_session import ClassSessionBulkCreate, ClassSessionCreate, ClassSessionUpdate
from app.schemas.common import PaginationParams
from app.services.class_session_service import ClassSessionService

router = APIRouter(tags=["class-sessions"])


@router.post("/classes/{class_id}/sessions", dependencies=[Depends(require_permission("class_session.create"))])
def create_session(class_id: str, payload: ClassSessionCreate, db: Annotated[Session, Depends(get_db)]):
    service = ClassSessionService(db)
    item = service.create_session(class_id, payload)
    return api_response(True, "Class session created successfully", service.session_detail_dict(item), None)


@router.post("/classes/{class_id}/sessions/bulk", dependencies=[Depends(require_permission("class_session.create"))])
def create_sessions_bulk(class_id: str, payload: ClassSessionBulkCreate, db: Annotated[Session, Depends(get_db)]):
    service = ClassSessionService(db)
    items = service.create_sessions_bulk(class_id, payload)
    return api_response(True, "Class sessions created successfully", [service.session_detail_dict(item) for item in items], None)


@router.get("/classes/{class_id}/sessions", dependencies=[Depends(require_permission("class_session.read"))])
def list_sessions(
    class_id: str,
    db: Annotated[Session, Depends(get_db)],
    page: int = Query(1),
    page_size: int = Query(10),
    sort_by: str | None = None,
    sort_order: str = Query("asc", pattern="^(asc|desc)$"),
    status: str | None = None,
    mode: str | None = None,
    from_date: date | None = None,
    to_date: date | None = None,
):
    query = PaginationParams(page=page, page_size=page_size, sort_by=sort_by, sort_order=sort_order)
    service = ClassSessionService(db)
    items, total = service.get_sessions_by_class(class_id, query, status, mode, from_date, to_date)
    return api_response(True, "Class sessions retrieved successfully", [service.session_list_dict(item) for item in items], build_pagination(page, page_size, total))


@router.get("/sessions")
def list_all_sessions(
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("class_session.read")),
    page: int = Query(1),
    page_size: int = Query(10),
    sort_by: str | None = None,
    sort_order: str = Query("asc", pattern="^(asc|desc)$"),
    class_id: str | None = None,
    course_id: str | None = None,
    class_ids: list[str] | None = Query(None),
    course_ids: list[str] | None = Query(None),
    teacher_id: str | None = None,
    room_id: str | None = None,
    status: str | None = None,
    mode: str | None = None,
    from_date: date | None = None,
    to_date: date | None = None,
):
    query = PaginationParams(page=page, page_size=page_size, sort_by=sort_by, sort_order=sort_order)
    service = ClassSessionService(db)
    items, total = service.get_sessions(
        query=query,
        class_id=class_id,
        course_id=course_id,
        class_ids=class_ids,
        course_ids=course_ids,
        teacher_id=teacher_id,
        room_id=room_id,
        status=status,
        mode=mode,
        from_date=from_date,
        to_date=to_date,
        current_user=current_user,
    )
    return api_response(
        True,
        "Class sessions retrieved successfully",
        [service.session_detail_dict(item) for item in items],
        build_pagination(page, page_size, total),
    )


@router.get("/sessions/{session_id}")
def get_session(
    session_id: str,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("class_session.read")),
):
    service = ClassSessionService(db)
    item = service.get_session_for_user(session_id, current_user)
    return api_response(True, "Class session retrieved successfully", service.session_detail_dict(item), None)


@router.patch("/sessions/{session_id}", dependencies=[Depends(require_permission("class_session.update"))])
def update_session(session_id: str, payload: ClassSessionUpdate, db: Annotated[Session, Depends(get_db)]):
    service = ClassSessionService(db)
    item = service.update_session(session_id, payload)
    return api_response(True, "Class session updated successfully", service.session_detail_dict(item), None)


@router.delete("/sessions/{session_id}", dependencies=[Depends(require_permission("class_session.delete"))])
def delete_session(session_id: str, db: Annotated[Session, Depends(get_db)]):
    ClassSessionService(db).cancel_session(session_id)
    return api_response(True, "Class session deleted successfully", None, None)


@router.get("/students/me/sessions")
def my_sessions(
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_jwt),
    page: int = Query(1),
    page_size: int = Query(10),
    status: str | None = None,
    from_date: date | None = None,
    to_date: date | None = None,
):
    query = PaginationParams(page=page, page_size=page_size)
    service = ClassSessionService(db)
    items, total = service.get_my_sessions(current_user, query, status, from_date, to_date)
    return api_response(True, "My sessions retrieved successfully", [service.session_detail_dict(item) for item in items], build_pagination(page, page_size, total))
