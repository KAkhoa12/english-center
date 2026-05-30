from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.attendance import Attendance
from app.models.class_session import ClassSession
from app.repositories.base import BaseRepository


class AttendanceRepository(BaseRepository[Attendance]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, Attendance)

    def get_by_session_and_student(self, session_id: str, student_id: str) -> Attendance | None:
        return self.db.execute(
            select(Attendance).where(
                Attendance.session_id == session_id,
                Attendance.student_id == student_id,
            )
        ).scalar_one_or_none()

    def list_by_session_id(self, session_id: str) -> list[Attendance]:
        return list(
            self.db.execute(
                select(Attendance).where(
                    Attendance.session_id == session_id,
                    Attendance.deleted_at.is_(None),
                )
            ).scalars().all()
        )

    def list_by_class_id(self, class_id: str) -> list[Attendance]:
        return list(
            self.db.execute(
                select(Attendance).where(
                    Attendance.class_id == class_id,
                    Attendance.deleted_at.is_(None),
                )
            ).scalars().all()
        )

    def list_by_student_id(self, student_id: str) -> list[Attendance]:
        return list(
            self.db.execute(
                select(Attendance).where(
                    Attendance.student_id == student_id,
                    Attendance.deleted_at.is_(None),
                )
            ).scalars().all()
        )

    def count_group_by_status(self, session_id: str):
        return self.db.execute(
            select(Attendance.status, func.count())
            .where(Attendance.session_id == session_id, Attendance.deleted_at.is_(None))
            .group_by(Attendance.status)
        ).all()

    def count_marked_by_session(self, session_id: str, not_marked_status) -> int:
        return int(
            self.db.execute(
                select(func.count())
                .select_from(Attendance)
                .where(
                    Attendance.session_id == session_id,
                    Attendance.deleted_at.is_(None),
                    Attendance.status != not_marked_status,
                )
            ).scalar_one()
        )

    def list_filtered_by_class(
        self,
        class_id: str,
        session_id: str | None = None,
        student_id: str | None = None,
        status=None,
        from_date=None,
        to_date=None,
    ) -> list[Attendance]:
        stmt = select(Attendance).join(ClassSession, ClassSession.id == Attendance.session_id).where(
            Attendance.class_id == class_id,
            Attendance.deleted_at.is_(None),
            ClassSession.deleted_at.is_(None),
        )
        if session_id:
            stmt = stmt.where(Attendance.session_id == session_id)
        if student_id:
            stmt = stmt.where(Attendance.student_id == student_id)
        if status:
            stmt = stmt.where(Attendance.status == status)
        if from_date:
            stmt = stmt.where(ClassSession.session_date >= from_date)
        if to_date:
            stmt = stmt.where(ClassSession.session_date <= to_date)
        stmt = stmt.order_by(ClassSession.session_date.desc(), Attendance.created_at.desc())
        return list(self.db.execute(stmt).scalars().all())

    def list_filtered_by_student(self, student_id: str, class_id: str | None = None) -> list[Attendance]:
        stmt = select(Attendance).where(Attendance.student_id == student_id, Attendance.deleted_at.is_(None))
        if class_id:
            stmt = stmt.where(Attendance.class_id == class_id)
        stmt = stmt.order_by(Attendance.recorded_at.desc().nullslast(), Attendance.created_at.desc())
        return list(self.db.execute(stmt).scalars().all())

    def count_group_by_status_for_class(self, class_id: str):
        return self.db.execute(
            select(Attendance.status, func.count())
            .where(Attendance.class_id == class_id, Attendance.deleted_at.is_(None))
            .group_by(Attendance.status)
        ).all()

    def count_group_by_status_for_student_in_class(self, class_id: str, student_id: str):
        return self.db.execute(
            select(Attendance.status, func.count())
            .where(
                Attendance.class_id == class_id,
                Attendance.student_id == student_id,
                Attendance.deleted_at.is_(None),
            )
            .group_by(Attendance.status)
        ).all()

    def count_group_by_status_for_student(self, student_id: str):
        return self.db.execute(
            select(Attendance.status, func.count())
            .where(Attendance.student_id == student_id, Attendance.deleted_at.is_(None))
            .group_by(Attendance.status)
        ).all()
