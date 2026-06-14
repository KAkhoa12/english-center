import enum

from sqlalchemy import Enum, ForeignKey, String, Text, UniqueConstraint, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class ConversationType(str, enum.Enum):
    direct = "direct"


class MessageType(str, enum.Enum):
    text = "text"
    file = "file"
    image = "image"
    mixed = "mixed"


class Conversation(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "conversations"

    type: Mapped[ConversationType] = mapped_column(
        Enum(ConversationType, name="conversation_type"),
        nullable=False,
        default=ConversationType.direct,
        index=True,
    )
    title: Mapped[str | None] = mapped_column(String(255), nullable=True)
    class_id: Mapped[str | None] = mapped_column(UUID(as_uuid=True), ForeignKey("classes.id"), nullable=True, index=True)


class ConversationParticipant(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "conversation_participants"
    __table_args__ = (UniqueConstraint("conversation_id", "user_id", name="uq_conversation_participants_conversation_user"),)

    conversation_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("conversations.id"), nullable=False, index=True)
    user_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)


class ChatMessage(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "chat_messages"

    conversation_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("conversations.id"), nullable=False, index=True)
    sender_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    content: Mapped[str | None] = mapped_column(Text, nullable=True)
    message_type: Mapped[MessageType] = mapped_column(
        Enum(MessageType, name="chat_message_type"),
        nullable=False,
        default=MessageType.text,
        index=True,
    )


class ChatMessageAttachment(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "chat_message_attachments"

    message_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("chat_messages.id"), nullable=False, index=True)
    bucket: Mapped[str] = mapped_column(String(100), nullable=False)
    object_name: Mapped[str] = mapped_column(String(500), nullable=False)
    original_filename: Mapped[str | None] = mapped_column(String(255), nullable=True)
    content_type: Mapped[str | None] = mapped_column(String(255), nullable=True)
    size: Mapped[int | None] = mapped_column(Integer, nullable=True)
    url: Mapped[str | None] = mapped_column(String(1000), nullable=True)
