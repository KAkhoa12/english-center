import enum
from datetime import date

from sqlalchemy import Date, Enum, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class StudentLevel(str, enum.Enum):
    beginner = "beginner"
    elementary = "elementary"
    intermediate = "intermediate"
    upper_intermediate = "upper_intermediate"
    advanced = "advanced"


class Student(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "students"

    user_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)
    date_of_birth: Mapped[date | None] = mapped_column(Date, nullable=True)
    gender: Mapped[str | None] = mapped_column(String(20), nullable=True)
    address: Mapped[str | None] = mapped_column(Text, nullable=True)
    level: Mapped[StudentLevel | None] = mapped_column(Enum(StudentLevel, name="student_level"), nullable=True)
    learning_goal: Mapped[str | None] = mapped_column(Text, nullable=True)
    parent_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    parent_phone: Mapped[str | None] = mapped_column(String(30), nullable=True)
