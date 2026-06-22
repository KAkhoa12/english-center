from datetime import date, time

from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.models.class_model import CourseClass
from app.models.class_session import ClassSchedule, ClassSession, SessionStatus
from app.models.class_student import ClassStudent
from app.repositories.base import BaseRepository
from app.schemas.common import PaginationParams


class ClassSessionRepository(BaseRepository[ClassSession]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, ClassSession)

    def _resolved_start_time(self):
        return func.coalesce(ClassSession.override_start_time, ClassSchedule.start_time)

    def _resolved_end_time(self):
        return func.coalesce(ClassSession.override_end_time, ClassSchedule.end_time)

    def _with_schedule(self):
        return select(ClassSession).join(ClassSchedule, ClassSchedule.id == ClassSession.class_schedule_id)

    def list_by_class_id(self, class_id: str) -> list[ClassSession]:
        return list(
            self.db.execute(
                self._with_schedule()
                .where(ClassSession.class_id == class_id, ClassSession.deleted_at.is_(None))
                .order_by(ClassSession.session_date.asc(), self._resolved_start_time().asc())
            ).scalars().all()
        )

    def list_by_teacher_id(self, teacher_id: str) -> list[ClassSession]:
        return list(
            self.db.execute(
                self._with_schedule()
                .where(ClassSession.teacher_id == teacher_id, ClassSession.deleted_at.is_(None))
                .order_by(ClassSession.session_date.asc(), self._resolved_start_time().asc())
            ).scalars().all()
        )

    def list_by_room_id(self, room_id: str) -> list[ClassSession]:
        return list(
            self.db.execute(
                self._with_schedule()
                .where(ClassSession.room_id == room_id, ClassSession.deleted_at.is_(None))
                .order_by(ClassSession.session_date.asc(), self._resolved_start_time().asc())
            ).scalars().all()
        )

    def list_by_lesson_id(self, lesson_id: str) -> list[ClassSession]:
        return list(
            self.db.execute(
                self._with_schedule()
                .where(ClassSession.lesson_id == lesson_id, ClassSession.deleted_at.is_(None))
                .order_by(ClassSession.session_date.asc(), self._resolved_start_time().asc())
            ).scalars().all()
        )

    def get_active_by_id(self, session_id: str) -> ClassSession | None:
        return self.get(session_id)

    def count_by_class_id(self, class_id: str) -> int:
        return self.count(filters=[ClassSession.class_id == class_id])

    def count_non_cancelled_by_class_id(self, class_id: str) -> int:
        return int(
            self.db.execute(
                select(func.count()).select_from(ClassSession).where(
                    ClassSession.class_id == class_id,
                    ClassSession.deleted_at.is_(None),
                    ClassSession.status != SessionStatus.cancelled,
                )
            ).scalar_one()
        )

    def count_non_cancelled_by_class_ids(self, class_ids: list[str]) -> int:
        if not class_ids:
            return 0
        return int(
            self.db.execute(
                select(func.count()).select_from(ClassSession).where(
                    ClassSession.class_id.in_(class_ids),
                    ClassSession.deleted_at.is_(None),
                    ClassSession.status != SessionStatus.cancelled,
                )
            ).scalar_one()
        )

    def list_filtered_by_class(
        self,
        class_id: str,
        query: PaginationParams,
        status=None,
        mode=None,
        from_date: date | None = None,
        to_date: date | None = None,
    ) -> tuple[list[ClassSession], int]:
        stmt = self._with_schedule().where(
            ClassSession.class_id == class_id,
            ClassSession.deleted_at.is_(None),
        )
        if status:
            stmt = stmt.where(ClassSession.status == status)
        if mode:
            stmt = stmt.where(ClassSession.mode == mode)
        if from_date:
            stmt = stmt.where(ClassSession.session_date >= from_date)
        if to_date:
            stmt = stmt.where(ClassSession.session_date <= to_date)
        total = int(self.db.execute(select(func.count()).select_from(stmt.subquery())).scalar_one())
        stmt = stmt.order_by(ClassSession.session_date.asc(), self._resolved_start_time().asc())
        stmt = stmt.offset((query.page - 1) * query.page_size).limit(query.page_size)
        return list(self.db.execute(stmt).scalars().all()), total

    def list_filtered(
        self,
        query: PaginationParams,
        class_id: str | None = None,
        course_id: str | None = None,
        class_ids: list[str] | None = None,
        course_ids: list[str] | None = None,
        teacher_id: str | None = None,
        accessible_teacher_id: str | None = None,
        room_id: str | None = None,
        status=None,
        mode=None,
        from_date: date | None = None,
        to_date: date | None = None,
    ) -> tuple[list[ClassSession], int]:
        stmt = self._with_schedule().where(ClassSession.deleted_at.is_(None))
        if course_id or course_ids or accessible_teacher_id:
            stmt = stmt.join(CourseClass, CourseClass.id == ClassSession.class_id).where(
                CourseClass.deleted_at.is_(None),
            )
        if course_id:
            stmt = stmt.where(CourseClass.course_id == course_id)
        if course_ids:
            stmt = stmt.where(CourseClass.course_id.in_(course_ids))
        if class_id:
            stmt = stmt.where(ClassSession.class_id == class_id)
        if class_ids:
            stmt = stmt.where(ClassSession.class_id.in_(class_ids))
        if teacher_id:
            stmt = stmt.where(ClassSession.teacher_id == teacher_id)
        if accessible_teacher_id:
            stmt = stmt.where(
                or_(
                    ClassSession.teacher_id == accessible_teacher_id,
                    CourseClass.teacher_id == accessible_teacher_id,
                )
            )
        if room_id:
            stmt = stmt.where(ClassSession.room_id == room_id)
        if status:
            stmt = stmt.where(ClassSession.status == status)
        if mode:
            stmt = stmt.where(ClassSession.mode == mode)
        if from_date:
            stmt = stmt.where(ClassSession.session_date >= from_date)
        if to_date:
            stmt = stmt.where(ClassSession.session_date <= to_date)

        total = int(self.db.execute(select(func.count()).select_from(stmt.subquery())).scalar_one())
        sort_field = getattr(ClassSession, query.sort_by, None) if query.sort_by else None
        order_by = sort_field if sort_field is not None else ClassSession.session_date
        order_by = order_by.asc() if query.sort_order == "asc" else order_by.desc()
        stmt = stmt.order_by(order_by, self._resolved_start_time().asc())
        stmt = stmt.offset((query.page - 1) * query.page_size).limit(query.page_size)
        return list(self.db.execute(stmt).scalars().all()), total

    def find_room_conflict(
        self,
        room_id: str,
        session_date: date,
        start_time: time,
        end_time: time,
        exclude_session_id: str | None = None,
    ) -> ClassSession | None:
        stmt = self._with_schedule().where(
            ClassSession.room_id == room_id,
            ClassSession.session_date == session_date,
            ClassSession.deleted_at.is_(None),
            ClassSession.status != SessionStatus.cancelled,
            self._resolved_start_time() < end_time,
            self._resolved_end_time() > start_time,
        )
        if exclude_session_id:
            stmt = stmt.where(ClassSession.id != exclude_session_id)
        return self.db.execute(stmt).scalar_one_or_none()

    def find_class_conflict(
        self,
        class_id: str,
        session_date: date,
        start_time: time,
        end_time: time,
        exclude_session_id: str | None = None,
    ) -> ClassSession | None:
        stmt = self._with_schedule().where(
            ClassSession.class_id == class_id,
            ClassSession.session_date == session_date,
            ClassSession.deleted_at.is_(None),
            ClassSession.status != SessionStatus.cancelled,
            self._resolved_start_time() < end_time,
            self._resolved_end_time() > start_time,
        )
        if exclude_session_id:
            stmt = stmt.where(ClassSession.id != exclude_session_id)
        return self.db.execute(stmt).scalar_one_or_none()

    def find_teacher_conflict(
        self,
        teacher_id: str,
        session_date: date,
        start_time: time,
        end_time: time,
        exclude_session_id: str | None = None,
    ) -> ClassSession | None:
        stmt = self._with_schedule().where(
            ClassSession.teacher_id == teacher_id,
            ClassSession.session_date == session_date,
            ClassSession.deleted_at.is_(None),
            ClassSession.status != SessionStatus.cancelled,
            self._resolved_start_time() < end_time,
            self._resolved_end_time() > start_time,
        )
        if exclude_session_id:
            stmt = stmt.where(ClassSession.id != exclude_session_id)
        return self.db.execute(stmt).scalar_one_or_none()

    def list_my_sessions(
        self,
        student_id: str,
        query: PaginationParams,
        status=None,
        from_date: date | None = None,
        to_date: date | None = None,
    ) -> tuple[list[ClassSession], int]:
        stmt = (
            self._with_schedule()
            .join(ClassStudent, ClassStudent.class_id == ClassSession.class_id)
            .where(
                ClassStudent.student_id == student_id,
                ClassStudent.deleted_at.is_(None),
                ClassSession.deleted_at.is_(None),
            )
        )
        if status:
            stmt = stmt.where(ClassSession.status == status)
        if from_date:
            stmt = stmt.where(ClassSession.session_date >= from_date)
        if to_date:
            stmt = stmt.where(ClassSession.session_date <= to_date)
        total = int(self.db.execute(select(func.count()).select_from(stmt.subquery())).scalar_one())
        stmt = stmt.order_by(ClassSession.session_date.asc(), self._resolved_start_time().asc())
        stmt = stmt.offset((query.page - 1) * query.page_size).limit(query.page_size)
        return list(self.db.execute(stmt).scalars().all()), total
