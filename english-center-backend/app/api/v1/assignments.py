from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.response import api_response, build_pagination
from app.db.session import get_db
from app.dependencies.permissions import require_permission
from app.models.rbac.user import User
from app.schemas.assignment import AssignmentCreate, AssignmentUpdate
from app.schemas.common import PaginationParams
from app.services.assignment_service import AssignmentService

router = APIRouter(tags=["assignments"])


@router.post("/classes/{class_id}/assignments")
def create_assignment(
    class_id: str,
    payload: AssignmentCreate,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("assignment.create")),
):
    service = AssignmentService(db)
    item = service.create_assignment(class_id, payload, current_user)
    return api_response(True, "Assignment created successfully", service.assignment_dict(item, current_user, detail=True), None)


@router.post("/lessons/{lesson_id}/assignments")
def create_lesson_assignment(
    lesson_id: str,
    payload: AssignmentCreate,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("assignment.create")),
):
    service = AssignmentService(db)
    item = service.create_lesson_assignment(lesson_id, payload, current_user)
    return api_response(True, "Lesson assignment created successfully", service.assignment_dict(item, current_user, detail=True), None)


@router.get("/classes/{class_id}/assignments")
def list_class_assignments(
    class_id: str,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("assignment.read")),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    search: str | None = None,
    sort_by: str | None = None,
    sort_order: str = Query("desc", pattern="^(asc|desc)$"),
    status: str | None = None,
    assignment_type_id: str | None = None,
    session_id: str | None = None,
    lesson_id: str | None = None,
    due_from: datetime | None = None,
    due_to: datetime | None = None,
):
    query = PaginationParams(page=page, page_size=page_size, search=search, sort_by=sort_by, sort_order=sort_order)
    service = AssignmentService(db)
    items, total = service.get_assignments_by_class(class_id, query, current_user, status, assignment_type_id, session_id, lesson_id, due_from, due_to)
    return api_response(True, "Assignments retrieved successfully", [service.assignment_dict(item, current_user) for item in items], build_pagination(page, page_size, total))


@router.get("/lessons/{lesson_id}/assignments")
def list_lesson_assignments(
    lesson_id: str,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("assignment.read")),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    search: str | None = None,
    sort_by: str | None = None,
    sort_order: str = Query("desc", pattern="^(asc|desc)$"),
    status: str | None = None,
    assignment_type_id: str | None = None,
):
    query = PaginationParams(page=page, page_size=page_size, search=search, sort_by=sort_by, sort_order=sort_order)
    service = AssignmentService(db)
    items, total = service.get_assignments_by_lesson(lesson_id, query, current_user, status, assignment_type_id)
    return api_response(True, "Lesson assignments retrieved successfully", [service.assignment_dict(item, current_user) for item in items], build_pagination(page, page_size, total))


@router.get("/assignments/{assignment_id}")
def get_assignment(
    assignment_id: str,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("assignment.read")),
):
    service = AssignmentService(db)
    item = service.get_assignment_by_id(assignment_id)
    service.assert_can_read_assignment(item, current_user)
    return api_response(True, "Assignment retrieved successfully", service.assignment_dict(item, current_user, detail=True), None)


@router.patch("/assignments/{assignment_id}")
def update_assignment(
    assignment_id: str,
    payload: AssignmentUpdate,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("assignment.update")),
):
    service = AssignmentService(db)
    item = service.update_assignment(assignment_id, payload, current_user)
    return api_response(True, "Assignment updated successfully", service.assignment_dict(item, current_user, detail=True), None)


@router.delete("/assignments/{assignment_id}")
def delete_assignment(
    assignment_id: str,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("assignment.delete")),
):
    AssignmentService(db).soft_delete_assignment(assignment_id, current_user)
    return api_response(True, "Assignment deleted successfully", None, None)


@router.patch("/assignments/{assignment_id}/publish")
def publish_assignment(
    assignment_id: str,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("assignment.update")),
):
    service = AssignmentService(db)
    item = service.publish_assignment(assignment_id, current_user)
    return api_response(True, "Assignment published successfully", service.assignment_dict(item, current_user, detail=True), None)


@router.patch("/assignments/{assignment_id}/close")
def close_assignment(
    assignment_id: str,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("assignment.update")),
):
    service = AssignmentService(db)
    item = service.close_assignment(assignment_id, current_user)
    return api_response(True, "Assignment closed successfully", service.assignment_dict(item, current_user, detail=True), None)


@router.get("/students/me/assignments")
def my_assignments(
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("assignment.read")),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    search: str | None = None,
    status: str | None = None,
    assignment_type_id: str | None = None,
    class_id: str | None = None,
    submitted_status: str | None = None,
):
    query = PaginationParams(page=page, page_size=page_size, search=search)
    service = AssignmentService(db)
    items, total = service.get_my_assignments(current_user, query, status, assignment_type_id, class_id, submitted_status)
    return api_response(True, "My assignments retrieved successfully", [service.assignment_dict(item, current_user) for item in items], build_pagination(page, page_size, total))
