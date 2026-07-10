from __future__ import annotations

from collections.abc import Iterable
from datetime import datetime, timezone
from decimal import Decimal
from typing import Any, Literal

from fastapi import HTTPException
from pydantic import ValidationError
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models import StaffProfile, Teacher, User, UserStatus
from app.models.student import Student, StudentLevel
from app.repositories.role import RoleRepository
from app.repositories.staff import StaffRepository
from app.repositories.student import StudentRepository
from app.repositories.teacher import TeacherRepository
from app.repositories.user import UserRepository
from app.repositories.user_role import UserRoleRepository
from app.schemas.data_transfer import (
    DataExportEnvelope,
    DataImportResult,
    StaffTransferItem,
    StudentTransferItem,
    TeacherTransferItem,
)
from app.utils.serializers import user_to_dict

DEFAULT_IMPORT_PASSWORD = "Admin@123"
STUDENT_LEVEL_MAP = {
    "beginner": StudentLevel.beginner,
    "elementary": StudentLevel.elementary,
    "pre-intermediate": StudentLevel.elementary,
    "intermediate": StudentLevel.intermediate,
    "upper-intermediate": StudentLevel.upper_intermediate,
    "upper_intermediate": StudentLevel.upper_intermediate,
    "advanced": StudentLevel.advanced,
}


