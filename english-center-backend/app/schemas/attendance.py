from datetime import datetime

from pydantic import BaseModel


class AttendanceBulkItem(BaseModel):
    student_id: str
    status: str
    check_in_time: datetime | None = None
    note: str | None = None


class AttendanceUpdateRequest(BaseModel):
    status: str | None = None
    check_in_time: datetime | None = None
    note: str | None = None
