from decimal import Decimal

from pydantic import BaseModel, Field


class AddStudentToClassRequest(BaseModel):
    student_id: str
    enrollment_id: str | None = None
    note: str | None = None


class UpdateClassStudentRequest(BaseModel):
    enrollment_status: str | None = None
    final_score: Decimal | None = Field(default=None, ge=0)
    note: str | None = None
