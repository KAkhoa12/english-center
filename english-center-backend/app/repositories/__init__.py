from app.repositories.assignment import AssignmentRepository
from app.repositories.assignment_attachment import AssignmentAttachmentRepository
from app.repositories.assignment_grade import AssignmentGradeRepository
from app.repositories.assignment_submission import AssignmentSubmissionRepository
from app.repositories.attendance import AttendanceRepository
from app.repositories.base import BaseRepository
from app.repositories.cart import CartItemRepository, CartRepository, CourseWishlistRepository
from app.repositories.course_enrollment import CourseEnrollmentRepository
from app.repositories.course_media import CourseMediaRepository
from app.repositories.course import CourseRepository
from app.repositories.course_category import CourseCategoryRepository
from app.repositories.course_class import CourseClassRepository
from app.repositories.class_session import ClassSessionRepository
from app.repositories.class_student import ClassStudentRepository
from app.repositories.course_module import CourseModuleRepository
from app.repositories.course_outcome import CourseOutcomeRepository
from app.repositories.course_requirement import CourseRequirementRepository
from app.repositories.course_tag import CourseTagRepository
from app.repositories.course_tag_mapping import CourseTagMappingRepository
from app.repositories.invoice import InvoiceItemRepository, InvoiceRepository
from app.repositories.lesson import LessonRepository
from app.repositories.lesson_material import LessonMaterialRepository
from app.repositories.media import MediaRepository
from app.repositories.order import OrderItemRepository, OrderRepository
from app.repositories.payment import PaymentRepository, SePayIPNLogRepository
from app.repositories.permission import PermissionRepository
from app.repositories.room import RoomRepository
from app.repositories.staff import StaffRepository
from app.repositories.student import StudentRepository
from app.repositories.submission_attachment import SubmissionAttachmentRepository
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
    "AttendanceRepository",
    "BaseRepository",
    "CartItemRepository",
    "CartRepository",
    "CourseCategoryRepository",
    "CourseClassRepository",
    "ClassSessionRepository",
    "ClassStudentRepository",
    "CourseEnrollmentRepository",
    "CourseMediaRepository",
    "CourseModuleRepository",
    "CourseOutcomeRepository",
    "CourseRepository",
    "CourseRequirementRepository",
    "CourseTagMappingRepository",
    "CourseTagRepository",
    "CourseWishlistRepository",
    "InvoiceItemRepository",
    "InvoiceRepository",
    "LessonMaterialRepository",
    "LessonRepository",
    "MediaRepository",
    "OrderItemRepository",
    "OrderRepository",
    "PaymentRepository",
    "PermissionRepository",
    "RoomRepository",
    "SePayIPNLogRepository",
    "StaffRepository",
    "StudentRepository",
    "SubmissionAttachmentRepository",
    "TeacherRepository",
    "UserRepository",
    "RoleRepository",
    "RolePermissionRepository",
    "UserRoleRepository",
]
