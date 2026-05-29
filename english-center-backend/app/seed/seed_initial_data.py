from datetime import date, datetime, time, timedelta, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.attendance import Attendance, AttendanceStatus
from app.models.assignment import (
    Assignment,
    AssignmentGrade,
    AssignmentGradingMethod,
    AssignmentStatus,
    AssignmentSubmission,
    AssignmentSubmissionStatus,
    AssignmentType,
)
from app.models.class_model import ClassStatus, ClassType, CourseClass
from app.models.class_session import ClassSession, SessionMode, SessionStatus
from app.models.class_student import ClassEnrollmentStatus, ClassStudent
from app.core.security import hash_password
from app.models.course import (
    Course,
    CourseCategory,
    CourseMode,
    CourseModule,
    CourseRequirement,
    CourseOutcome,
    CourseStatus,
    CourseTag,
    CourseTagMapping,
    CourseTargetLevel,
    Lesson,
    LessonStatus,
)
from app.models import Permission, RolePermission, Role, UserRole, User, UserStatus
from app.models.room import Room, RoomStatus
from app.models.student import Student
from app.models.teacher import Teacher
from app.services.course_service import slugify

ROLES = ["admin", "staff", "teacher", "student"]
PERMISSIONS = [
    "admin.all",
    "user.create", "user.read", "user.update", "user.delete", "user.all",
    "student.create", "student.read", "student.update", "student.delete", "student.all",
    "teacher.create", "teacher.read", "teacher.update", "teacher.delete", "teacher.all",
    "staff.create", "staff.read", "staff.update", "staff.delete", "staff.all",
    "role.create", "role.read", "role.update", "role.delete", "role.all",
    "permission.create", "permission.read", "permission.update", "permission.delete", "permission.all",
    "course.create", "course.read", "course.update", "course.delete", "course.all",
    "course_category.create", "course_category.read", "course_category.update", "course_category.delete", "course_category.all",
    "course_tag.create", "course_tag.read", "course_tag.update", "course_tag.delete", "course_tag.all",
    "course_requirement.create", "course_requirement.read", "course_requirement.update", "course_requirement.delete", "course_requirement.all",
    "course_outcome.create", "course_outcome.read", "course_outcome.update", "course_outcome.delete", "course_outcome.all",
    "course_module.create", "course_module.read", "course_module.update", "course_module.delete", "course_module.all",
    "lesson.create", "lesson.read", "lesson.update", "lesson.delete", "lesson.all",
    "lesson_material.create", "lesson_material.read", "lesson_material.update", "lesson_material.delete", "lesson_material.all",
    "cart.create", "cart.read", "cart.update", "cart.delete", "cart.all",
    "wishlist.create", "wishlist.read", "wishlist.update", "wishlist.delete", "wishlist.all",
    "order.create", "order.read", "order.update", "order.delete", "order.all",
    "invoice.create", "invoice.read", "invoice.update", "invoice.delete", "invoice.all",
    "payment.create", "payment.read", "payment.update", "payment.delete", "payment.all",
    "sepay.create", "sepay.read", "sepay.update", "sepay.delete", "sepay.all",
    "class.create", "class.read", "class.update", "class.delete", "class.all",
    "class_student.create", "class_student.read", "class_student.update", "class_student.delete", "class_student.all",
    "room.create", "room.read", "room.update", "room.delete", "room.all",
    "class_session.create", "class_session.read", "class_session.update", "class_session.delete", "class_session.all",
    "attendance.create", "attendance.read", "attendance.update", "attendance.delete", "attendance.all",
    "attendance_report.read", "attendance_report.all",
    "assignment.create", "assignment.read", "assignment.update", "assignment.delete", "assignment.all",
    "assignment_attachment.create", "assignment_attachment.read", "assignment_attachment.update", "assignment_attachment.delete", "assignment_attachment.all",
    "assignment_submission.create", "assignment_submission.read", "assignment_submission.update", "assignment_submission.delete", "assignment_submission.all",
    "submission_attachment.create", "submission_attachment.read", "submission_attachment.update", "submission_attachment.delete", "submission_attachment.all",
    "assignment_grade.create", "assignment_grade.read", "assignment_grade.update", "assignment_grade.delete", "assignment_grade.all",
]

