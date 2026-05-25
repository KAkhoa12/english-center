from datetime import datetime, timezone

from fastapi import HTTPException
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.models.room import Room, RoomStatus
from app.schemas.common import PaginationParams
from app.schemas.room import RoomCreate, RoomUpdate


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _enum(enum_cls, value: str | None, field_name: str):
    if value is None:
        return None
    try:
        return enum_cls(value)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=f"Invalid {field_name}") from exc


class RoomService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def room_dict(self, room: Room) -> dict:
        return {
            "id": str(room.id),
            "name": room.name,
            "capacity": room.capacity,
            "location": room.location,
            "status": room.status.value,
            "created_at": room.created_at,
            "updated_at": room.updated_at,
        }

    def create_room(self, payload: RoomCreate) -> Room:
        exists = self.db.execute(select(Room).where(Room.name == payload.name.strip(), Room.deleted_at.is_(None))).scalar_one_or_none()
        if exists:
            raise HTTPException(status_code=400, detail="Room name already exists")
        room = Room(
            name=payload.name.strip(),
            capacity=payload.capacity,
            location=payload.location,
            status=_enum(RoomStatus, payload.status, "room status"),
        )
        self.db.add(room)
        self.db.commit()
        self.db.refresh(room)
        return room

    def get_rooms(self, query: PaginationParams, status: str | None = None) -> tuple[list[Room], int]:
        stmt = select(Room).where(Room.deleted_at.is_(None))
        if query.search:
            term = f"%{query.search}%"
            stmt = stmt.where(or_(Room.name.ilike(term), Room.location.ilike(term)))
        if status:
            stmt = stmt.where(Room.status == _enum(RoomStatus, status, "room status"))
        total = self.db.execute(select(func.count()).select_from(stmt.subquery())).scalar_one()
        sort_field = getattr(Room, query.sort_by, Room.created_at) if query.sort_by else Room.created_at
        stmt = stmt.order_by(sort_field.asc() if query.sort_order == "asc" else sort_field.desc())
        stmt = stmt.offset((query.page - 1) * query.page_size).limit(query.page_size)
        return list(self.db.execute(stmt).scalars().all()), int(total)

    def get_room_by_id(self, room_id: str) -> Room:
        room = self.db.execute(select(Room).where(Room.id == room_id, Room.deleted_at.is_(None))).scalar_one_or_none()
        if not room:
            raise HTTPException(status_code=404, detail="Room not found")
        return room

    def get_active_room(self, room_id: str) -> Room:
        room = self.get_room_by_id(room_id)
        if room.status != RoomStatus.active:
            raise HTTPException(status_code=400, detail="Room is not available")
        return room

    def update_room(self, room_id: str, payload: RoomUpdate) -> Room:
        room = self.get_room_by_id(room_id)
        if payload.name is not None and payload.name.strip() != room.name:
            exists = self.db.execute(
                select(Room).where(Room.name == payload.name.strip(), Room.deleted_at.is_(None), Room.id != room.id)
            ).scalar_one_or_none()
            if exists:
                raise HTTPException(status_code=400, detail="Room name already exists")
            room.name = payload.name.strip()
        for field in ["capacity", "location"]:
            value = getattr(payload, field)
            if value is not None:
                setattr(room, field, value)
        if payload.status is not None:
            room.status = _enum(RoomStatus, payload.status, "room status")
        self.db.commit()
        self.db.refresh(room)
        return room

    def soft_delete_room(self, room_id: str) -> None:
        room = self.get_room_by_id(room_id)
        room.deleted_at = _now()
        self.db.commit()
