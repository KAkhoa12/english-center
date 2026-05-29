from datetime import date, time

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.class_session import ClassSession, SessionStatus
from app.models.class_student import ClassStudent
from app.repositories.base import BaseRepository
from app.schemas.common import PaginationParams


class ClassSessionRepository(BaseRepository[ClassSession]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, ClassSession)

    def list_by_class_id(self, class_id: str) -> list[ClassSession]:
        return list(
            self.db.execute(
                select(ClassSession)
                .where(ClassSession.class_id == class_id, ClassSession.deleted_at.is_(None))
                .order_by(ClassSession.session_date.asc(), ClassSession.start_time.asc())
            ).scalars().all()
        )

    def list_by_teacher_id(self, teacher_id: str) -> list[ClassSession]:
        return list(
            self.db.execute(
                select(ClassSession)
                .where(ClassSession.teacher_id == teacher_id, ClassSession.deleted_at.is_(None))
                .order_by(ClassSession.session_date.asc(), ClassSession.start_time.asc())
            ).scalars().all()
        )

    def list_by_room_id(self, room_id: str) -> list[ClassSession]:
        return list(
            self.db.execute(
                select(ClassSession)
                .where(ClassSession.room_id == room_id, ClassSession.deleted_at.is_(None))
                .order_by(ClassSession.session_date.asc(), ClassSession.start_time.asc())
            ).scalars().all()
        )

    def list_by_lesson_id(self, lesson_id: str) -> list[ClassSession]:
        return list(
            self.db.execute(
                select(ClassSession)
                .where(ClassSession.lesson_id == lesson_id, ClassSession.deleted_at.is_(None))
                .order_by(ClassSession.session_date.asc(), ClassSession.start_time.asc())
            ).scalars().all()
        )

    def get_active_by_id(self, session_id: str) -> ClassSession | None:
        return self.get(session_id)

    def count_by_class_id(self, class_id: str) -> int:
        return self.count(filters=[ClassSession.class_id == class_id])

    def list_filtered_by_class(
        self,
        class_id: str,
        query: PaginationParams,
        status=None,
        mode=None,
        from_date: date | None = None,
        to_date: date | None = None,
    ) -> tuple[list[ClassSession], int]:
        filters = [ClassSession.class_id == class_id]
        if status:
            filters.append(ClassSession.status == status)
        if mode:
            filters.append(ClassSession.mode == mode)
        if from_date:
            filters.append(ClassSession.session_date >= from_date)
        if to_date:
            filters.append(ClassSession.session_date <= to_date)
        total = self.count(filters=filters)
        skip = (query.page - 1) * query.page_size
        items = self.list(
            filters=filters,
            skip=skip,
            limit=query.page_size,
            order_by=ClassSession.session_date.asc(),
        )
        items.sort(key=lambda x: (x.session_date, x.start_time))
        return items, total

    def find_room_conflict(
        self,
        room_id: str,
        session_date: date,
        start_time: time,
        end_time: time,
        exclude_session_id: str | None = None,
    ) -> ClassSession | None:
        stmt = select(ClassSession).where(
            ClassSession.room_id == room_id,
            ClassSession.session_date == session_date,
            ClassSession.deleted_at.is_(None),
            ClassSession.status != SessionStatus.cancelled,
            ClassSession.start_time < end_time,
            ClassSession.end_time > start_time,
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
        stmt = select(ClassSession).where(
            ClassSession.teacher_id == teacher_id,
            ClassSession.session_date == session_date,
            ClassSession.deleted_at.is_(None),
            ClassSession.status != SessionStatus.cancelled,
            ClassSession.start_time < end_time,
            ClassSession.end_time > start_time,
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
            select(ClassSession)
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
        stmt = stmt.order_by(ClassSession.session_date.asc(), ClassSession.start_time.asc())
        stmt = stmt.offset((query.page - 1) * query.page_size).limit(query.page_size)
        return list(self.db.execute(stmt).scalars().all()), total
