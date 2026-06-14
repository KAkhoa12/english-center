from typing import Optional, Literal
from pydantic import BaseModel, Field


class UserInfo(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None


class CourseInfo(BaseModel):
    key_name: Optional[str] = None
    code: Optional[str] = None


class ClassByCourse(BaseModel):
    course_id: Optional[str] = None


class CourseFilter(BaseModel):
    level: Optional[Literal[
        "beginner",
        "elementary",
        "intermediate",
        "advanced"
    ]] = None
    goal: Optional[str] = None
    age_group: Optional[str] = None
    schedule: Optional[str] = None


class RejectedIntent(BaseModel):
    intent: str
    reason: str


class Action(BaseModel):
    type: Literal[
        "course",
        "class",
        "lead",
        "user_info"
    ]

    name: Literal[
        "list_current_courses",
        "search_course",
        "filter_courses",
        "get_course_price",
        "get_course_schedule",
        "get_classes_by_course",
        "collect_user_info",
        "save_lead"
    ]

    priority: int = 1


class QuestionClassification(BaseModel):
    user_info: UserInfo = Field(default_factory=UserInfo)
    course_info: CourseInfo = Field(default_factory=CourseInfo)
    class_by_course: ClassByCourse = Field(default_factory=ClassByCourse)
    course_filter: CourseFilter = Field(default_factory=CourseFilter)

    intents: list[str] = Field(default_factory=list)
    allowed_actions: list[Action] = Field(default_factory=list)
    rejected_intents: list[RejectedIntent] = Field(default_factory=list)

    primary_intent: Optional[str] = None
    confidence: float = 0.0
