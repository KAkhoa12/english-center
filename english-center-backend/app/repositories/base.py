from typing import Any, Generic, List, Sequence, TypeVar
from sqlalchemy import func, select
from sqlalchemy.orm import Session
from sqlalchemy.sql.elements import ColumnElement
from app.utils.time_format import utc_now
ModelType = TypeVar("ModelType")


class BaseRepository(Generic[ModelType]):
    def __init__(self, db: Session, model: type[ModelType]) -> None:
        self.db = db
        self.model = model

    def _has_deleted_at(self) -> bool:
        return hasattr(self.model, "deleted_at")

    def _deleted_at_filter(self, include_deleted: bool = False, only_deleted: bool = False) -> ColumnElement[bool] | None:
        if not self._has_deleted_at() or include_deleted:
            return None
        deleted_at = getattr(self.model, "deleted_at")
        return deleted_at.is_not(None) if only_deleted else deleted_at.is_(None)

    def get(self, obj_id: Any) -> ModelType | None:
        stmt = select(self.model).where(getattr(self.model, "id") == obj_id)
        condition = self._deleted_at_filter()
        if condition is not None:
            stmt = stmt.where(condition)
        return self.db.execute(stmt).scalar_one_or_none()

    def get_deleted(self, obj_id: Any) -> ModelType | None:
        if not self._has_deleted_at():
            return None
        stmt = select(self.model).where(getattr(self.model, "id") == obj_id)
        condition = self._deleted_at_filter(only_deleted=True)
        if condition is not None:
            stmt = stmt.where(condition)
        return self.db.execute(stmt).scalar_one_or_none()

    def get_including_deleted(self, obj_id: Any) -> ModelType | None:
        return self.db.execute(
            select(self.model).where(getattr(self.model, "id") == obj_id)
        ).scalar_one_or_none()

    def list(
        self,
        filters: Sequence[ColumnElement[bool]] | None = None,
        skip: int = 0,
        limit: int = 100,
        order_by: ColumnElement[Any] | None = None,
    ) -> List[ModelType]:
        stmt = select(self.model)
        condition = self._deleted_at_filter()
        if condition is not None:
            stmt = stmt.where(condition)
        if filters:
            stmt = stmt.where(*filters)
        if order_by is not None:
            stmt = stmt.order_by(order_by)
        stmt = stmt.offset(skip).limit(limit)
        return list(self.db.execute(stmt).scalars().all())

    def list_deleted(
        self,
        filters: Sequence[ColumnElement[bool]] | None = None,
        skip: int = 0,
        limit: int = 100,
        order_by: ColumnElement[Any] | None = None,
    ) -> List[ModelType]:
        if not self._has_deleted_at():
            return []
        stmt = select(self.model)
        condition = self._deleted_at_filter(only_deleted=True)
        if condition is not None:
            stmt = stmt.where(condition)
        if filters:
            stmt = stmt.where(*filters)
        if order_by is not None:
            stmt = stmt.order_by(order_by)
        stmt = stmt.offset(skip).limit(limit)
        return list(self.db.execute(stmt).scalars().all())

    def list_including_deleted(
        self,
        filters: Sequence[ColumnElement[bool]] | None = None,
        skip: int = 0,
        limit: int = 100,
        order_by: ColumnElement[Any] | None = None,
    ) -> List[ModelType]:
        stmt = select(self.model)
        if filters:
            stmt = stmt.where(*filters)
        if order_by is not None:
            stmt = stmt.order_by(order_by)
        stmt = stmt.offset(skip).limit(limit)
        return list(self.db.execute(stmt).scalars().all())

    def count(
        self,
        filters: Sequence[ColumnElement[bool]] | None = None,
    ) -> int:
        stmt = select(func.count()).select_from(self.model)
        condition = self._deleted_at_filter()
        if condition is not None:
            stmt = stmt.where(condition)
        if filters:
            stmt = stmt.where(*filters)
        return int(self.db.execute(stmt).scalar_one())

    def create(self, obj: ModelType) -> ModelType:
        self.db.add(obj)
        self.db.flush()
        self.db.refresh(obj)
        return obj

    def update(self, obj: ModelType) -> ModelType:
        self.db.add(obj)
        self.db.flush()
        self.db.refresh(obj)
        return obj

    def hard_delete(self, obj: ModelType) -> None:
        self.db.delete(obj)
        self.db.flush()

    def soft_delete(self, obj: ModelType) -> ModelType:
        if not hasattr(obj, "deleted_at"):
            raise AttributeError(f"{self.model.__name__} does not support soft delete")

        setattr(obj, "deleted_at", utc_now())
        self.db.add(obj)
        self.db.flush()
        self.db.refresh(obj)
        return obj

    def restore(self, obj: ModelType) -> ModelType:
        if not hasattr(obj, "deleted_at"):
            raise AttributeError(f"{self.model.__name__} does not support restore")

        setattr(obj, "deleted_at", None)
        self.db.add(obj)
        self.db.flush()
        self.db.refresh(obj)
        return obj
