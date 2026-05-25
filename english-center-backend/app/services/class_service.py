from datetime import date, datetime, timezone
from typing import Any

from fastapi import HTTPException
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.models.class_model import ClassStatus, ClassType, CourseClass
from app.models.class_session import ClassSession
from app.models.class_student import ClassEnrollmentStatus, ClassStudent
from app.models.course import Course, CourseStatus
from app.models.student import Student
from app.models.teacher import Teacher
from app.models.user import User
from app.schemas.class_schema import ClassCreate, ClassUpdate
from app.schemas.common import PaginationParams
from app.services.course_service import CourseService
from app.services.rbac_service import RBACService
from app.utils.serializers import user_to_dict


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _enum(enum_cls, value: str | None, field_name: str):
    if value is None:
        return None
    try:
        return enum_cls(value)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=f"Invalid {field_name}") from exc


class AcademicAccessMixin:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.rbac_service = RBACService(db)

    def has_any_permission(self, user: User, *permission_codes: str) -> bool:
        return any(self.rbac_service.has_permission(str(user.id), code) for code in permission_codes)

    def get_teacher_profile_by_user(self, user_id: str) -> Teacher | None:
        return self.db.execute(select(Teacher).where(Teacher.user_id == user_id, Teacher.deleted_at.is_(None))).scalar_one_or_none()

    def get_student_profile_by_user(self, user_id: str) -> Student | None:
        return self.db.execute(select(Student).where(Student.user_id == user_id, Student.deleted_at.is_(None))).scalar_one_or_none()

    def assert_student_self_or_privileged(self, student_id: str, user: User, *permission_codes: str) -> None:
        if self.has_any_permission(user, "admin.all", *permission_codes):
            return
        student = self.db.execute(select(Student).where(Student.id == student_id, Student.deleted_at.is_(None))).scalar_one_or_none()
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
    def _get_course_for_class(self, course_id: str) -> Course:
        course = CourseService(self.db).get_course_by_id(course_id)
        if course.status != CourseStatus.active:
            raise HTTPException(status_code=400, detail="Course is not active")
        return course

    def _get_teacher(self, teacher_id: str | None) -> Teacher | None:
        if not teacher_id:
            return None
        teacher = self.db.execute(select(Teacher).where(Teacher.id == teacher_id, Teacher.deleted_at.is_(None))).scalar_one_or_none()
        if not teacher:
            raise HTTPException(status_code=404, detail="Teacher not found")
        return teacher

    def _basic_course_dict(self, course: Course) -> dict[str, Any]:
        return {"id": str(course.id), "name": course.name, "code": course.code}

    def _basic_teacher_dict(self, teacher: Teacher | None) -> dict[str, Any] | None:
        if not teacher:
            return None
        user = self.db.execute(select(User).where(User.id == teacher.user_id, User.deleted_at.is_(None))).scalar_one_or_none()
        if not user:
            return None
        data = user_to_dict(user, include_meta=False)
        data["id"] = str(teacher.id)
        return data

    def count_students(self, class_id: str) -> int:
        return int(
            self.db.execute(
                select(func.count())
                .select_from(ClassStudent)
                .where(
                    ClassStudent.class_id == class_id,
                    ClassStudent.deleted_at.is_(None),
                    ClassStudent.enrollment_status.notin_([ClassEnrollmentStatus.cancelled, ClassEnrollmentStatus.dropped]),
                )
            ).scalar_one()
        )

    def count_sessions(self, class_id: str) -> int:
        return int(
            self.db.execute(
                select(func.count()).select_from(ClassSession).where(ClassSession.class_id == class_id, ClassSession.deleted_at.is_(None))
            ).scalar_one()
        )

    def _generate_code(self, course: Course, start_date: date | None) -> str:
        course_part = (course.code or course.name).split("_")[0].upper()[:10]
        stamp = (start_date or _now().date()).strftime("%Y%m")
        count = self.db.execute(
            select(func.count()).select_from(CourseClass).where(CourseClass.deleted_at.is_(None), CourseClass.code.ilike(f"CLS-{course_part}-{stamp}-%"))
        ).scalar_one()
        return f"CLS-{course_part}-{stamp}-{int(count) + 1:03d}"

    def class_list_dict(self, class_obj: CourseClass) -> dict[str, Any]:
        course = CourseService(self.db).get_course_by_id(str(class_obj.course_id))
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
            "end_date": class_obj.end_date,
            "status": class_obj.status.value,
            "course": self._basic_course_dict(course),
            "teacher": self._basic_teacher_dict(teacher),
            "created_at": class_obj.created_at,
            "updated_at": class_obj.updated_at,
        }

    def class_detail_dict(self, class_obj: CourseClass) -> dict[str, Any]:
        data = self.class_list_dict(class_obj)
        data["students_count"] = self.count_students(str(class_obj.id))
        data["sessions_count"] = self.count_sessions(str(class_obj.id))
        return data

    def create_class(self, payload: ClassCreate) -> CourseClass:
        course = self._get_course_for_class(payload.course_id)
        teacher = self._get_teacher(payload.teacher_id)
        code = payload.code.strip() if payload.code else self._generate_code(course, payload.start_date)
        exists = self.db.execute(select(CourseClass).where(CourseClass.code == code, CourseClass.deleted_at.is_(None))).scalar_one_or_none()
        if exists:
            raise HTTPException(status_code=400, detail="Class code already exists")
        class_obj = CourseClass(
            course_id=course.id,
            teacher_id=teacher.id if teacher else None,
            name=payload.name.strip(),
            code=code,
            class_type=_enum(ClassType, payload.class_type, "class type"),
            max_students=payload.max_students,
            start_date=payload.start_date,
            end_date=payload.end_date,
            status=_enum(ClassStatus, payload.status, "class status"),
        )
        self.db.add(class_obj)
        self.db.commit()
        self.db.refresh(class_obj)
        return class_obj

    def get_class_by_id(self, class_id: str) -> CourseClass:
        class_obj = self.db.execute(select(CourseClass).where(CourseClass.id == class_id, CourseClass.deleted_at.is_(None))).scalar_one_or_none()
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
        stmt = select(CourseClass).where(CourseClass.deleted_at.is_(None))
        if course_id:
            stmt = stmt.where(CourseClass.course_id == course_id)
        if teacher_id:
            stmt = stmt.where(CourseClass.teacher_id == teacher_id)
        if status:
            stmt = stmt.where(CourseClass.status == _enum(ClassStatus, status, "class status"))
        if class_type:
            stmt = stmt.where(CourseClass.class_type == _enum(ClassType, class_type, "class type"))
        if start_date_from:
            stmt = stmt.where(CourseClass.start_date >= start_date_from)
        if start_date_to:
            stmt = stmt.where(CourseClass.start_date <= start_date_to)
        if query.search:
            term = f"%{query.search}%"
            stmt = stmt.where(or_(CourseClass.name.ilike(term), CourseClass.code.ilike(term)))
        total = self.db.execute(select(func.count()).select_from(stmt.subquery())).scalar_one()
        sort_field = getattr(CourseClass, query.sort_by, CourseClass.created_at) if query.sort_by else CourseClass.created_at
        stmt = stmt.order_by(sort_field.asc() if query.sort_order == "asc" else sort_field.desc())
        stmt = stmt.offset((query.page - 1) * query.page_size).limit(query.page_size)
        return list(self.db.execute(stmt).scalars().all()), int(total)

    def get_classes_by_course(
        self,
        course_id: str,
        query: PaginationParams,
        status: str | None = None,
        class_type: str | None = None,
    ) -> tuple[list[CourseClass], int]:
        CourseService(self.db).get_course_by_id(course_id)
        return self.get_classes(query, course_id=course_id, status=status, class_type=class_type)

    def update_class(self, class_id: str, payload: ClassUpdate) -> CourseClass:
        class_obj = self.get_class_by_id(class_id)
        teacher = self._get_teacher(payload.teacher_id) if payload.teacher_id is not None else None
        if payload.code is not None:
            code = payload.code.strip() or None
            if code and code != class_obj.code:
                exists = self.db.execute(
                    select(CourseClass).where(CourseClass.code == code, CourseClass.deleted_at.is_(None), CourseClass.id != class_obj.id)
                ).scalar_one_or_none()
                if exists:
                    raise HTTPException(status_code=400, detail="Class code already exists")
            class_obj.code = code
        if payload.name is not None:
            class_obj.name = payload.name.strip()
        if payload.teacher_id is not None:
            class_obj.teacher_id = teacher.id if teacher else None
        for field in ["max_students", "start_date", "end_date"]:
            value = getattr(payload, field)
            if value is not None:
                setattr(class_obj, field, value)
        if payload.class_type is not None:
            class_obj.class_type = _enum(ClassType, payload.class_type, "class type")
        if payload.status is not None:
            class_obj.status = _enum(ClassStatus, payload.status, "class status")
        if class_obj.end_date and class_obj.start_date and class_obj.start_date > class_obj.end_date:
            raise HTTPException(status_code=400, detail="start_date must be less than or equal to end_date")
        if class_obj.max_students < self.count_students(str(class_obj.id)):
            raise HTTPException(status_code=400, detail="max_students cannot be less than current students count")
        self.db.commit()
        self.db.refresh(class_obj)
        return class_obj

    def soft_delete_class(self, class_id: str) -> None:
        class_obj = self.get_class_by_id(class_id)
        class_obj.status = ClassStatus.archived
        class_obj.deleted_at = _now()
        self.db.commit()
