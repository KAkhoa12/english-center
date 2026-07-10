from datetime import date, datetime, timezone
from typing import Any

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.class_model import ClassStatus, ClassType, CourseClass
from app.models.course import Course, CourseMode, CourseStatus
from app.models.student import Student
from app.models.teacher import Teacher
from app.models.rbac.user import User
from app.repositories.class_session import ClassSessionRepository
from app.repositories.class_schedule import ClassScheduleRepository
from app.repositories.class_student import ClassStudentRepository
from app.repositories.course import CourseRepository
from app.repositories.course_class import CourseClassRepository
from app.repositories.room import RoomRepository
from app.repositories.student import StudentRepository
from app.repositories.teacher import TeacherRepository
from app.repositories.user import UserRepository
from app.schemas.class_schema import ClassCreate, ClassUpdate
from app.schemas.common import PaginationParams
from app.services.rbac_service import RBACService
from app.utils.code import generate_code


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _enum(enum_cls, value: str | None, field_name: str):
    if value is None:
        return None
    try:
        return enum_cls(value)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=f"Invalid {field_name}") from exc


def _enum_required(enum_cls, value: str | None, field_name: str):
    result = _enum(enum_cls, value, field_name)
    if result is None:
        raise HTTPException(status_code=400, detail=f"{field_name} is required")
    return result


class AcademicAccessMixin:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.rbac_service = RBACService(db)
        self.teacher_repo = TeacherRepository(db)
        self.student_repo = StudentRepository(db)

    def has_any_permission(self, user: User, *permission_codes: str) -> bool:
        return any(self.rbac_service.has_permission(str(user.id), code) for code in permission_codes)

    def get_teacher_profile_by_user(self, user_id: str) -> Teacher | None:
        return self.teacher_repo.get_by_user_id(user_id)

    def get_student_profile_by_user(self, user_id: str) -> Student | None:
        return self.student_repo.get_by_user_id(user_id)

    def assert_student_self_or_privileged(self, student_id: str, user: User, *permission_codes: str) -> None:
        if self.has_any_permission(user, "admin.all", *permission_codes):
            return
        student = self.student_repo.get_active_by_id(student_id)
        if student and str(student.user_id) == str(user.id):
            return
        raise HTTPException(status_code=403, detail="Permission denied")

    def assert_teacher_owns_class(self, class_obj: CourseClass, user: User, *permission_codes: str) -> None:
        if self.has_any_permission(user, "admin.all", *permission_codes):
            return
        teacher = self.get_teacher_profile_by_user(str(user.id))
        if teacher and class_obj.teacher_id and str(class_obj.teacher_id) == str(teacher.id):
            return
        raise HTTPException(status_code=403, detail="Permission denied")