ROLE_PERMISSION_CODES = {
    "admin": ["admin.all"],
    "staff": [
        "student.all", "teacher.read", "staff.read", "user.read",
        "course.all", "course_category.all", "course_tag.all", "course_module.all", "lesson.all", "lesson_material.all",
        "cart.read", "wishlist.read", "order.all", "invoice.all", "payment.all", "sepay.read",
        "class.all", "class_student.all", "room.all", "class_session.all", "attendance.all", "attendance_report.all",
        "assignment.all", "assignment_attachment.all", "assignment_submission.read", "assignment_grade.read",
    ],
    "teacher": [
        "student.read", "teacher.read", "teacher.update",
        "course.read", "course_module.read", "lesson.read", "lesson_material.read",
        "lesson.update", "lesson_material.create", "lesson_material.update",
        "class.read", "class_student.read", "class_session.read", "attendance.create", "attendance.read", "attendance.update", "attendance_report.read",
        "assignment.create", "assignment.read", "assignment.update", "assignment.delete", "assignment_attachment.all",
        "assignment_submission.read", "assignment_grade.create", "assignment_grade.read", "assignment_grade.update",
    ],
    "student": [
        "student.read", "course.read", "course_module.read", "lesson.read", "lesson_material.read",
        "cart.all", "wishlist.all", "order.create", "order.read", "order.update", "invoice.read", "payment.create", "payment.read",
        "class.read", "class_student.read", "class_session.read", "attendance.read", "attendance_report.read",
        "assignment.read", "assignment_submission.create", "assignment_submission.read", "assignment_submission.update",
        "submission_attachment.create", "submission_attachment.read", "submission_attachment.delete", "assignment_grade.read",
    ],
}


ADMIN_EMAIL = "admin@example.com"
ADMIN_PASSWORD = "Admin@123"
ADMIN_FULL_NAME = "System Admin"

SAMPLE_CATEGORIES = ["IELTS", "TOEIC", "Giao tiếp", "Tiếng Anh trẻ em", "Business English"]
SAMPLE_TAGS = ["mất gốc", "luyện thi", "người đi làm", "online", "offline", "giao tiếp", "ngữ pháp", "từ vựng"]
SAMPLE_COURSES = [
    ("IELTS Foundation", "IELTS_FOUNDATION", CourseTargetLevel.a1, 12, 36, 4500000),
    ("TOEIC 650+", "TOEIC_650", CourseTargetLevel.b1, 10, 30, 3900000),
    ("English Communication Basic", "COMM_BASIC", CourseTargetLevel.a0, 8, 24, 3200000),
]
SAMPLE_ROOMS = [
    ("Room A101", 20, "Floor A1"),
    ("Room A102", 25, "Floor A1"),
    ("Room B201", 30, "Floor B2"),
]
SAMPLE_TEACHER_EMAIL = "teacher@example.com"
SAMPLE_TEACHER_PASSWORD = "Teacher@123"
SAMPLE_TEACHER_NAME = "Sample Teacher"


