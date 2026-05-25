from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.response import api_response, build_pagination
from app.db.session import get_db
from app.dependencies.permissions import require_permission
from app.schemas.common import PaginationParams
from app.schemas.room import RoomCreate, RoomUpdate
from app.services.room_service import RoomService

router = APIRouter(prefix="/rooms", tags=["rooms"])


@router.post("", dependencies=[Depends(require_permission("room.create"))])
def create_room(payload: RoomCreate, db: Annotated[Session, Depends(get_db)]):
    room = RoomService(db).create_room(payload)
    return api_response(True, "Room created successfully", RoomService(db).room_dict(room), None)


@router.get("", dependencies=[Depends(require_permission("room.read"))])
def list_rooms(
    db: Annotated[Session, Depends(get_db)],
    page: int = Query(1),
    page_size: int = Query(10),
    search: str | None = None,
    sort_by: str | None = None,
    sort_order: str = Query("desc", pattern="^(asc|desc)$"),
    status: str | None = None,
):
    query = PaginationParams(page=page, page_size=page_size, search=search, sort_by=sort_by, sort_order=sort_order)
    items, total = RoomService(db).get_rooms(query, status)
    service = RoomService(db)
    return api_response(True, "Rooms retrieved successfully", [service.room_dict(item) for item in items], build_pagination(page, page_size, total))


@router.get("/{room_id}", dependencies=[Depends(require_permission("room.read"))])
def get_room(room_id: str, db: Annotated[Session, Depends(get_db)]):
    service = RoomService(db)
    room = service.get_room_by_id(room_id)
    return api_response(True, "Room retrieved successfully", service.room_dict(room), None)


@router.patch("/{room_id}", dependencies=[Depends(require_permission("room.update"))])
def update_room(room_id: str, payload: RoomUpdate, db: Annotated[Session, Depends(get_db)]):
    service = RoomService(db)
    room = service.update_room(room_id, payload)
    return api_response(True, "Room updated successfully", service.room_dict(room), None)


@router.delete("/{room_id}", dependencies=[Depends(require_permission("room.delete"))])
def delete_room(room_id: str, db: Annotated[Session, Depends(get_db)]):
    RoomService(db).soft_delete_room(room_id)
    return api_response(True, "Room deleted successfully", None, None)

