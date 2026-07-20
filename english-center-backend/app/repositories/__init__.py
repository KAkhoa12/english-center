from app.repositories.assignment import AssignmentRepository
from app.repositories.assignment_attachment import AssignmentAttachmentRepository
from app.repositories.assignment_grade import AssignmentGradeRepository
from app.repositories.assignment_submission import AssignmentSubmissionRepository
from app.repositories.assignment_type import AssignmentTypeRepository
from app.repositories.assignment_question import AssignmentQuestionRepository, AssignmentQuestionOptionRepository
from app.repositories.attendance import AttendanceRepository
from app.repositories.base import BaseRepository
from app.repositories.wishlist import CourseWishlistRepository
from app.repositories.course_enrollment import CourseEnrollmentRepository
from app.repositories.course_media import CourseMediaRepository
from app.repositories.course import CourseRepository
from app.repositories.course_category import CourseCategoryRepository
from app.repositories.course_class import CourseClassRepository
from app.repositories.class_session import ClassSessionRepository
from app.repositories.class_student import ClassStudentRepository
from app.repositories.consultation import ConsultationRepository
from app.repositories.media import MediaRepository
from app.repositories.order import OrderItemRepository, OrderRepository
from app.repositories.payment import PaymentRepository
from app.repositories.permission import PermissionRepository
from app.repositories.room import RoomRepository
from app.repositories.staff import StaffRepository
from app.repositories.student import StudentRepository
from app.repositories.submission_attachment import SubmissionAttachmentRepository
from app.repositories.submission_answer import SubmissionAnswerRepository, SubmissionAnswerMediaRepository
from app.repositories.teacher import TeacherRepository
from app.repositories.user import UserRepository
from app.repositories.role import RoleRepository
from app.repositories.role_permission import RolePermissionRepository
from app.repositories.user_role import UserRoleRepository


__all__ = [
    "AssignmentAttachmentRepository",
    "AssignmentGradeRepository",
    "AssignmentRepository",
    "AssignmentSubmissionRepository",
    "AssignmentTypeRepository",
    "AssignmentQuestionRepository",
    "AssignmentQuestionOptionRepository",
    "AttendanceRepository",
    "BaseRepository",
    "CourseCategoryRepository",
    "CourseClassRepository",
    "ClassSessionRepository",
    "ClassStudentRepository",
    "CourseEnrollmentRepository",
    "CourseMediaRepository",
    "CourseRepository",
    "CourseWishlistRepository",
    "ConsultationRepository",
    "MediaRepository",
    "OrderItemRepository",
    "OrderRepository",
    "PaymentRepository",
    "PermissionRepository",
    "RoomRepository",
    "StaffRepository",
    "StudentRepository",
    "SubmissionAttachmentRepository",
    "SubmissionAnswerRepository",
    "SubmissionAnswerMediaRepository",
    "TeacherRepository",
    "UserRepository",
    "RoleRepository",
    "RolePermissionRepository",
    "UserRoleRepository",
]
