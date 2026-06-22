from datetime import datetime
from pydantic import BaseModel, Field


class ChatUser(BaseModel):
    id: str
    full_name: str
    email: str
    phone: str | None = None
    avatar_url: str | None = None
    roles: list[str] = Field(default_factory=list)
    contact_type: str | None = None
    class_ids: list[str] = Field(default_factory=list)


class ChatAttachmentPayload(BaseModel):
    bucket: str
    object_name: str
    original_filename: str | None = None
    content_type: str | None = None
    size: int | None = None
    url: str | None = None


class CreateConversationRequest(BaseModel):
    participant_user_id: str


class SendMessageRequest(BaseModel):
    conversation_id: str | None = None
    recipient_user_id: str | None = None
    content: str | None = None
    attachments: list[ChatAttachmentPayload] = Field(default_factory=list)


class ChatAttachmentResponse(ChatAttachmentPayload):
    id: str


class ChatMessageResponse(BaseModel):
    id: str
    conversation_id: str
    sender_id: str
    content: str | None = None
    message_type: str
    attachments: list[ChatAttachmentResponse] = Field(default_factory=list)
    created_at: datetime


class ChatConversationResponse(BaseModel):
    id: str
    type: str
    title: str | None = None
    participants: list[ChatUser]
    last_message: ChatMessageResponse | None = None
    created_at: datetime
    updated_at: datetime


class AiChatStreamRequest(BaseModel):
    message: str = Field(min_length=1)
    context: str | None = None
    session_id: str = Field(min_length=1)
    client_message_id: str | None = None
