from datetime import datetime, timezone
from typing import Any

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models import User
from app.models.chat import ChatMessage, ChatMessageAttachment, Conversation, ConversationParticipant, ConversationType, MessageType
from app.repositories.chat import (
    ChatAttachmentRepository,
    ChatContactRepository,
    ChatMessageRepository,
    ConversationParticipantRepository,
    ConversationRepository,
)
from app.repositories.user import UserRepository
from app.schemas.chat import ChatAttachmentPayload, SendMessageRequest
from app.services.rbac_service import RBACService
from app.utils.serializers import user_to_dict

MANAGER_ROLES = {"admin", "staff", "manager"}


def _now() -> datetime:
    return datetime.now(timezone.utc)


class ChatService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.conversation_repo = ConversationRepository(db)
        self.participant_repo = ConversationParticipantRepository(db)
        self.message_repo = ChatMessageRepository(db)
        self.attachment_repo = ChatAttachmentRepository(db)
        self.contact_repo = ChatContactRepository(db)
        self.user_repo = UserRepository(db)
        self.rbac = RBACService(db)

    def list_contacts(self, current_user: User) -> list[dict[str, Any]]:
        roles = set(self.rbac.get_user_roles(str(current_user.id)))
        contacts: dict[str, dict[str, Any]] = {}

        if "student" in roles:
            for user, contact_type, class_ids in self.contact_repo.list_contacts_for_student(str(current_user.id)):
                contacts[str(user.id)] = self._contact_dict(user, contact_type, class_ids)

        if "teacher" in roles:
            for user, class_ids in self.contact_repo.list_student_contacts_for_teacher(str(current_user.id)):
                contacts[str(user.id)] = self._contact_dict(user, "student", class_ids)

        if roles.intersection(MANAGER_ROLES):
            for user, class_ids in self.contact_repo.list_all_student_users():
                if str(user.id) != str(current_user.id):
                    contacts[str(user.id)] = self._contact_dict(user, "student", class_ids)
            for user in self.contact_repo.list_manager_users():
                if str(user.id) != str(current_user.id):
                    contacts[str(user.id)] = self._contact_dict(user, "manager", [])

        return sorted(contacts.values(), key=lambda item: item["full_name"].lower())

    def list_conversations(self, current_user: User) -> list[dict[str, Any]]:
        conversations = self.conversation_repo.list_for_user(str(current_user.id))
        last_messages = self.message_repo.get_last_by_conversation_ids([str(item.id) for item in conversations])
        attachments_by_message = self.attachment_repo.list_by_message_ids([str(item.id) for item in last_messages.values()])
        return [
            self.conversation_dict(
                conversation,
                current_user=current_user,
                last_message=last_messages.get(str(conversation.id)),
                attachments_by_message=attachments_by_message,
            )
            for conversation in conversations
        ]

    def get_or_create_direct_conversation(self, current_user: User, participant_user_id: str) -> Conversation:
        try:
            conversation = self._get_or_create_direct_conversation(current_user, participant_user_id)
            self.db.commit()
            return conversation
        except Exception:
            self.db.rollback()
            raise

    def _get_or_create_direct_conversation(self, current_user: User, participant_user_id: str) -> Conversation:
        if str(current_user.id) == str(participant_user_id):
            raise HTTPException(status_code=400, detail="Cannot chat with yourself")
        participant = self.user_repo.get_active_by_id(participant_user_id)
        if not participant:
            raise HTTPException(status_code=404, detail="Participant not found")
        if not self.can_chat(str(current_user.id), str(participant.id)):
            raise HTTPException(status_code=403, detail="You are not allowed to chat with this user")

        existing = self.conversation_repo.get_direct_between_users(str(current_user.id), str(participant.id))
        if existing:
            return existing

        conversation = self.conversation_repo.create(Conversation(type=ConversationType.direct))
        self.participant_repo.create(ConversationParticipant(conversation_id=str(conversation.id), user_id=str(current_user.id)))
        self.participant_repo.create(ConversationParticipant(conversation_id=str(conversation.id), user_id=str(participant.id)))
        return conversation

    def list_messages(self, conversation_id: str, current_user: User, limit: int = 50, before_id: str | None = None) -> list[dict[str, Any]]:
        self._get_conversation_for_user(conversation_id, current_user)
        messages = self.message_repo.list_by_conversation(conversation_id, min(max(limit, 1), 100), before_id)
        attachments = self.attachment_repo.list_by_message_ids([str(item.id) for item in messages])
        return [self.message_dict(item, attachments.get(str(item.id), [])) for item in messages]

    def send_message(self, current_user: User, payload: SendMessageRequest) -> dict[str, Any]:
        content = payload.content.strip() if payload.content else None
        if not content and not payload.attachments:
            raise HTTPException(status_code=400, detail="Message content or attachment is required")

        try:
            conversation = None
            if payload.conversation_id:
                conversation = self._get_conversation_for_user(payload.conversation_id, current_user)
            elif payload.recipient_user_id:
                conversation = self._get_or_create_direct_conversation(current_user, payload.recipient_user_id)
            else:
                raise HTTPException(status_code=400, detail="Conversation or recipient is required")

            message_type = self._resolve_message_type(content, payload.attachments)
            message = self.message_repo.create(
                ChatMessage(
                    conversation_id=str(conversation.id),
                    sender_id=str(current_user.id),
                    content=content,
                    message_type=message_type,
                )
            )
            attachment_rows = [self._create_attachment(str(message.id), attachment) for attachment in payload.attachments]
            conversation.updated_at = _now()
            self.conversation_repo.update(conversation)
            self.db.commit()
            return self.message_dict(message, attachment_rows)
        except Exception:
            self.db.rollback()
            raise

    def participant_user_ids(self, conversation_id: str) -> list[str]:
        return self.participant_repo.list_user_ids(conversation_id)

    def can_chat(self, user_a_id: str, user_b_id: str) -> bool:
        roles_a = set(self.rbac.get_user_roles(user_a_id))
        roles_b = set(self.rbac.get_user_roles(user_b_id))
        if roles_a.intersection(MANAGER_ROLES) and ("student" in roles_b or roles_b.intersection(MANAGER_ROLES)):
            return True
        if roles_b.intersection(MANAGER_ROLES) and ("student" in roles_a or roles_a.intersection(MANAGER_ROLES)):
            return True
        if self.contact_repo.are_users_connected_by_class(user_a_id, user_b_id):
            return True
        return False

    def conversation_dict(
        self,
        conversation: Conversation,
        current_user: User | None = None,
        last_message: ChatMessage | None = None,
        attachments_by_message: dict[str, list[ChatMessageAttachment]] | None = None,
    ) -> dict[str, Any]:
        users = self.participant_repo.list_users(str(conversation.id))
        participants = [self._contact_dict(user, None, []) for user in users]
        title = conversation.title
        if not title and current_user:
            others = [item for item in participants if item["id"] != str(current_user.id)]
            title = others[0]["full_name"] if others else "Cuộc trò chuyện"
        return {
            "id": str(conversation.id),
            "type": conversation.type.value,
            "title": title,
            "participants": participants,
            "last_message": self.message_dict(last_message, (attachments_by_message or {}).get(str(last_message.id), [])) if last_message else None,
            "created_at": conversation.created_at,
            "updated_at": conversation.updated_at,
        }

    def message_dict(self, message: ChatMessage, attachments: list[ChatMessageAttachment] | None = None) -> dict[str, Any]:
        return {
            "id": str(message.id),
            "conversation_id": str(message.conversation_id),
            "sender_id": str(message.sender_id),
            "content": message.content,
            "message_type": message.message_type.value,
            "attachments": [self._attachment_dict(item) for item in attachments or []],
            "created_at": message.created_at,
        }

    def _get_conversation_for_user(self, conversation_id: str, current_user: User) -> Conversation:
        conversation = self.conversation_repo.get_with_participant(conversation_id, str(current_user.id))
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        return conversation

    def _create_attachment(self, message_id: str, payload: ChatAttachmentPayload) -> ChatMessageAttachment:
        return self.attachment_repo.create(
            ChatMessageAttachment(
                message_id=message_id,
                bucket=payload.bucket,
                object_name=payload.object_name,
                original_filename=payload.original_filename,
                content_type=payload.content_type,
                size=payload.size,
                url=payload.url,
            )
        )

    def _resolve_message_type(self, content: str | None, attachments: list[ChatAttachmentPayload]) -> MessageType:
        if content and attachments:
            return MessageType.mixed
        if not attachments:
            return MessageType.text
        if all((item.content_type or "").startswith("image/") for item in attachments):
            return MessageType.image
        return MessageType.file

    def _contact_dict(self, user: User, contact_type: str | None, class_ids: list[str]) -> dict[str, Any]:
        data = user_to_dict(user, include_meta=True)
        data["roles"] = self.rbac.get_user_roles(str(user.id))
        data["contact_type"] = contact_type
        data["class_ids"] = class_ids
        return data

    @staticmethod
    def _attachment_dict(item: ChatMessageAttachment) -> dict[str, Any]:
        return {
            "id": str(item.id),
            "bucket": item.bucket,
            "object_name": item.object_name,
            "original_filename": item.original_filename,
            "content_type": item.content_type,
            "size": item.size,
            "url": item.url,
        }
