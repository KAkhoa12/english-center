from datetime import date, datetime
from typing import Optional, Literal
from pydantic import BaseModel, Field

TaskType = Literal[
    "general",
    "search_course",
    "course_info",
    "class_info",
    "upcoming_classes",
    "enrollments",
    "clarify"
]

ActionContext = Literal[
    "normal_question",
    "courses",
    "classes",
    "enrollments"
]

Level = Literal[
    "A0",
    "A1",
    "A2",
    "B1",
    "B2",
    "C1",
    "C2"
]

DEFAULT_TASK_PRIORITY = {
    "general": 10,
    "search_course": 20,
    "course_info": 30,
    "upcoming_classes": 40,
    "class_info": 50,
    "enrollments": 60,
}

CourseStatus = Literal[
    "active",
    "inactive",
    "archived",
]

class Schedules(BaseModel):
    schedule_name: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None



class UserInfo(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

class Filters(BaseModel):
    name: Optional[str] = None
    course_id: Optional[str] = None
    course_code: Optional[str] = None
    class_id: Optional[str] = None
    class_code: Optional[str] = None
    level: Optional[Level] = None




class Action(BaseModel):
    task: TaskType
    action_context: ActionContext
    priority: int = Field(default=10, ge=1, le=100)
    filters: Optional[Filters] = None
    user_info: Optional[UserInfo] = None
    reason: Optional[str] = None


class PlannerDecision(BaseModel):
    actions: list[Action] = Field(default_factory=list)
    needs_clarification: bool = False
    clarification_question: Optional[str] = None

class CourseInfo(BaseModel):
    id: Optional[str] = None
    name: Optional[str] = None
    code: Optional[str] = None
    description: Optional[str] = None
    category_name: Optional[str] = None
    level: Optional[Level] = None
    total_lesson: Optional[int] = None
    price: Optional[int] = None
    status: Optional[CourseStatus] = None
    tags: Optional[list[str]] = None

class ClassInfo(BaseModel):
    course_id: Optional[str] = None
    course_name: Optional[str] = None
    course_code: Optional[str] = None
    class_name: Optional[str] = None
    class_code: Optional[str] = None
    class_type: Optional[str] = None
    max_students: Optional[int] = None
    current_students: Optional[int] = None
    start_date: Optional[date | datetime] = None
    class_status: Optional[str] = None
    teacher_name: Optional[str] = None
    schedules: Optional[list[Schedules]] = None