def seed_defaults(db: Session) -> None:
    roles: dict[str, Role] = {}
    for name in ROLES:
        role = db.execute(select(Role).where(Role.name == name, Role.deleted_at.is_(None))).scalar_one_or_none()
        if not role:
            role = Role(name=name)
            db.add(role)
            db.flush()
        roles[name] = role

    perms: dict[str, Permission] = {}
    for code in PERMISSIONS:
        perm = db.execute(select(Permission).where(Permission.code == code, Permission.deleted_at.is_(None))).scalar_one_or_none()
        if not perm:
            perm = Permission(code=code, name=code)
            db.add(perm)
            db.flush()
        perms[code] = perm

    for role_name, codes in ROLE_PERMISSION_CODES.items():
        role = roles[role_name]
        for code in codes:
            perm = perms[code]
            exists = db.execute(
                select(RolePermission).where(
                    RolePermission.role_id == role.id,
                    RolePermission.permission_id == perm.id,
                    RolePermission.deleted_at.is_(None),
                )
            ).scalar_one_or_none()
            if not exists:
                db.add(RolePermission(role_id=role.id, permission_id=perm.id))

    admin = db.execute(select(User).where(User.email == ADMIN_EMAIL, User.deleted_at.is_(None))).scalar_one_or_none()
    if not admin:
        admin = User(
            full_name=ADMIN_FULL_NAME,
            email=ADMIN_EMAIL,
            password_hash=hash_password(ADMIN_PASSWORD),
            status=UserStatus.active,
            is_verified=True,
        )
        db.add(admin)
        db.flush()

    admin_role = roles["admin"]
    rel = db.execute(
        select(UserRole).where(
            UserRole.user_id == admin.id,
            UserRole.role_id == admin_role.id,
            UserRole.deleted_at.is_(None),
        )
    ).scalar_one_or_none()
    if not rel:
        db.add(UserRole(user_id=admin.id, role_id=admin_role.id))

    seed_course_samples(db)
    seed_academic_samples(db, roles)
    seed_assignment_samples(db)
    db.commit()


def seed_course_samples(db: Session) -> None:
    categories: dict[str, CourseCategory] = {}
    for name in SAMPLE_CATEGORIES:
        category = db.execute(
            select(CourseCategory).where(CourseCategory.name == name, CourseCategory.deleted_at.is_(None))
        ).scalar_one_or_none()
        if not category:
            category = CourseCategory(name=name, slug=slugify(name))
            db.add(category)
            db.flush()
        categories[name] = category

    tags: dict[str, CourseTag] = {}
    for name in SAMPLE_TAGS:
        tag = db.execute(select(CourseTag).where(CourseTag.name == name, CourseTag.deleted_at.is_(None))).scalar_one_or_none()
        if not tag:
            tag = CourseTag(name=name, slug=slugify(name))
            db.add(tag)
            db.flush()
        tags[name] = tag

    default_category = categories["IELTS"]
    default_tags = [tags["luyện thi"], tags["online"]]
    for course_name, code, level, duration, sessions, price in SAMPLE_COURSES:
        course = db.execute(select(Course).where(Course.code == code, Course.deleted_at.is_(None))).scalar_one_or_none()
        if not course:
            course = Course(
                name=course_name,
                code=code,
                slug=slugify(course_name),
                category_id=default_category.id,
                mode=CourseMode.center,
                target_level=level,
                duration_weeks=duration,
                total_sessions=sessions,
                price=price,
                status=CourseStatus.active,
            )
            db.add(course)
            db.flush()
        elif not course.category_id:
            course.category_id = default_category.id

        for tag in default_tags:
            tag_exists = db.execute(
                select(CourseTagMapping).where(
                    CourseTagMapping.course_id == course.id,
                    CourseTagMapping.tag_id == tag.id,
                    CourseTagMapping.deleted_at.is_(None),
                )
            ).scalar_one_or_none()
            if not tag_exists:
                db.add(CourseTagMapping(course_id=course.id, tag_id=tag.id))

        if not db.execute(select(CourseRequirement).where(CourseRequirement.course_id == course.id)).first():
            db.add_all(
                [
                    CourseRequirement(course_id=course.id, requirement_text="Hoàn thành bài kiểm tra đầu vào", order_index=0),
                    CourseRequirement(course_id=course.id, requirement_text="Có thời gian học tối thiểu 3 buổi mỗi tuần", order_index=1),
                ]
            )

        if not db.execute(select(CourseOutcome).where(CourseOutcome.course_id == course.id)).first():
            db.add_all(
                [
                    CourseOutcome(course_id=course.id, outcome_text="Nắm vững nền tảng kỹ năng chính", order_index=0),
                    CourseOutcome(course_id=course.id, outcome_text="Sẵn sàng học lên cấp độ tiếp theo", order_index=1),
                ]
            )

        existing_modules = list(
            db.execute(select(CourseModule).where(CourseModule.course_id == course.id, CourseModule.deleted_at.is_(None))).scalars().all()
        )
        if not existing_modules:
            for module_index in range(2):
                module = CourseModule(
                    course_id=course.id,
                    title=f"Module {module_index + 1}",
                    description=f"Nội dung chương {module_index + 1}",
                    order_index=module_index,
                )
                db.add(module)
                db.flush()
                for lesson_index in range(2):
                    db.add(
                        Lesson(
                            course_id=course.id,
                            module_id=module.id,
                            title=f"Lesson {lesson_index + 1}: Introduction",
                            description="Bài học mẫu",
                            order_index=lesson_index,
                            estimated_duration_minutes=90,
                            status=LessonStatus.published,
                        )
                    )


