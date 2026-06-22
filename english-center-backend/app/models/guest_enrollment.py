from sqlalchemy import Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class GuestEnrollment(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "guest_enrollments"

    content: Mapped[str] = mapped_column(Text, nullable=False)
