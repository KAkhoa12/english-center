from datetime import datetime, timezone
from typing import Any

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.class_session import ClassSchedule, ClassScheduleName
from app.models.class_session import ClassSession
from app.repositories.class_schedule import ClassScheduleRepository
from app.repositories.class_session import ClassSessionRepository
from app.schemas.class_schedule import ClassScheduleCreate, ClassScheduleUpdate
from app.services.class_service import ClassService, _enum, _enum_required


def _now() -> datetime:
    return datetime.now(timezone.utc)


class ClassScheduleService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.schedule_repo = ClassScheduleRepository(db)
        self.session_repo = ClassSessionRepository(db)

    def schedule_dict(self, schedule: ClassSchedule) -> dict[str, Any]:
        return {
            "id": str(schedule.id),
            "class_id": str(schedule.class_id),
            "schedule_name": schedule.schedule_name.value,
            "start_time": schedule.start_time,
            "end_time": schedule.end_time,
            "created_at": schedule.created_at,
            "updated_at": schedule.updated_at,
        }

    def _get_class(self, class_id: str):
        return ClassService(self.db).get_class_by_id(class_id)

    def get_schedule_by_id(self, schedule_id: str) -> ClassSchedule:
        schedule = self.schedule_repo.get_active_by_id(schedule_id)
        if not schedule:
            raise HTTPException(status_code=404, detail="Class schedule not found")
        return schedule

    def get_schedules_by_class(self, class_id: str) -> list[ClassSchedule]:
        self._get_class(class_id)
        return self.schedule_repo.list_by_class_id(class_id)

    def create_schedule(self, class_id: str, payload: ClassScheduleCreate) -> ClassSchedule:
        class_obj = self._get_class(class_id)
        schedule_name = _enum_required(ClassScheduleName, payload.schedule_name, "schedule name")
        if self.schedule_repo.exists_duplicate(str(class_obj.id), schedule_name, payload.start_time, payload.end_time):
            raise HTTPException(status_code=400, detail="Class schedule already exists")
        schedule = ClassSchedule(
            class_id=str(class_obj.id),
            schedule_name=schedule_name,
            start_time=payload.start_time,
            end_time=payload.end_time,
        )
        created = self.schedule_repo.create(schedule)
        self.db.commit()
        return created

    def update_schedule(self, schedule_id: str, payload: ClassScheduleUpdate) -> ClassSchedule:
        schedule = self.get_schedule_by_id(schedule_id)
        fields_set = payload.model_fields_set
        schedule_name = (
            _enum(ClassScheduleName, payload.schedule_name, "schedule name")
            if "schedule_name" in fields_set and payload.schedule_name is not None
            else schedule.schedule_name
        )
        start_time = payload.start_time if "start_time" in fields_set and payload.start_time is not None else schedule.start_time
        end_time = payload.end_time if "end_time" in fields_set and payload.end_time is not None else schedule.end_time
        if end_time <= start_time:
            raise HTTPException(status_code=400, detail="end_time must be greater than start_time")
        if self.schedule_repo.exists_duplicate(str(schedule.class_id), schedule_name, start_time, end_time, exclude_id=schedule_id):
            raise HTTPException(status_code=400, detail="Class schedule already exists")
        schedule.schedule_name = schedule_name
        schedule.start_time = start_time
        schedule.end_time = end_time
        updated = self.schedule_repo.update(schedule)
        self.db.commit()
        return updated

    def soft_delete_schedule(self, schedule_id: str) -> None:
        schedule = self.get_schedule_by_id(schedule_id)
        in_use = self.session_repo.count(filters=[ClassSession.class_schedule_id == schedule.id]) > 0
        if in_use:
            raise HTTPException(status_code=400, detail="Class schedule is used by sessions")
        schedule.deleted_at = _now()
        self.db.commit()
