import enum

from sqlalchemy import Boolean, Enum, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class AssignmentTypeStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"


class AssignmentType(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "assignment_types"

    code: Mapped[str] = mapped_column(String(100), nullable=False, unique=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_auto_gradable: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    requires_file_submission: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    allow_text_submission: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    allow_file_submission: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    status: Mapped[AssignmentTypeStatus] = mapped_column(
        Enum(AssignmentTypeStatus, name="assignment_type_status"),
        nullable=False,
        default=AssignmentTypeStatus.active,
        index=True,
    )
