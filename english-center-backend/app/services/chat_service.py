from datetime import datetime, timezone
from typing import Any

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import User
from app.models.chat import ChatMessage, ChatMessageAttachment, Conversation, ConversationParticipant, ConversationType, MessageType, ParticipantRole
from app.models.class_student import ClassEnrollmentStatus
from app.models.consultation import Consultation
from app.repositories.chat import (
    ChatAttachmentRepository,
    ChatContactRepository,
    ChatMessageRepository,
    ConversationParticipantRepository,
    ConversationRepository,
)
from app.repositories.course_class import CourseClassRepository
from app.repositories.class_student import ClassStudentRepository
from app.repositories.consultation import ConsultationRepository
from app.repositories.student import StudentRepository
from app.repositories.teacher import TeacherRepository
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
        self.student_repo = StudentRepository(db)
        self.teacher_repo = TeacherRepository(db)
        self.class_repo = CourseClassRepository(db)
        self.class_student_repo = ClassStudentRepository(db)
        self.consultation_repo = ConsultationRepository(db)
        self.rbac = RBACService(db)

    def list_contacts(self, current_user: User) -> list[dict[str, Any]]:
        roles = set(self.rbac.get_user_roles(str(current_user.id)))
        contacts: dict[str, dict[str, Any]] = {}

        if "student" in roles:
            for user, class_ids in self.contact_repo.list_contacts_for_student(str(current_user.id)):
                if "teacher" in self.rbac.get_user_roles(str(user.id)):
                    contacts[str(user.id)] = self._contact_dict(user, "teacher", class_ids)

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
        reply_ids = [str(message.reply_to_message_id) for message in last_messages.values() if message.reply_to_message_id]
        reply_messages = {str(item.id): item for item in self._get_messages_by_ids(reply_ids)} if reply_ids else {}
        return [
            self.conversation_dict(
                conversation,
                current_user=current_user,
                last_message=last_messages.get(str(conversation.id)),
                attachments_by_message=attachments_by_message,
                reply_messages=reply_messages,
            )
            for conversation in conversations
        ]

    def get_or_create_direct_conversation(self, current_user: User, participant_user_id: str) -> Conversation:
        try:
            return self.create_conversation(
                current_user,
                conversation_type=None,
                participant_user_id=participant_user_id,
                class_id=None,
                consultation_id=None,
            )
        except Exception:
            self.db.rollback()
            raise

    def create_conversation(
        self,
        current_user: User,
        conversation_type: str | None,
        participant_user_id: str | None = None,
        consultation_id: str | None = None,
        class_id: str | None = None,
    ) -> Conversation:
        try:
            if conversation_type == ConversationType.class_group.value or (conversation_type is None and class_id and not participant_user_id and not consultation_id):
                conversation = self._get_or_create_class_group_conversation(current_user, class_id)
            elif conversation_type == ConversationType.direct_consultation.value or consultation_id:
                conversation = self._get_or_create_consultation_conversation(current_user, consultation_id)
            else:
                conversation = self._get_or_create_direct_learning_conversation(current_user, participant_user_id, class_id)
            self.db.commit()
            return conversation
        except Exception:
            self.db.rollback()
            raise

    def list_messages(self, conversation_id: str, current_user: User, limit: int = 50, before_id: str | None = None) -> list[dict[str, Any]]:
        conversation = self._get_conversation_for_user(conversation_id, current_user)
        self._mark_messages_read(conversation, str(current_user.id))
        messages = self.message_repo.list_by_conversation(conversation_id, min(max(limit, 1), 100), before_id)
        attachments = self.attachment_repo.list_by_message_ids([str(item.id) for item in messages])
        reply_ids = [str(item.reply_to_message_id) for item in messages if item.reply_to_message_id]
        reply_messages = {str(item.id): item for item in self._get_messages_by_ids(reply_ids)} if reply_ids else {}
        data = [self.message_dict(item, attachments.get(str(item.id), []), reply_messages.get(str(item.reply_to_message_id)) if item.reply_to_message_id else None) for item in messages]
        self.db.commit()
        return data

    def send_message(self, current_user: User, payload: SendMessageRequest) -> dict[str, Any]:
        content = payload.content.strip() if payload.content else None
        if not content and not payload.attachments:
            raise HTTPException(status_code=400, detail="Message content or attachment is required")

        try:
            conversation = self._resolve_conversation_for_message(current_user, payload)
            reply_to_message = self._validate_reply_to_message(conversation, payload.reply_to_message_id)
            message_type = self._resolve_message_type(content, payload.attachments)
            message = self.message_repo.create(
                ChatMessage(
                    conversation_id=str(conversation.id),
                    sender_id=str(current_user.id),
                    reply_to_message_id=str(reply_to_message.id) if reply_to_message else None,
                    content=content,
                    message_type=message_type,
                    is_read=False,
                    read_at=None,
                )
            )
            attachment_rows = [self._create_attachment(str(message.id), attachment) for attachment in payload.attachments]
            conversation.updated_at = _now()
            self.conversation_repo.update(conversation)
            self.db.commit()
            return self.message_dict(message, attachment_rows, reply_to_message)
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
        reply_messages: dict[str, ChatMessage] | None = None,
    ) -> dict[str, Any]:
        participants = []
        for participant, user in self.participant_repo.list_participants_with_user(str(conversation.id)):
            participants.append(self._participant_dict(participant, user))
        title = conversation.title
        if not title and current_user:
            others = [item for item in participants if item["id"] != str(current_user.id)]
            title = others[0]["full_name"] if others else "Cuộc trò chuyện"
        if not title and conversation.class_id:
            title = self._class_title(str(conversation.class_id))
        reply_message = None
        if last_message and last_message.reply_to_message_id and reply_messages:
            reply_message = reply_messages.get(str(last_message.reply_to_message_id))
        return {
            "id": str(conversation.id),
            "type": conversation.conversation_type.value,
            "title": title,
            "consultation_id": str(conversation.consultation_id) if conversation.consultation_id else None,
            "class_id": str(conversation.class_id) if conversation.class_id else None,
            "participants": participants,
            "last_message": self.message_dict(last_message, (attachments_by_message or {}).get(str(last_message.id), []), reply_message) if last_message else None,
            "created_at": conversation.created_at,
            "updated_at": conversation.updated_at,
        }

    def message_dict(
        self,
        message: ChatMessage,
        attachments: list[ChatMessageAttachment] | None = None,
        reply_to_message: ChatMessage | None = None,
    ) -> dict[str, Any]:
        return {
            "id": str(message.id),
            "conversation_id": str(message.conversation_id),
            "sender_id": str(message.sender_id),
            "content": message.content,
            "message_type": message.message_type.value,
            "reply_to_message_id": str(message.reply_to_message_id) if message.reply_to_message_id else None,
            "reply_to_message": self._message_preview(reply_to_message) if reply_to_message else None,
            "is_read": bool(message.is_read),
            "read_at": message.read_at,
            "attachments": [self._attachment_dict(item) for item in attachments or []],
            "created_at": message.created_at,
        }

    def _get_conversation_for_user(self, conversation_id: str, current_user: User) -> Conversation:
        conversation = self.conversation_repo.get_with_participant(conversation_id, str(current_user.id))
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        return conversation

    def _resolve_conversation_for_message(self, current_user: User, payload: SendMessageRequest) -> Conversation:
        if payload.conversation_id:
            return self._get_conversation_for_user(payload.conversation_id, current_user)
        if payload.recipient_user_id:
            return self._get_or_create_direct_learning_conversation(current_user, payload.recipient_user_id, None)
        raise HTTPException(status_code=400, detail="Conversation or recipient is required")

    def _get_or_create_direct_learning_conversation(self, current_user: User, participant_user_id: str | None, class_id: str | None) -> Conversation:
        if not participant_user_id:
            raise HTTPException(status_code=400, detail="participant_user_id is required")
        if str(current_user.id) == str(participant_user_id):
            raise HTTPException(status_code=400, detail="Cannot chat with yourself")
        participant = self.user_repo.get_active_by_id(participant_user_id)
        if not participant:
            raise HTTPException(status_code=404, detail="Participant not found")
        current_roles = set(self.rbac.get_user_roles(str(current_user.id)))
        participant_roles = set(self.rbac.get_user_roles(str(participant.id)))
        if "teacher" in current_roles and "student" not in participant_roles:
            raise HTTPException(status_code=400, detail="Direct learning requires a student participant")
        if "student" in current_roles and "teacher" not in participant_roles:
            raise HTTPException(status_code=400, detail="Direct learning requires a teacher participant")
        if "teacher" not in current_roles and "student" not in current_roles:
            raise HTTPException(status_code=400, detail="Direct learning requires a teacher or student participant")
        shared_class_ids = self._user_class_ids(str(current_user.id)).intersection(self._user_class_ids(str(participant.id)))
        if class_id and class_id not in shared_class_ids:
            raise HTTPException(status_code=400, detail="Users do not share the specified class")
        shared_class_id = class_id or (sorted(shared_class_ids)[0] if shared_class_ids else None)
        if not shared_class_id:
            raise HTTPException(status_code=400, detail="Users do not share a class")
        existing = self.conversation_repo.get_by_class_id_and_type(shared_class_id, ConversationType.direct_learning)
        if existing:
            self._ensure_direct_learning_participants(existing, current_user, participant, shared_class_id)
            return existing
        conversation = self.conversation_repo.create(
            Conversation(
                conversation_type=ConversationType.direct_learning,
                class_id=shared_class_id,
                title=self._class_title(shared_class_id),
            )
        )
        self._upsert_participant(conversation, current_user, ParticipantRole.teacher if "teacher" in current_roles else ParticipantRole.student)
        self._upsert_participant(conversation, participant, ParticipantRole.student if "teacher" in current_roles else ParticipantRole.teacher)
        return conversation

    def _get_or_create_class_group_conversation(self, current_user: User, class_id: str | None) -> Conversation:
        if not class_id:
            raise HTTPException(status_code=400, detail="class_id is required")
        class_obj = self.class_repo.get_active_by_id(class_id)
        if not class_obj:
            raise HTTPException(status_code=404, detail="Class not found")
        teacher = self.teacher_repo.get_active_by_id(str(class_obj.teacher_id)) if class_obj.teacher_id else None
        if not teacher:
            raise HTTPException(status_code=400, detail="Class does not have a teacher")
        if str(teacher.user_id) != str(current_user.id) and "admin" not in self.rbac.get_user_roles(str(current_user.id)):
            raise HTTPException(status_code=403, detail="Only the class teacher can create the class group conversation")
        existing = self.conversation_repo.get_by_class_id_and_type(class_id, ConversationType.class_group)
        if existing:
            self._sync_class_group_participants(existing, class_obj, teacher)
            return existing
        conversation = self.conversation_repo.create(
            Conversation(
                conversation_type=ConversationType.class_group,
                class_id=class_id,
                title=class_obj.name,
            )
        )
        self._upsert_participant(conversation, self.user_repo.get_active_by_id(str(teacher.user_id)), ParticipantRole.teacher)
        self._sync_class_group_students(conversation, class_id)
        return conversation

    def _get_or_create_consultation_conversation(self, current_user: User, consultation_id: str | None) -> Conversation:
        if not consultation_id:
            raise HTTPException(status_code=400, detail="consultation_id is required")
        consultation = self.consultation_repo.get_active_by_id(consultation_id)
        if not consultation:
            raise HTTPException(status_code=404, detail="Consultation not found")
        customer_user_id = self._consultation_customer_user_id(consultation)
        allowed_users = {customer_user_id} if customer_user_id else set()
        if consultation.assigned_staff_id:
            allowed_users.add(str(consultation.assigned_staff_id))
        if str(current_user.id) not in allowed_users and not self.rbac.get_user_roles(str(current_user.id)).intersection(MANAGER_ROLES):
            raise HTTPException(status_code=403, detail="Permission denied")
        if consultation.conversation_id:
            existing = self.conversation_repo.get(consultation.conversation_id)
            if existing:
                self._sync_consultation_participants(existing, consultation)
                return existing
        if customer_user_id is None:
            raise HTTPException(status_code=400, detail="Consultation does not have a customer user")
        if consultation.assigned_staff_id is None and str(current_user.id) != customer_user_id:
            raise HTTPException(status_code=400, detail="Consultation does not have a consultant user")
        conversation = self.conversation_repo.create(
            Conversation(
                conversation_type=ConversationType.direct_consultation,
                consultation_id=str(consultation.id),
                title=consultation.customer_name or consultation.customer_email,
            )
        )
        self._sync_consultation_participants(conversation, consultation)
        consultation.conversation_id = str(conversation.id)
        self.consultation_repo.update(consultation)
        return conversation

    def _ensure_direct_learning_participants(self, conversation: Conversation, current_user: User, participant: User, class_id: str) -> None:
        current_participant = self.participant_repo.get_active_participant(str(conversation.id), str(current_user.id))
        if not current_participant:
            self._upsert_participant(conversation, current_user, self._participant_role_for_user(current_user, "teacher"))
        other_participant = self.participant_repo.get_active_participant(str(conversation.id), str(participant.id))
        if not other_participant:
            self._upsert_participant(conversation, participant, self._participant_role_for_user(participant, "student"))
        conversation.class_id = class_id
        conversation.conversation_type = ConversationType.direct_learning
        self.conversation_repo.update(conversation)

    def _sync_class_group_participants(self, conversation: Conversation, class_obj, teacher) -> None:
        teacher_user = self.user_repo.get_active_by_id(str(teacher.user_id))
        if teacher_user:
            self._upsert_participant(conversation, teacher_user, ParticipantRole.teacher)
        self._sync_class_group_students(conversation, str(class_obj.id))
        conversation.conversation_type = ConversationType.class_group
        conversation.class_id = str(class_obj.id)
        self.conversation_repo.update(conversation)

    def _sync_class_group_students(self, conversation: Conversation, class_id: str) -> None:
        rows = self.class_student_repo.list_with_student_user_by_class_id(class_id)
        active_student_ids = set()
        for _, student, user in rows:
            if student.enrollment_status in {ClassEnrollmentStatus.cancelled, ClassEnrollmentStatus.dropped}:
                continue
            active_student_ids.add(str(user.id))
            self._upsert_participant(conversation, user, ParticipantRole.student)
        for participant in self.participant_repo.list_active_participants(str(conversation.id)):
            if participant.participant_role == ParticipantRole.student and str(participant.user_id) not in active_student_ids:
                participant.left_at = _now()
                self.participant_repo.update(participant)

    def _sync_consultation_participants(self, conversation: Conversation, consultation: Consultation) -> None:
        customer_user_id = self._consultation_customer_user_id(consultation)
        if customer_user_id:
            customer = self.user_repo.get_active_by_id(customer_user_id)
            if customer:
                self._upsert_participant(conversation, customer, ParticipantRole.customer)
        if consultation.assigned_staff_id:
            consultant = self.user_repo.get_active_by_id(str(consultation.assigned_staff_id))
            if consultant:
                self._upsert_participant(conversation, consultant, ParticipantRole.consultant)
        conversation.conversation_type = ConversationType.direct_consultation
        conversation.consultation_id = str(consultation.id)
        self.conversation_repo.update(conversation)

    def _consultation_customer_user_id(self, consultation: Consultation) -> str | None:
        if consultation.user_id:
            return str(consultation.user_id)
        if consultation.student_id:
            student = self.student_repo.get_active_by_id(str(consultation.student_id))
            if student:
                return str(student.user_id)
        return None

    def _upsert_participant(self, conversation: Conversation, user: User | None, role: ParticipantRole) -> None:
        if not user:
            return
        participant = self.db.execute(
            select(ConversationParticipant).where(
                ConversationParticipant.conversation_id == conversation.id,
                ConversationParticipant.user_id == user.id,
            )
        ).scalar_one_or_none()
        if participant:
            participant.participant_role = role
            participant.left_at = None
            self.participant_repo.update(participant)
            return
        self.participant_repo.create(
            ConversationParticipant(
                conversation_id=str(conversation.id),
                user_id=str(user.id),
                participant_role=role,
                joined_at=_now(),
                left_at=None,
            )
        )

    def _participant_dict(self, participant: ConversationParticipant, user: User) -> dict[str, Any]:
        data = user_to_dict(user, include_meta=True)
        data["roles"] = self.rbac.get_user_roles(str(user.id))
        data["participant_role"] = participant.participant_role.value if participant.participant_role else None
        data["joined_at"] = participant.joined_at
        data["left_at"] = participant.left_at
        return data

    def _class_title(self, class_id: str) -> str | None:
        class_obj = self.class_repo.get_active_by_id(class_id)
        if not class_obj:
            return None
        return class_obj.name or class_obj.code

    def _participant_role_for_user(self, user: User, preferred: str) -> ParticipantRole:
        roles = set(self.rbac.get_user_roles(str(user.id)))
        if preferred == "teacher" and "teacher" in roles:
            return ParticipantRole.teacher
        if preferred == "student" and "student" in roles:
            return ParticipantRole.student
        if "teacher" in roles:
            return ParticipantRole.teacher
        if "student" in roles:
            return ParticipantRole.student
        raise HTTPException(status_code=400, detail="Invalid participant role")

    def _shared_class_id(self, user_a_id: str, user_b_id: str) -> str | None:
        classes_a = self._user_class_ids(user_a_id)
        classes_b = self._user_class_ids(user_b_id)
        shared = sorted(classes_a.intersection(classes_b))
        return shared[0] if shared else None

    def _user_class_ids(self, user_id: str) -> set[str]:
        class_ids: set[str] = set()
        student = self.student_repo.get_by_user_id(user_id)
        if student:
            class_ids.update(self.class_student_repo.list_class_ids_by_student_id(str(student.id)))
        teacher = self.teacher_repo.get_by_user_id(user_id)
        if teacher:
            class_ids.update(str(item.id) for item in self.class_repo.list_by_teacher_id(str(teacher.id)))
        return class_ids

    def _get_messages_by_ids(self, message_ids: list[str]) -> list[ChatMessage]:
        if not message_ids:
            return []
        return list(
            self.db.execute(
                select(ChatMessage).where(ChatMessage.id.in_(message_ids), ChatMessage.deleted_at.is_(None))
            ).scalars().all()
        )

    def _validate_reply_to_message(self, conversation: Conversation, reply_to_message_id: str | None) -> ChatMessage | None:
        if not reply_to_message_id:
            return None
        message = self.message_repo.get(reply_to_message_id)
        if not message or str(message.conversation_id) != str(conversation.id):
            raise HTTPException(status_code=400, detail="reply_to_message_id is invalid")
        return message

    def _mark_messages_read(self, conversation: Conversation, user_id: str) -> None:
        now_value = _now()
        for message in self.message_repo.list_messages_for_read(str(conversation.id), user_id):
            message.is_read = True
            message.read_at = now_value
            self.message_repo.update(message)

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
    def _message_preview(message: ChatMessage | None) -> dict[str, Any] | None:
        if not message:
            return None
        return {
            "id": str(message.id),
            "sender_id": str(message.sender_id),
            "content": message.content,
            "created_at": message.created_at,
        }

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
