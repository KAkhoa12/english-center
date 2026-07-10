from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.models.course import Media
from app.repositories.base import BaseRepository
from app.schemas.common import PaginationParams


class MediaRepository(BaseRepository[Media]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, Media)

    def get_active_by_id(self, media_id: str) -> Media | None:
        return self.db.execute(
            select(Media).where(Media.id == media_id, Media.deleted_at.is_(None))
        ).scalar_one_or_none()

    def get_active_by_object_name(self, object_name: str) -> Media | None:
        return self.db.execute(
            select(Media).where(Media.object_name == object_name, Media.deleted_at.is_(None))
        ).scalar_one_or_none()

    def list_active(self, bucket: str | None = None, folder: str | None = None) -> list[Media]:
        stmt = select(Media).where(Media.deleted_at.is_(None))
        if bucket:
            stmt = stmt.where(Media.bucket == bucket)
        if folder is not None:
            stmt = stmt.where(Media.folder == folder)
        return list(self.db.execute(stmt.order_by(Media.created_at.desc())).scalars().all())

    def list_filtered(
        self,
        query: PaginationParams,
        bucket: str | None = None,
        folder: str | None = None,
    ) -> tuple[list[Media], int]:
        filters = [Media.deleted_at.is_(None)]
        if bucket:
            filters.append(Media.bucket == bucket)
        if folder is not None:
            filters.append(Media.folder == folder)
        if query.search:
            term = f"%{query.search}%"
            filters.append(
                or_(
                    Media.object_name.ilike(term),
                    Media.original_filename.ilike(term),
                    Media.folder.ilike(term),
                )
            )

        sort_field_name = query.sort_by if query.sort_by and hasattr(Media, query.sort_by) else "created_at"
        sort_field = getattr(Media, sort_field_name)
        order_by = sort_field.asc() if query.sort_order == "asc" else sort_field.desc()
        total = int(self.db.execute(select(func.count()).select_from(Media).where(*filters)).scalar_one())
        skip = (query.page - 1) * query.page_size
        items = list(self.db.execute(select(Media).where(*filters).order_by(order_by).offset(skip).limit(query.page_size)).scalars().all())
        return items, total
