from pydantic import BaseModel


class AttendanceSummaryFilter(BaseModel):
    student_id: str | None = None
    session_id: str | None = None
    status: str | None = None
    from_date: str | None = None
    to_date: str | None = None
