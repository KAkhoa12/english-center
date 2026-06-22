from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.class_session import ClassSchedule, ClassScheduleName
from app.repositories.base import BaseRepository


class ClassScheduleRepository(BaseRepository[ClassSchedule]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, ClassSchedule)

    def get_active_by_id(self, schedule_id: str) -> ClassSchedule | None:
        return self.get(schedule_id)

    def list_by_class_id(self, class_id: str) -> list[ClassSchedule]:
        return list(
            self.db.execute(
                select(ClassSchedule)
                .where(ClassSchedule.class_id == class_id, ClassSchedule.deleted_at.is_(None))
                .order_by(ClassSchedule.schedule_name.asc(), ClassSchedule.start_time.asc())
            ).scalars().all()
        )

    def exists_duplicate(
        self,
        class_id: str,
        schedule_name: ClassScheduleName,
        start_time,
        end_time,
        exclude_id: str | None = None,
    ) -> bool:
        stmt = select(ClassSchedule.id).where(
            ClassSchedule.class_id == class_id,
            ClassSchedule.schedule_name == schedule_name,
            ClassSchedule.start_time == start_time,
            ClassSchedule.end_time == end_time,
            ClassSchedule.deleted_at.is_(None),
        )
        if exclude_id:
            stmt = stmt.where(ClassSchedule.id != exclude_id)
        return self.db.execute(stmt).first() is not None