class AdminDataTransferService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.user_repo = UserRepository(db)
        self.role_repo = RoleRepository(db)
        self.user_role_repo = UserRoleRepository(db)
        self.teacher_repo = TeacherRepository(db)
        self.student_repo = StudentRepository(db)
        self.staff_repo = StaffRepository(db)

    def _user_export_dict(self, user: User) -> dict[str, Any]:
        data = user_to_dict(user, include_meta=True)
        data["password_hash"] = user.password_hash
        return data

    def _resolve_user_status(self, status: str | None) -> UserStatus:
        if not status:
            return UserStatus.active
        try:
            return UserStatus(status)
        except ValueError:
            return UserStatus.active

    def _resolve_student_level(self, level: str | None) -> StudentLevel | None:
        if not level:
            return None
        normalized = level.strip().lower().replace(" ", "-")
        mapped = STUDENT_LEVEL_MAP.get(normalized)
        if mapped:
            return mapped
        try:
            return StudentLevel(normalized)
        except ValueError:
            return None

    def _export_envelope(self, entity: Literal["teachers", "students", "staff"], items: Iterable[dict[str, Any]]) -> dict[str, Any]:
        return DataExportEnvelope(
            entity=entity,
            exported_at=datetime.now(timezone.utc),
            items=list(items),
        ).model_dump(mode="json")

    def export_teachers(self) -> dict[str, Any]:
        items = []
        for teacher, user in self.teacher_repo.list_all_with_user():
            items.append(
                {
                    "user": self._user_export_dict(user),
                    "specialization": teacher.specialization,
                    "bio": teacher.bio,
                    "experience_years": teacher.experience_years,
                    "certificates": teacher.certificates,
                    "hourly_rate": str(teacher.hourly_rate) if teacher.hourly_rate is not None else None,
                }
            )
        return self._export_envelope("teachers", items)

    def export_students(self) -> dict[str, Any]:
        items = []
        for student, user in self.student_repo.list_all_with_user():
            items.append(
                {
                    "user": self._user_export_dict(user),
                    "date_of_birth": student.date_of_birth,
                    "gender": student.gender,
                    "address": student.address,
                    "level": student.level.value if student.level else None,
                    "learning_goal": student.learning_goal,
                    "parent_name": student.parent_name,
                    "parent_phone": student.parent_phone,
                }
            )
        return self._export_envelope("students", items)

    def export_staff(self) -> dict[str, Any]:
        items = []
        for staff, user in self.staff_repo.list_all_with_user():
            items.append(
                {
                    "user": self._user_export_dict(user),
                    "position": staff.position,
                    "department": staff.department,
                    "note": staff.note,
                }
            )
        return self._export_envelope("staff", items)

    def import_teachers(self, payload: dict[str, Any]) -> DataImportResult:
        return self._import_items(
            payload=payload,
            entity="teachers",
            item_model=TeacherTransferItem,
            upsert_handler=self._upsert_teacher,
        )

    def import_students(self, payload: dict[str, Any]) -> DataImportResult:
        return self._import_items(
            payload=payload,
            entity="students",
            item_model=StudentTransferItem,
            upsert_handler=self._upsert_student,
        )

    def import_staff(self, payload: dict[str, Any]) -> DataImportResult:
        return self._import_items(
            payload=payload,
            entity="staff",
            item_model=StaffTransferItem,
            upsert_handler=self._upsert_staff,
        )

    def _import_items(
        self,
        payload: dict[str, Any],
        entity: str,
        item_model: type[TeacherTransferItem] | type[StudentTransferItem] | type[StaffTransferItem],
        upsert_handler,
    ) -> DataImportResult:
        if payload.get("entity") != entity:
            raise HTTPException(status_code=400, detail=f"Invalid import entity, expected {entity}")

        raw_items = payload.get("items")
        if not isinstance(raw_items, list):
            raise HTTPException(status_code=400, detail="Invalid import payload")

        result = DataImportResult(entity=entity, total=len(raw_items), created=0, updated=0, skipped=0, errors=[])

        try:
            for index, raw_item in enumerate(raw_items):
                try:
                    item = item_model.model_validate(raw_item)
                except ValidationError as exc:
                    result.skipped += 1
                    result.errors.append({"index": index, "message": "Validation failed", "errors": exc.errors()})
                    continue

                try:
                    with self.db.begin_nested():
                        action = upsert_handler(item)
                    if action == "created":
                        result.created += 1
                    else:
                        result.updated += 1
                except Exception as exc:
                    result.skipped += 1
                    result.errors.append({"index": index, "message": str(exc)})

            self.db.commit()
            return result
        except Exception:
            self.db.rollback()
            raise

    def _upsert_user(self, user_payload) -> tuple[User, str]:
        existing = self.user_repo.get_by_email_including_deleted(str(user_payload.email))
        password_hash = user_payload.password_hash or hash_password(DEFAULT_IMPORT_PASSWORD)
        if existing:
            existing.full_name = user_payload.full_name
            existing.email = str(user_payload.email)
            existing.phone = user_payload.phone
            existing.avatar_url = user_payload.avatar_url
            existing.status = self._resolve_user_status(user_payload.status)
            existing.is_verified = bool(user_payload.is_verified) if user_payload.is_verified is not None else existing.is_verified
            existing.password_hash = password_hash
            if existing.deleted_at is not None:
                existing.deleted_at = None
            self.user_repo.update(existing)
            return existing, "updated"

        user = User(
            full_name=user_payload.full_name,
            email=str(user_payload.email),
            phone=user_payload.phone,
            avatar_url=user_payload.avatar_url,
            password_hash=password_hash,
            status=self._resolve_user_status(user_payload.status),
            is_verified=bool(user_payload.is_verified) if user_payload.is_verified is not None else False,
        )
        self.user_repo.create(user)
        return user, "created"

    def _ensure_role(self, role_name: str) -> str:
        role = self.role_repo.get_active_by_name(role_name)
        if not role:
            raise HTTPException(status_code=404, detail=f"{role_name.title()} role not found")
        return str(role.id)

    def _upsert_teacher(self, item: TeacherTransferItem) -> str:
        user, _ = self._upsert_user(item.user)
        role_id = self._ensure_role("teacher")
        self.user_role_repo.create_or_restore_relation(str(user.id), role_id)

        teacher = self.db.execute(select(Teacher).where(Teacher.user_id == user.id)).scalar_one_or_none()
        if teacher:
            teacher.specialization = item.specialization
            teacher.bio = item.bio
            teacher.experience_years = item.experience_years
            teacher.certificates = item.certificates
            teacher.hourly_rate = item.hourly_rate
            if teacher.deleted_at is not None:
                teacher.deleted_at = None
            self.teacher_repo.update(teacher)
            return "updated"

        self.teacher_repo.create(
            Teacher(
                user_id=str(user.id),
                specialization=item.specialization,
                bio=item.bio,
                experience_years=item.experience_years,
                certificates=item.certificates,
                hourly_rate=item.hourly_rate,
            )
        )
        return "created"

    def _upsert_student(self, item: StudentTransferItem) -> str:
        user, _ = self._upsert_user(item.user)
        role_id = self._ensure_role("student")
        self.user_role_repo.create_or_restore_relation(str(user.id), role_id)

        student = self.db.execute(select(Student).where(Student.user_id == user.id)).scalar_one_or_none()
        level = self._resolve_student_level(item.level)
        if student:
            student.date_of_birth = item.date_of_birth
            student.gender = item.gender
            student.address = item.address
            student.level = level
            student.learning_goal = item.learning_goal
            student.parent_name = item.parent_name
            student.parent_phone = item.parent_phone
            if student.deleted_at is not None:
                student.deleted_at = None
            self.student_repo.update(student)
            return "updated"

        self.student_repo.create(
            Student(
                user_id=str(user.id),
                date_of_birth=item.date_of_birth,
                gender=item.gender,
                address=item.address,
                level=level,
                learning_goal=item.learning_goal,
                parent_name=item.parent_name,
                parent_phone=item.parent_phone,
            )
        )
        return "created"

    def _upsert_staff(self, item: StaffTransferItem) -> str:
        user, _ = self._upsert_user(item.user)
        role_id = self._ensure_role("staff")
        self.user_role_repo.create_or_restore_relation(str(user.id), role_id)

        staff = self.db.execute(select(StaffProfile).where(StaffProfile.user_id == user.id)).scalar_one_or_none()
        if staff:
            staff.position = item.position
            staff.department = item.department
            staff.note = item.note
            if staff.deleted_at is not None:
                staff.deleted_at = None
            self.staff_repo.update(staff)
            return "updated"

        self.staff_repo.create(
            StaffProfile(
                user_id=str(user.id),
                position=item.position,
                department=item.department,
                note=item.note,
            )
        )
        return "created"
