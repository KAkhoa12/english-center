from sqlalchemy import and_, func, or_, select
from sqlalchemy.orm import Session

from app.models import StaffProfile, Teacher, User
from app.models.chat import ChatMessage, ChatMessageAttachment, Conversation, ConversationParticipant, ConversationType
from app.models.class_model import CourseClass
from app.models.class_student import ClassEnrollmentStatus, ClassStudent
from app.models.rbac.role import Role, UserRole
from app.models.student import Student
from app.repositories.base import BaseRepository


class ConversationRepository(BaseRepository[Conversation]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, Conversation)

    def get_with_participant(self, conversation_id: str, user_id: str) -> Conversation | None:
        return self.db.execute(
            select(Conversation)
            .join(ConversationParticipant, ConversationParticipant.conversation_id == Conversation.id)
            .where(
                Conversation.id == conversation_id,
                Conversation.deleted_at.is_(None),
                ConversationParticipant.user_id == user_id,
                ConversationParticipant.deleted_at.is_(None),
            )
        ).scalar_one_or_none()

    def get_direct_between_users(self, user_a_id: str, user_b_id: str) -> Conversation | None:
        participant_a = select(ConversationParticipant.conversation_id).where(
            ConversationParticipant.user_id == user_a_id,
            ConversationParticipant.deleted_at.is_(None),
        )
        participant_b = select(ConversationParticipant.conversation_id).where(
            ConversationParticipant.user_id == user_b_id,
            ConversationParticipant.deleted_at.is_(None),
        )
        return self.db.execute(
            select(Conversation)
            .where(
                Conversation.id.in_(participant_a),
                Conversation.id.in_(participant_b),
                Conversation.type == ConversationType.direct,
                Conversation.deleted_at.is_(None),
            )
            .order_by(Conversation.updated_at.desc())
        ).scalars().first()

    def list_for_user(self, user_id: str) -> list[Conversation]:
        return list(
            self.db.execute(
                select(Conversation)
                .join(ConversationParticipant, ConversationParticipant.conversation_id == Conversation.id)
                .where(
                    ConversationParticipant.user_id == user_id,
                    ConversationParticipant.deleted_at.is_(None),
                    Conversation.deleted_at.is_(None),
                )
                .order_by(Conversation.updated_at.desc())
            ).scalars().all()
        )


class ConversationParticipantRepository(BaseRepository[ConversationParticipant]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, ConversationParticipant)

    def list_user_ids(self, conversation_id: str) -> list[str]:
        return [str(item) for item in self.db.execute(
            select(ConversationParticipant.user_id).where(
                ConversationParticipant.conversation_id == conversation_id,
                ConversationParticipant.deleted_at.is_(None),
            )
        ).scalars().all()]

    def list_users(self, conversation_id: str) -> list[User]:
        return list(
            self.db.execute(
                select(User)
                .join(ConversationParticipant, ConversationParticipant.user_id == User.id)
                .where(
                    ConversationParticipant.conversation_id == conversation_id,
                    ConversationParticipant.deleted_at.is_(None),
                    User.deleted_at.is_(None),
                )
                .order_by(User.full_name.asc())
            ).scalars().all()
        )


class ChatMessageRepository(BaseRepository[ChatMessage]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, ChatMessage)

    def list_by_conversation(self, conversation_id: str, limit: int = 50, before_id: str | None = None) -> list[ChatMessage]:
        stmt = select(ChatMessage).where(
            ChatMessage.conversation_id == conversation_id,
            ChatMessage.deleted_at.is_(None),
        )
        if before_id:
            before = self.get(before_id)
            if before:
                stmt = stmt.where(ChatMessage.created_at < before.created_at)
        rows = self.db.execute(stmt.order_by(ChatMessage.created_at.desc()).limit(limit)).scalars().all()
        return list(reversed(rows))

    def get_last_by_conversation_ids(self, conversation_ids: list[str]) -> dict[str, ChatMessage]:
        if not conversation_ids:
            return {}
        subq = (
            select(
                ChatMessage.conversation_id,
                func.max(ChatMessage.created_at).label("last_created_at"),
            )
            .where(ChatMessage.conversation_id.in_(conversation_ids), ChatMessage.deleted_at.is_(None))
            .group_by(ChatMessage.conversation_id)
            .subquery()
        )
        rows = self.db.execute(
            select(ChatMessage)
            .join(
                subq,
                and_(
                    ChatMessage.conversation_id == subq.c.conversation_id,
                    ChatMessage.created_at == subq.c.last_created_at,
                ),
            )
        ).scalars().all()
        return {str(item.conversation_id): item for item in rows}


