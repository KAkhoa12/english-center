from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.response import api_response
from app.db.session import get_db
from app.dependencies.permissions import require_permission
from app.schemas.class_schedule import ClassScheduleCreate, ClassScheduleUpdate
from app.services.class_schedule_service import ClassScheduleService

router = APIRouter(tags=["class-schedules"])


@router.get("/classes/{class_id}/schedules", dependencies=[Depends(require_permission("class.read"))])
def list_class_schedules(class_id: str, db: Annotated[Session, Depends(get_db)]):
    service = ClassScheduleService(db)
    items = service.get_schedules_by_class(class_id)
    return api_response(True, "Class schedules retrieved successfully", [service.schedule_dict(item) for item in items], None)


@router.post("/classes/{class_id}/schedules", dependencies=[Depends(require_permission("class.update"))])
def create_class_schedule(class_id: str, payload: ClassScheduleCreate, db: Annotated[Session, Depends(get_db)]):
    service = ClassScheduleService(db)
    item = service.create_schedule(class_id, payload)
    return api_response(True, "Class schedule created successfully", service.schedule_dict(item), None)


@router.patch("/classes/schedules/{schedule_id}", dependencies=[Depends(require_permission("class.update"))])
def update_class_schedule(schedule_id: str, payload: ClassScheduleUpdate, db: Annotated[Session, Depends(get_db)]):
    service = ClassScheduleService(db)
    item = service.update_schedule(schedule_id, payload)
    return api_response(True, "Class schedule updated successfully", service.schedule_dict(item), None)


@router.delete("/classes/schedules/{schedule_id}", dependencies=[Depends(require_permission("class.update"))])
def delete_class_schedule(schedule_id: str, db: Annotated[Session, Depends(get_db)]):
    ClassScheduleService(db).soft_delete_schedule(schedule_id)
    return api_response(True, "Class schedule deleted successfully", None, None)
