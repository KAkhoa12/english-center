from datetime import date
from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.response import api_response, build_pagination
from app.db.session import get_db
from app.dependencies.auth import require_jwt
from app.dependencies.permissions import require_permission
from app.models.rbac.user import User
from app.schemas.class_schema import ClassCreate, ClassUpdate
from app.schemas.class_student import AddStudentToClassRequest, UpdateClassStudentRequest
from app.schemas.common import PaginationParams
from app.services.class_service import ClassService
from app.services.class_student_service import ClassStudentService

router = APIRouter(tags=["classes"])


@router.post("/classes", dependencies=[Depends(require_permission("class.create"))])
def create_class(payload: ClassCreate, db: Annotated[Session, Depends(get_db)]):
    service = ClassService(db)
    item = service.create_class(payload)
    return api_response(True, "Class created successfully", service.class_detail_dict(item), None)


@router.get("/classes")
def list_classes(
    db: Annotated[Session, Depends(get_db)],
    page: int = Query(1),
    page_size: int = Query(10),
    search: str | None = None,
    sort_by: str | None = None,
    sort_order: str = Query("desc", pattern="^(asc|desc)$"),
    course_id: str | None = None,
    teacher_id: str | None = None,
    status: str | None = None,
    class_type: str | None = None,
    start_date_from: date | None = None,
    start_date_to: date | None = None,
):
    query = PaginationParams(page=page, page_size=page_size, search=search, sort_by=sort_by, sort_order=sort_order)
    service = ClassService(db)
    items, total = service.get_classes(query, course_id, teacher_id, status, class_type, start_date_from, start_date_to)
    return api_response(True, "Classes retrieved successfully", [service.class_list_dict(item) for item in items], build_pagination(page, page_size, total))


@router.get("/classes/{class_id}")
def get_class(class_id: str, db: Annotated[Session, Depends(get_db)]):
    service = ClassService(db)
    item = service.get_class_by_id(class_id)
    return api_response(True, "Class retrieved successfully", service.class_detail_dict(item), None)


@router.patch("/classes/{class_id}", dependencies=[Depends(require_permission("class.update"))])
def update_class(class_id: str, payload: ClassUpdate, db: Annotated[Session, Depends(get_db)]):
    service = ClassService(db)
    item = service.update_class(class_id, payload)
    return api_response(True, "Class updated successfully", service.class_detail_dict(item), None)


@router.delete("/classes/{class_id}", dependencies=[Depends(require_permission("class.delete"))])
def delete_class(class_id: str, db: Annotated[Session, Depends(get_db)]):
    ClassService(db).soft_delete_class(class_id)
    return api_response(True, "Class deleted successfully", None, None)


@router.get("/public/courses/{course_id}/classes")
def get_public_course_classes(
    course_id: str,
    db: Annotated[Session, Depends(get_db)],
    page: int = Query(1),
    page_size: int = Query(10),
    search: str | None = None,
    sort_by: str | None = None,
    sort_order: str = Query("desc", pattern="^(asc|desc)$"),
    status: str | None = None,
    class_type: str | None = None,
):
    query = PaginationParams(page=page, page_size=page_size, search=search, sort_by=sort_by, sort_order=sort_order)
    service = ClassService(db)
    items, total = service.get_classes_by_course(course_id, query, status, class_type)
    return api_response(True, "Course classes retrieved successfully", [service.class_list_dict(item) for item in items], build_pagination(page, page_size, total))


@router.get("/courses/{course_id}/classes", dependencies=[Depends(require_permission("class.read"))])
def get_course_classes(
    course_id: str,
    db: Annotated[Session, Depends(get_db)],
    page: int = Query(1),
    page_size: int = Query(10),
    search: str | None = None,
    sort_by: str | None = None,
    sort_order: str = Query("desc", pattern="^(asc|desc)$"),
    status: str | None = None,
    class_type: str | None = None,
):
    query = PaginationParams(page=page, page_size=page_size, search=search, sort_by=sort_by, sort_order=sort_order)
    service = ClassService(db)
    items, total = service.get_classes_by_course(course_id, query, status, class_type)
    return api_response(True, "Course classes retrieved successfully", [service.class_list_dict(item) for item in items], build_pagination(page, page_size, total))


@router.post("/classes/{class_id}/students", dependencies=[Depends(require_permission("class_student.create"))])
def add_student_to_class(class_id: str, payload: AddStudentToClassRequest, db: Annotated[Session, Depends(get_db)]):
    service = ClassStudentService(db)
    item = service.add_student_to_class(class_id, payload)
    return api_response(True, "Student added to class successfully", service.student_in_class_dict(item), None)


@router.get("/classes/{class_id}/students", dependencies=[Depends(require_permission("class_student.read"))])
def list_class_students(
    class_id: str,
    db: Annotated[Session, Depends(get_db)],
    page: int = Query(1),
    page_size: int = Query(10),
    search: str | None = None,
    sort_by: str | None = None,
    sort_order: str = Query("asc", pattern="^(asc|desc)$"),
    enrollment_status: str | None = None,
):
    query = PaginationParams(page=page, page_size=page_size, search=search, sort_by=sort_by, sort_order=sort_order)
    service = ClassStudentService(db)
    items, total = service.get_students_by_class(class_id, query, enrollment_status)
    return api_response(
        True,
        "Class students retrieved successfully",
        [service.student_in_class_dict(item, student=student, user=user) for item, student, user in items],
        build_pagination(page, page_size, total),
    )


@router.patch("/classes/{class_id}/students/{student_id}", dependencies=[Depends(require_permission("class_student.update"))])
def update_class_student(
    class_id: str,
    student_id: str,
    payload: UpdateClassStudentRequest,
    db: Annotated[Session, Depends(get_db)],
):
    service = ClassStudentService(db)
    item = service.update_class_student(class_id, student_id, payload)
    return api_response(True, "Class student updated successfully", service.student_in_class_dict(item), None)


@router.delete("/classes/{class_id}/students/{student_id}", dependencies=[Depends(require_permission("class_student.delete"))])
def remove_class_student(class_id: str, student_id: str, db: Annotated[Session, Depends(get_db)]):
    ClassStudentService(db).remove_student_from_class(class_id, student_id)
    return api_response(True, "Student removed from class successfully", None, None)


@router.get("/students/{student_id}/classes", dependencies=[Depends(require_permission("class_student.read"))])
def get_student_classes(
    student_id: str,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_jwt),
    page: int = Query(1),
    page_size: int = Query(10),
):
    query = PaginationParams(page=page, page_size=page_size)
    class_service = ClassService(db)
    items, total = ClassStudentService(db).get_classes_by_student(student_id, query, current_user)
    return api_response(True, "Student classes retrieved successfully", [class_service.class_list_dict(item) for item in items], build_pagination(page, page_size, total))
