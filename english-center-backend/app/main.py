from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import (
    attendance,
    attendance_reports,
    ai_chat,
    assignment_attachments,
    assignment_grades,
    assignment_question_options,
    assignment_questions,
    assignment_types,
    assignments,
    auth,
    cart,
    chat,
    class_session_media,
    class_sessions,
    classes,
    course_categories,
    course_modules,
    course_tags,
    courses,
    enrollments,
    files,
    invoices,
    lesson_materials,
    lessons,
    orders,
    payments,
    permissions,
    roles,
    rooms,
    staff,
    students,
    submission_attachments,
    submission_answers,
    submissions,
    teachers,
    users,
    wishlist,
)
from app.core.config import settings
from app.core.response import api_response, error_response
from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.middlewares.auth_token_middleware import AccessTokenValidationMiddleware
from app.seed.seed_initial_data import seed_defaults

app = FastAPI(title=settings.APP_NAME)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(
    AccessTokenValidationMiddleware,
    excluded_paths={
        "/",
        "/docs",
        "/docs/oauth2-redirect",
        "/redoc",
        "/openapi.json",
        f"{settings.API_V1_PREFIX}/auth/login",
        f"{settings.API_V1_PREFIX}/auth/register",
        f"{settings.API_V1_PREFIX}/auth/refresh",
        f"{settings.API_V1_PREFIX}/payments/sepay/ipn",
    },
)


@app.on_event("startup")
def create_tables_and_seed_on_startup() -> None:
    # Auto-create missing tables for local/dev runs.
    # Base.metadata.create_all(bind=engine)

    # Seed default roles/permissions and ensure admin has privileges.
    db = SessionLocal()
    try:
        seed_defaults(db)
    finally:
        db.close()


app.include_router(auth.router, prefix=settings.API_V1_PREFIX)
app.include_router(users.router, prefix=settings.API_V1_PREFIX)
app.include_router(roles.router, prefix=settings.API_V1_PREFIX)
app.include_router(permissions.router, prefix=settings.API_V1_PREFIX)
app.include_router(students.router, prefix=settings.API_V1_PREFIX)
app.include_router(teachers.router, prefix=settings.API_V1_PREFIX)
app.include_router(staff.router, prefix=settings.API_V1_PREFIX)
app.include_router(files.router, prefix=settings.API_V1_PREFIX)
app.include_router(cart.router, prefix=settings.API_V1_PREFIX)
app.include_router(chat.router, prefix=settings.API_V1_PREFIX)
app.include_router(ai_chat.router, prefix=settings.API_V1_PREFIX)
app.include_router(wishlist.router, prefix=settings.API_V1_PREFIX)
app.include_router(orders.router, prefix=settings.API_V1_PREFIX)
app.include_router(invoices.router, prefix=settings.API_V1_PREFIX)
app.include_router(payments.router, prefix=settings.API_V1_PREFIX)
app.include_router(enrollments.router, prefix=settings.API_V1_PREFIX)
app.include_router(rooms.router, prefix=settings.API_V1_PREFIX)
app.include_router(classes.router, prefix=settings.API_V1_PREFIX)
app.include_router(class_sessions.router, prefix=settings.API_V1_PREFIX)
app.include_router(class_session_media.router, prefix=settings.API_V1_PREFIX)
app.include_router(attendance.router, prefix=settings.API_V1_PREFIX)
app.include_router(attendance_reports.router, prefix=settings.API_V1_PREFIX)
app.include_router(assignments.router, prefix=settings.API_V1_PREFIX)
app.include_router(assignment_types.router, prefix=settings.API_V1_PREFIX)
app.include_router(assignment_attachments.router, prefix=settings.API_V1_PREFIX)
app.include_router(assignment_questions.router, prefix=settings.API_V1_PREFIX)
app.include_router(assignment_question_options.router, prefix=settings.API_V1_PREFIX)
app.include_router(submissions.router, prefix=settings.API_V1_PREFIX)
app.include_router(submission_attachments.router, prefix=settings.API_V1_PREFIX)
app.include_router(submission_answers.router, prefix=settings.API_V1_PREFIX)
app.include_router(assignment_grades.router, prefix=settings.API_V1_PREFIX)
app.include_router(course_categories.router, prefix=settings.API_V1_PREFIX)
app.include_router(course_tags.router, prefix=settings.API_V1_PREFIX)
app.include_router(courses.router, prefix=settings.API_V1_PREFIX)
app.include_router(course_modules.router, prefix=settings.API_V1_PREFIX)
app.include_router(lessons.router, prefix=settings.API_V1_PREFIX)
app.include_router(lesson_materials.router, prefix=settings.API_V1_PREFIX)


@app.exception_handler(HTTPException)
async def http_exception_handler(_: Request, exc: HTTPException):
    message = str(exc.detail)
    return error_response(message=message, status_code=exc.status_code)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(_: Request, exc: RequestValidationError):
    return error_response(
        message="Validation error",
        status_code=422,
        payload={"errors": exc.errors()},
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(_: Request, exc: Exception):
    return error_response(message=f"Internal server error: {exc}", status_code=500)


@app.get("/")
def root():
    return api_response(True, "API is running", None, None)