def _now() -> datetime:
    return datetime.now(timezone.utc)


def seed_academic_samples(db: Session, roles: dict[str, Role]) -> None:
    rooms: dict[str, Room] = {}
    for name, capacity, location in SAMPLE_ROOMS:
        room = db.execute(select(Room).where(Room.name == name, Room.deleted_at.is_(None))).scalar_one_or_none()
        if not room:
            room = Room(name=name, capacity=capacity, location=location, status=RoomStatus.active)
            db.add(room)
            db.flush()
        rooms[name] = room

    teacher_user = db.execute(select(User).where(User.email == SAMPLE_TEACHER_EMAIL, User.deleted_at.is_(None))).scalar_one_or_none()
    if not teacher_user:
        teacher_user = User(
            full_name=SAMPLE_TEACHER_NAME,
            email=SAMPLE_TEACHER_EMAIL,
            password_hash=hash_password(SAMPLE_TEACHER_PASSWORD),
            status=UserStatus.active,
            is_verified=True,
        )
        db.add(teacher_user)
        db.flush()
    teacher_role = roles["teacher"]
    teacher_role_rel = db.execute(
        select(UserRole).where(
            UserRole.user_id == teacher_user.id,
            UserRole.role_id == teacher_role.id,
            UserRole.deleted_at.is_(None),
        )
    ).scalar_one_or_none()
    if not teacher_role_rel:
        db.add(UserRole(user_id=teacher_user.id, role_id=teacher_role.id))
        db.flush()

    teacher_profile = db.execute(select(Teacher).where(Teacher.user_id == teacher_user.id, Teacher.deleted_at.is_(None))).scalar_one_or_none()
    if not teacher_profile:
        teacher_profile = Teacher(user_id=teacher_user.id, specialization="IELTS", experience_years=3)
        db.add(teacher_profile)
        db.flush()

    ielts_course = db.execute(select(Course).where(Course.code == "IELTS_FOUNDATION", Course.deleted_at.is_(None))).scalar_one_or_none()
    toeic_course = db.execute(select(Course).where(Course.code == "TOEIC_650", Course.deleted_at.is_(None))).scalar_one_or_none()
    if not ielts_course or not toeic_course:
        return

    ielts_class = db.execute(
        select(CourseClass).where(CourseClass.name == "IELTS Foundation T2/T4 Evening", CourseClass.deleted_at.is_(None))
    ).scalar_one_or_none()
    if not ielts_class:
        ielts_class = CourseClass(
            course_id=ielts_course.id,
            teacher_id=teacher_profile.id,
            name="IELTS Foundation T2/T4 Evening",
            code="CLS-IELTS-202606-001",
            class_type=ClassType.offline,
            max_students=20,
            start_date=date(2026, 6, 1),
            end_date=date(2026, 8, 30),
            status=ClassStatus.ongoing,
        )
        db.add(ielts_class)
        db.flush()

    toeic_class = db.execute(
        select(CourseClass).where(CourseClass.name == "TOEIC 650 Weekend", CourseClass.deleted_at.is_(None))
    ).scalar_one_or_none()
    if not toeic_class:
        toeic_class = CourseClass(
            course_id=toeic_course.id,
            teacher_id=teacher_profile.id,
            name="TOEIC 650 Weekend",
            code="CLS-TOEIC-202606-001",
            class_type=ClassType.hybrid,
            max_students=25,
            start_date=date(2026, 6, 7),
            end_date=date(2026, 8, 16),
            status=ClassStatus.planned,
        )
        db.add(toeic_class)
        db.flush()

    lesson_rows = list(
        db.execute(
            select(Lesson)
            .where(Lesson.course_id == ielts_course.id, Lesson.deleted_at.is_(None))
            .order_by(Lesson.order_index.asc(), Lesson.created_at.asc())
        ).scalars().all()
    )
    session_payloads = [
        ("Buổi 1: Introduction", date(2026, 6, 1), time(18, 0), time(20, 0), lesson_rows[0].id if len(lesson_rows) > 0 else None),
        ("Buổi 2: Grammar Foundation", date(2026, 6, 3), time(18, 0), time(20, 0), lesson_rows[1].id if len(lesson_rows) > 1 else None),
        ("Buổi 3: Listening Practice", date(2026, 6, 8), time(18, 0), time(20, 0), lesson_rows[2].id if len(lesson_rows) > 2 else None),
    ]
    for title, session_date, start_time, end_time, lesson_id in session_payloads:
        exists = db.execute(
            select(ClassSession).where(
                ClassSession.class_id == ielts_class.id,
                ClassSession.title == title,
                ClassSession.deleted_at.is_(None),
            )
        ).scalar_one_or_none()
        if not exists:
            db.add(
                ClassSession(
                    class_id=ielts_class.id,
                    teacher_id=teacher_profile.id,
                    lesson_id=lesson_id,
                    room_id=rooms["Room A101"].id,
                    title=title,
                    session_date=session_date,
                    start_time=start_time,
                    end_time=end_time,
                    mode=SessionMode.offline,
                    status=SessionStatus.scheduled,
                )
            )
    db.flush()

    students = list(db.execute(select(Student).where(Student.deleted_at.is_(None))).scalars().all())
    if not students:
        return

    class_students: list[ClassStudent] = []
    for student in students[:3]:
        mapping = db.execute(
            select(ClassStudent).where(
                ClassStudent.class_id == ielts_class.id,
                ClassStudent.student_id == student.id,
                ClassStudent.deleted_at.is_(None),
            )
        ).scalar_one_or_none()
        if not mapping:
            mapping = ClassStudent(
                class_id=ielts_class.id,
                student_id=student.id,
                enrollment_status=ClassEnrollmentStatus.enrolled,
                enrolled_at=_now(),
                note="Seeded student in class",
            )
            db.add(mapping)
            db.flush()
        class_students.append(mapping)

    first_session = db.execute(
        select(ClassSession).where(ClassSession.class_id == ielts_class.id, ClassSession.deleted_at.is_(None)).order_by(ClassSession.session_date.asc())
    ).scalars().first()
    if not first_session:
        return
    sample_statuses = [AttendanceStatus.present, AttendanceStatus.absent, AttendanceStatus.late]
    for index, mapping in enumerate(class_students):
        exists = db.execute(
            select(Attendance).where(
                Attendance.session_id == first_session.id,
                Attendance.student_id == mapping.student_id,
                Attendance.deleted_at.is_(None),
            )
        ).scalar_one_or_none()
        if not exists:
            db.add(
                Attendance(
                    session_id=first_session.id,
                    class_id=ielts_class.id,
                    student_id=mapping.student_id,
                    status=sample_statuses[index % len(sample_statuses)],
                    recorded_by=teacher_user.id,
                    recorded_at=_now(),
                )
            )


