from datetime import date
from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.response import api_response, build_pagination
from app.db.session import get_db
from app.dependencies.auth import require_jwt
from app.dependencies.permissions import require_permission
from app.models.user import User
from app.schemas.class_session import ClassSessionCreate, ClassSessionUpdate
from app.schemas.common import PaginationParams
from app.services.class_session_service import ClassSessionService

router = APIRouter(tags=["class-sessions"])


@router.post("/classes/{class_id}/sessions", dependencies=[Depends(require_permission("class_session.create"))])
def create_session(class_id: str, payload: ClassSessionCreate, db: Annotated[Session, Depends(get_db)]):
    service = ClassSessionService(db)
    item = service.create_session(class_id, payload)
    return api_response(True, "Class session created successfully", service.session_detail_dict(item), None)


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


@router.get("/sessions/{session_id}", dependencies=[Depends(require_permission("class_session.read"))])
def get_session(session_id: str, db: Annotated[Session, Depends(get_db)]):
    service = ClassSessionService(db)
    item = service.get_session_by_id(session_id)
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

