from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.room import Room, RoomStatus
from app.repositories.room import RoomRepository
from app.schemas.common import PaginationParams
from app.schemas.room import RoomCreate, RoomUpdate


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
        self.room_repo = RoomRepository(db)

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
        try:
            if self.room_repo.name_exists(payload.name.strip()):
                raise HTTPException(status_code=400, detail="Room name already exists")
            room = Room(
                name=payload.name.strip(),
                capacity=payload.capacity,
                location=payload.location,
                status=_enum(RoomStatus, payload.status, "room status"),
            )
            created = self.room_repo.create(room)
            self.db.commit()
            return created
        except Exception:
            self.db.rollback()
            raise

    def get_rooms(self, query: PaginationParams, status: str | None = None) -> tuple[list[Room], int]:
        return self.room_repo.list_filtered(
            query=query,
            status=_enum(RoomStatus, status, "room status") if status else None,
        )

    def get_room_by_id(self, room_id: str) -> Room:
        room = self.room_repo.get_active_by_id(room_id)
        if not room:
            raise HTTPException(status_code=404, detail="Room not found")
        return room

    def get_active_room(self, room_id: str) -> Room:
        room = self.get_room_by_id(room_id)
        if room.status != RoomStatus.active:
            raise HTTPException(status_code=400, detail="Room is not available")
        return room

    def update_room(self, room_id: str, payload: RoomUpdate) -> Room:
        try:
            room = self.get_room_by_id(room_id)
            if payload.name is not None and payload.name.strip() != room.name:
                if self.room_repo.name_exists(payload.name.strip(), exclude_room_id=str(room.id)):
                    raise HTTPException(status_code=400, detail="Room name already exists")
                room.name = payload.name.strip()
            for field in ["capacity", "location"]:
                value = getattr(payload, field)
                if value is not None:
                    setattr(room, field, value)
            if payload.status is not None:
                room.status = _enum(RoomStatus, payload.status, "room status")
            updated = self.room_repo.update(room)
            self.db.commit()
            return updated
        except Exception:
            self.db.rollback()
            raise

    def soft_delete_room(self, room_id: str) -> None:
        try:
            room = self.get_room_by_id(room_id)
            self.room_repo.soft_delete(room)
            self.db.commit()
        except Exception:
            self.db.rollback()
            raise