class ChatAttachmentRepository(BaseRepository[ChatMessageAttachment]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, ChatMessageAttachment)

    def list_by_message_ids(self, message_ids: list[str]) -> dict[str, list[ChatMessageAttachment]]:
        if not message_ids:
            return {}
        rows = self.db.execute(
            select(ChatMessageAttachment).where(
                ChatMessageAttachment.message_id.in_(message_ids),
                ChatMessageAttachment.deleted_at.is_(None),
            )
        ).scalars().all()
        grouped: dict[str, list[ChatMessageAttachment]] = {}
        for row in rows:
            grouped.setdefault(str(row.message_id), []).append(row)
        return grouped


class ChatContactRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_roles_by_user_ids(self, user_ids: list[str]) -> dict[str, list[str]]:
        if not user_ids:
            return {}
        rows = self.db.execute(
            select(UserRole.user_id, Role.name)
            .join(Role, Role.id == UserRole.role_id)
            .where(UserRole.user_id.in_(user_ids), UserRole.deleted_at.is_(None), Role.deleted_at.is_(None))
        ).all()
        result: dict[str, list[str]] = {}
        for user_id, role_name in rows:
            result.setdefault(str(user_id), []).append(role_name)
        return result

    def list_manager_users(self) -> list[User]:
        rows = self.db.execute(
            select(User)
            .join(UserRole, UserRole.user_id == User.id)
            .join(Role, Role.id == UserRole.role_id)
            .where(
                Role.name.in_(["admin", "staff", "manager"]),
                User.deleted_at.is_(None),
                UserRole.deleted_at.is_(None),
                Role.deleted_at.is_(None),
            )
            .order_by(User.full_name.asc())
        ).scalars().all()
        managers: dict[str, User] = {}
        for user in rows:
            managers.setdefault(str(user.id), user)
        return list(managers.values())

    def list_all_student_users(self) -> list[tuple[User, list[str]]]:
        rows = self.db.execute(
            select(User, CourseClass.id)
            .join(Student, Student.user_id == User.id)
            .outerjoin(ClassStudent, ClassStudent.student_id == Student.id)
            .outerjoin(CourseClass, CourseClass.id == ClassStudent.class_id)
            .where(User.deleted_at.is_(None), Student.deleted_at.is_(None))
            .order_by(User.full_name.asc())
        ).all()
        return self._group_user_class_rows(rows)

    def list_student_contacts_for_teacher(self, teacher_user_id: str) -> list[tuple[User, list[str]]]:
        rows = self.db.execute(
            select(User, CourseClass.id)
            .join(Student, Student.user_id == User.id)
            .join(ClassStudent, ClassStudent.student_id == Student.id)
            .join(CourseClass, CourseClass.id == ClassStudent.class_id)
            .join(Teacher, Teacher.id == CourseClass.teacher_id)
            .where(
                Teacher.user_id == teacher_user_id,
                User.deleted_at.is_(None),
                Student.deleted_at.is_(None),
                ClassStudent.deleted_at.is_(None),
                ClassStudent.enrollment_status.notin_([ClassEnrollmentStatus.cancelled, ClassEnrollmentStatus.dropped]),
                CourseClass.deleted_at.is_(None),
            )
            .order_by(User.full_name.asc())
        ).all()
        return self._group_user_class_rows(rows)

    def list_contacts_for_student(self, student_user_id: str) -> list[tuple[User, str, list[str]]]:
        student = self.db.execute(
            select(Student).where(Student.user_id == student_user_id, Student.deleted_at.is_(None))
        ).scalar_one_or_none()
        if not student:
            return []
        class_ids = select(ClassStudent.class_id).where(
            ClassStudent.student_id == student.id,
            ClassStudent.deleted_at.is_(None),
            ClassStudent.enrollment_status.notin_([ClassEnrollmentStatus.cancelled, ClassEnrollmentStatus.dropped]),
        )

        teacher_rows = self.db.execute(
            select(User, CourseClass.id)
            .join(Teacher, Teacher.user_id == User.id)
            .join(CourseClass, CourseClass.teacher_id == Teacher.id)
            .where(
                CourseClass.id.in_(class_ids),
                CourseClass.deleted_at.is_(None),
                Teacher.deleted_at.is_(None),
                User.deleted_at.is_(None),
            )
            .order_by(User.full_name.asc())
        ).all()
        classmate_rows = self.db.execute(
            select(User, CourseClass.id)
            .join(Student, Student.user_id == User.id)
            .join(ClassStudent, ClassStudent.student_id == Student.id)
            .join(CourseClass, CourseClass.id == ClassStudent.class_id)
            .where(
                CourseClass.id.in_(class_ids),
                User.id != student_user_id,
                User.deleted_at.is_(None),
                Student.deleted_at.is_(None),
                ClassStudent.deleted_at.is_(None),
                ClassStudent.enrollment_status.notin_([ClassEnrollmentStatus.cancelled, ClassEnrollmentStatus.dropped]),
            )
            .order_by(User.full_name.asc())
        ).all()

        contacts: dict[str, tuple[User, str, set[str]]] = {}
        for user, class_id in teacher_rows:
            contacts.setdefault(str(user.id), (user, "teacher", set()))[2].add(str(class_id))
        for user, class_id in classmate_rows:
            contacts.setdefault(str(user.id), (user, "student", set()))[2].add(str(class_id))
        return [(user, contact_type, sorted(class_ids)) for user, contact_type, class_ids in contacts.values()]

    def are_users_connected_by_class(self, user_a_id: str, user_b_id: str) -> bool:
        class_ids_a = self._student_class_ids(user_a_id)
        class_ids_b = self._student_class_ids(user_b_id)
        if class_ids_a and class_ids_b and class_ids_a.intersection(class_ids_b):
            return True
        teacher_a = self.db.execute(select(Teacher).where(Teacher.user_id == user_a_id, Teacher.deleted_at.is_(None))).scalar_one_or_none()
        teacher_b = self.db.execute(select(Teacher).where(Teacher.user_id == user_b_id, Teacher.deleted_at.is_(None))).scalar_one_or_none()
        if teacher_a and class_ids_b and self._teacher_class_ids(str(teacher_a.id)).intersection(class_ids_b):
            return True
        if teacher_b and class_ids_a and self._teacher_class_ids(str(teacher_b.id)).intersection(class_ids_a):
            return True
        return False

    def _student_class_ids(self, user_id: str) -> set[str]:
        student = self.db.execute(select(Student).where(Student.user_id == user_id, Student.deleted_at.is_(None))).scalar_one_or_none()
        if not student:
            return set()
        return {str(item) for item in self.db.execute(
            select(ClassStudent.class_id).where(
                ClassStudent.student_id == student.id,
                ClassStudent.deleted_at.is_(None),
                ClassStudent.enrollment_status.notin_([ClassEnrollmentStatus.cancelled, ClassEnrollmentStatus.dropped]),
            )
        ).scalars().all()}

    def _teacher_class_ids(self, teacher_id: str) -> set[str]:
        return {str(item) for item in self.db.execute(
            select(CourseClass.id).where(CourseClass.teacher_id == teacher_id, CourseClass.deleted_at.is_(None))
        ).scalars().all()}

    @staticmethod
    def _group_user_class_rows(rows) -> list[tuple[User, list[str]]]:
        grouped: dict[str, tuple[User, set[str]]] = {}
        for user, class_id in rows:
            current = grouped.setdefault(str(user.id), (user, set()))
            if class_id:
                current[1].add(str(class_id))
        return [(user, sorted(class_ids)) for user, class_ids in grouped.values()]
