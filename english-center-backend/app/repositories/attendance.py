from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.attendance import Attendance
from app.repositories.base import BaseRepository


class AttendanceRepository(BaseRepository[Attendance]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, Attendance)

    def get_by_session_and_student(self, session_id: str, student_id: str) -> Attendance | None:
        return self.db.execute(
            select(Attendance).where(
                Attendance.session_id == session_id,
                Attendance.student_id == student_id,
                Attendance.deleted_at.is_(None),
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