def seed_assignment_samples(db: Session) -> None:
    class_obj = db.execute(
        select(CourseClass).where(CourseClass.name == "IELTS Foundation T2/T4 Evening", CourseClass.deleted_at.is_(None))
    ).scalar_one_or_none()
    if not class_obj:
        return
    teacher_user = db.execute(select(User).where(User.email == SAMPLE_TEACHER_EMAIL, User.deleted_at.is_(None))).scalar_one_or_none()
    if not teacher_user:
        return
    sessions = list(
        db.execute(
            select(ClassSession)
            .where(ClassSession.class_id == class_obj.id, ClassSession.deleted_at.is_(None))
            .order_by(ClassSession.session_date.asc())
        ).scalars().all()
    )
    lesson = None
    if sessions and sessions[-1].lesson_id:
        lesson = db.execute(select(Lesson).where(Lesson.id == sessions[-1].lesson_id, Lesson.deleted_at.is_(None))).scalar_one_or_none()

    writing = db.execute(
        select(Assignment).where(Assignment.class_id == class_obj.id, Assignment.title == "Writing Task 1 Homework", Assignment.deleted_at.is_(None))
    ).scalar_one_or_none()
    if not writing:
        writing = Assignment(
            class_id=class_obj.id,
            session_id=sessions[-1].id if sessions else None,
            lesson_id=lesson.id if lesson else None,
            title="Writing Task 1 Homework",
            description="Write a short line graph report",
            instruction="Write at least 150 words.",
            assignment_type=AssignmentType.writing,
            status=AssignmentStatus.published,
            max_score=10,
            due_at=(_now() + timedelta(days=7)).replace(microsecond=0),
            allow_late_submission=True,
            created_by=teacher_user.id,
        )
        db.add(writing)
        db.flush()

    vocabulary = db.execute(
        select(Assignment).where(Assignment.class_id == class_obj.id, Assignment.title == "Vocabulary Practice", Assignment.deleted_at.is_(None))
    ).scalar_one_or_none()
    if not vocabulary:
        vocabulary = Assignment(
            class_id=class_obj.id,
            title="Vocabulary Practice",
            description="Practice key words from the latest lesson",
            assignment_type=AssignmentType.vocabulary,
            status=AssignmentStatus.published,
            max_score=10,
            allow_late_submission=True,
            created_by=teacher_user.id,
        )
        db.add(vocabulary)
        db.flush()

    class_student = db.execute(
        select(ClassStudent).where(ClassStudent.class_id == class_obj.id, ClassStudent.deleted_at.is_(None))
    ).scalars().first()
    if not class_student:
        return
    student = db.execute(select(Student).where(Student.id == class_student.student_id, Student.deleted_at.is_(None))).scalar_one_or_none()
    if not student:
        return
    submission = db.execute(
        select(AssignmentSubmission).where(
            AssignmentSubmission.assignment_id == writing.id,
            AssignmentSubmission.student_id == student.id,
            AssignmentSubmission.deleted_at.is_(None),
        )
    ).scalar_one_or_none()
    if not submission:
        submission = AssignmentSubmission(
            assignment_id=writing.id,
            student_id=student.id,
            user_id=student.user_id,
            content="This is a sample writing submission.",
            status=AssignmentSubmissionStatus.submitted,
            submitted_at=_now(),
            is_late=False,
            attempt_number=1,
        )
        db.add(submission)
        db.flush()

    grade = db.execute(
        select(AssignmentGrade).where(AssignmentGrade.submission_id == submission.id, AssignmentGrade.deleted_at.is_(None))
    ).scalar_one_or_none()
    if not grade:
        db.add(
            AssignmentGrade(
                submission_id=submission.id,
                assignment_id=writing.id,
                student_id=student.id,
                score=8,
                max_score=writing.max_score,
                feedback="Good structure. Review grammar accuracy.",
                grading_method=AssignmentGradingMethod.teacher,
                graded_by=teacher_user.id,
                graded_at=_now(),
            )
        )
        submission.status = AssignmentSubmissionStatus.graded


if __name__ == "__main__":
    from app.db.session import SessionLocal

    db = SessionLocal()
    try:
        seed_defaults(db)
        print("Seed completed")
    finally:
        db.close()
