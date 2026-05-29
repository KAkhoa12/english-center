from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.models.room import Room
from app.repositories.base import BaseRepository
from app.schemas.common import PaginationParams


class RoomRepository(BaseRepository[Room]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, Room)

    def get_by_name(self, name: str) -> Room | None:
        return self.db.execute(
            select(Room).where(Room.name == name, Room.deleted_at.is_(None))
        ).scalar_one_or_none()

    def get_active_by_id(self, room_id: str) -> Room | None:
        return self.get(room_id)

    def name_exists(self, name: str, exclude_room_id: str | None = None) -> bool:
        stmt = select(Room.id).where(Room.name == name)
        if exclude_room_id is not None:
            stmt = stmt.where(Room.id != exclude_room_id)
        return self.db.execute(stmt).first() is not None

    def list_filtered(self, query: PaginationParams, status=None) -> tuple[list[Room], int]:
        filters = []
        if query.search:
            term = f"%{query.search}%"
            filters.append(or_(Room.name.ilike(term), Room.location.ilike(term)))
        if status:
            filters.append(Room.status == status)

        sort_field = getattr(Room, query.sort_by, Room.created_at) if query.sort_by else Room.created_at
        order_by = sort_field.asc() if query.sort_order == "asc" else sort_field.desc()
        skip = (query.page - 1) * query.page_size
        return self.list(filters=filters, skip=skip, limit=query.page_size, order_by=order_by), self.count(filters=filters)