class ClassService(AcademicAccessMixin):
    def __init__(self, db: Session) -> None:
        super().__init__(db)
        self.class_repo = CourseClassRepository(db)
        self.class_student_repo = ClassStudentRepository(db)
        self.class_session_repo = ClassSessionRepository(db)
        self.class_schedule_repo = ClassScheduleRepository(db)
        self.course_repo = CourseRepository(db)
        self.user_repo = UserRepository(db)

    def _get_course_for_class(self, course_id: str) -> Course:
        course = self.course_repo.get_active_by_id(course_id)
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        if course.status != CourseStatus.active:
            raise HTTPException(status_code=400, detail="Course is not active")
        return course

    def _get_teacher(self, teacher_id: str | None) -> Teacher | None:
        if not teacher_id:
            return None
        teacher = self.teacher_repo.get_active_by_id(teacher_id)
        if not teacher:
            raise HTTPException(status_code=404, detail="Teacher not found")
        return teacher

    def _basic_course_dict(self, course: Course) -> dict[str, Any]:
        return {"id": str(course.id), "name": course.name, "code": course.code}

    def _basic_teacher_dict(self, teacher: Teacher | None) -> dict[str, Any] | None:
        if not teacher:
            return None
        user = self.user_repo.get(str(teacher.user_id))
        if not user:
            return None
        return {
            "id": str(teacher.id),
            "full_name": user.full_name,
            "avatar_url": getattr(user, "avatar_url", None),
            "specialization": teacher.specialization,
            "experience_years": teacher.experience_years,
        }

    def count_students(self, class_id: str) -> int:
        return self.class_student_repo.count_active_students(class_id)

    def count_sessions(self, class_id: str) -> int:
        return self.class_session_repo.count_by_class_id(class_id)

    def _generate_code(self, course: Course, start_date: date | None) -> str:
        course_part = generate_code(course.code or course.name).split("_")[0][:10]
        stamp = (start_date or _now().date()).strftime("%Y%m")
        count = self.class_repo.count_by_code_prefix(f"CLS-{course_part}-{stamp}-")
        return f"CLS-{course_part}-{stamp}-{int(count) + 1:03d}"

    def class_list_dict(self, class_obj: CourseClass) -> dict[str, Any]:
        course = self._get_course_for_class(str(class_obj.course_id))
        teacher = self._get_teacher(str(class_obj.teacher_id)) if class_obj.teacher_id else None
        return {
            "id": str(class_obj.id),
            "course_id": str(class_obj.course_id),
            "teacher_id": str(class_obj.teacher_id) if class_obj.teacher_id else None,
            "name": class_obj.name,
            "code": class_obj.code,
            "class_type": class_obj.class_type.value,
            "max_students": class_obj.max_students,
            "current_students_count": self.count_students(str(class_obj.id)),
            "start_date": class_obj.start_date,
            "status": class_obj.status.value,
            "course": self._basic_course_dict(course),
            "teacher": self._basic_teacher_dict(teacher),
            "created_at": class_obj.created_at,
            "updated_at": class_obj.updated_at,
            "schedules": [
                {
                    "id": str(schedule.id),
                    "class_id": str(schedule.class_id),
                    "schedule_name": schedule.schedule_name.value,
                    "start_time": schedule.start_time,
                    "end_time": schedule.end_time,
                }
                for schedule in self.class_schedule_repo.list_by_class_id(str(class_obj.id))
            ],
        }

    def class_detail_dict(self, class_obj: CourseClass) -> dict[str, Any]:
        data = self.class_list_dict(class_obj)
        data["students_count"] = self.count_students(str(class_obj.id))
        data["sessions_count"] = self.count_sessions(str(class_obj.id))
        return data

    def create_class(self, payload: ClassCreate) -> CourseClass:
        course = self._get_course_for_class(payload.course_id)
        if course.mode != CourseMode.center:
            raise HTTPException(status_code=400, detail="Cannot create class for template course")
        teacher = self._get_teacher(payload.teacher_id)
        code = generate_code(payload.code) if payload.code else self._generate_code(course, payload.start_date)
        if self.class_repo.exists_by_code(code):
            raise HTTPException(status_code=400, detail="Class code already exists")
        class_type = _enum_required(ClassType, payload.class_type, "class type")
        status = _enum_required(ClassStatus, payload.status, "class status")
        class_obj = CourseClass(
            course_id=str(course.id),
            teacher_id=str(teacher.id) if teacher else None,
            name=payload.name.strip(),
            code=code,
            class_type=class_type,
            max_students=payload.max_students,
            start_date=payload.start_date,
            status=status,
        )
        created = self.class_repo.create(class_obj)
        self.db.commit()
        return created

    def get_class_by_id(self, class_id: str) -> CourseClass:
        class_obj = self.class_repo.get_active_by_id(class_id)
        if not class_obj:
            raise HTTPException(status_code=404, detail="Class not found")
        return class_obj

    def get_classes(
        self,
        query: PaginationParams,
        course_id: str | None = None,
        teacher_id: str | None = None,
        status: str | None = None,
        class_type: str | None = None,
        start_date_from: date | None = None,
        start_date_to: date | None = None,
    ) -> tuple[list[CourseClass], int]:
        return self.class_repo.list_filtered(
            query=query,
            course_id=course_id,
            teacher_id=teacher_id,
            status=_enum(ClassStatus, status, "class status") if status else None,
            class_type=_enum(ClassType, class_type, "class type") if class_type else None,
            start_date_from=start_date_from,
            start_date_to=start_date_to,
        )

    def get_classes_by_course(
        self,
        course_id: str,
        query: PaginationParams,
        status: str | None = None,
        class_type: str | None = None,
    ) -> tuple[list[CourseClass], int]:
        self._get_course_for_class(course_id)
        return self.get_classes(query, course_id=course_id, status=status, class_type=class_type)

    def update_class(self, class_id: str, payload: ClassUpdate) -> CourseClass:
        class_obj = self.get_class_by_id(class_id)
        teacher = self._get_teacher(payload.teacher_id) if payload.teacher_id is not None else None
        if payload.code is not None:
            code = generate_code(payload.code) if payload.code else None
            if code and code != class_obj.code:
                if self.class_repo.exists_by_code(code, exclude_id=str(class_obj.id)):
                    raise HTTPException(status_code=400, detail="Class code already exists")
            class_obj.code = code
        if payload.name is not None:
            class_obj.name = payload.name.strip()
        if payload.teacher_id is not None:
            class_obj.teacher_id = str(teacher.id) if teacher else None
        for field in ["max_students", "start_date"]:
            value = getattr(payload, field)
            if value is not None:
                setattr(class_obj, field, value)
        if payload.class_type is not None:
            class_type = _enum_required(ClassType, payload.class_type, "class type")
            class_obj.class_type = class_type
        if payload.status is not None:
            status = _enum_required(ClassStatus, payload.status, "class status")
            class_obj.status = status
        if class_obj.max_students < self.count_students(str(class_obj.id)):
            raise HTTPException(status_code=400, detail="max_students cannot be less than current students count")
        updated = self.class_repo.update(class_obj)
        self.db.commit()
        return updated

    def soft_delete_class(self, class_id: str) -> None:
        class_obj = self.get_class_by_id(class_id)
        class_obj.status = ClassStatus.archived
        self.class_repo.soft_delete(class_obj)
        self.db.commit()
