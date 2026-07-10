from sqlalchemy import JSON, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class MediaShare(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "media_share"

    media_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("media.id"), nullable=False, index=True)
    user_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    permissions: Mapped[list[str]] = mapped_column(JSON, nullable=False)

