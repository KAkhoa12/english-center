import type {  SortOrder, UserRef } from "@/shared/types/response";

export type ClassType = string;
export type ClassStatus = string;
export type EnrollmentStatus = string;
export type SessionMode = string;
export type SessionStatus = string;

export type CourseRef = { id: string; name: string; code?: string };
export type TeacherRef = UserRef & { id: string };
export type RoomRef = { id: string; name: string; location?: string | null };
export type ClassScheduleName = "T2" | "T3" | "T4" | "T5" | "T6" | "T7" | "CN";
export type ClassSchedule = {
  id: string;
  class_id: string;
  schedule_name: ClassScheduleName;
  start_time: string;
  end_time: string;
  created_at?: string;
  updated_at?: string;
};

export type ClassItem = {
  id: string;
  course_id: string;
  teacher_id: string | null;
  room_id: string | null;
  name: string;
  code: string | null;
  class_type: ClassType;
  max_students: number;
  current_students_count: number;
  start_date: string | null;
  status: ClassStatus;
  course: CourseRef;
  teacher: TeacherRef | null;
  room: RoomRef | null;
  created_at: string;
  updated_at: string;
  students_count?: number;
  sessions_count?: number;
  schedules?: ClassSchedule[];
};

export type ClassStudentItem = {
  class_id: string;
  student_id: string;
  student: UserRef;
  enrollment_id: string | null;
  enrollment_status: EnrollmentStatus;
  enrolled_at: string | null;
  final_score: number | null;
  note: string | null;
};

export type ClassSessionAttendanceSummary = Record<string, number>;

export type ClassSessionItem = {
  id: string;
  class_id: string;
  teacher_id: string | null;
  lesson_id: string | null;
  room_id: string | null;
  title: string;
  description: string | null;
  session_date: string;
  class_schedule_id: string;
  schedule: ClassSchedule | null;
  start_time: string;
  end_time: string;
  override_start_time: string | null;
  override_end_time: string | null;
  mode: SessionMode;
  meeting_url: string | null;
  status: SessionStatus;
  note: string | null;
  class?: { id: string; name: string };
  course?: { id: string; name: string };
  teacher?: { id: string; full_name: string; email: string } | null;
  room?: { id: string; name: string } | null;
  lesson?: { id: string; title: string } | null;
  attendance_summary?: ClassSessionAttendanceSummary;
};

export type ClassCreateRequest = {
  course_id: string;
  teacher_id?: string | null;
  room_id?: string | null;
  name: string;
  code?: string | null;
  class_type: ClassType;
  max_students: number;
  start_date?: string | null;
  status?: ClassStatus;
};

export type ClassUpdateRequest = {
  teacher_id?: string | null;
  room_id?: string | null;
  name?: string | null;
  code?: string | null;
  class_type?: ClassType | null;
  max_students?: number | null;
  start_date?: string | null;
  status?: ClassStatus | null;
};

export type ListClassesQuery = {
  page?: number;
  page_size?: number;
  search?: string;
  sort_by?: string;
  sort_order?: SortOrder;
  course_id?: string;
  teacher_id?: string;
  status?: ClassStatus;
  class_type?: ClassType;
  start_date_from?: string;
  start_date_to?: string;
};

export type AddStudentToClassRequest = {
  student_id: string;
  enrollment_id?: string | null;
  note?: string | null;
};

export type UpdateClassStudentRequest = {
  enrollment_status?: EnrollmentStatus | null;
  final_score?: number | null;
  note?: string | null;
};

export type ListClassStudentsQuery = {
  page?: number;
  page_size?: number;
  search?: string;
  sort_by?: string;
  sort_order?: SortOrder;
  enrollment_status?: EnrollmentStatus;
};

export type ListCourseClassesQuery = {
  page?: number;
  page_size?: number;
  search?: string;
  sort_by?: string;
  sort_order?: SortOrder;
  status?: ClassStatus;
  class_type?: ClassType;
};

export type ListStudentClassesQuery = {
  page?: number;
  page_size?: number;
};

export type ClassSessionCreateRequest = {
  class_schedule_id: string;
  teacher_id?: string | null;
  lesson_id?: string | null;
  room_id?: string | null;
  title: string;
  description?: string | null;
  session_date: string;
  override_start_time?: string | null;
  override_end_time?: string | null;
  mode: SessionMode;
  meeting_url?: string | null;
  note?: string | null;
};

export type ClassSessionUpdateRequest = {
  class_schedule_id?: string | null;
  teacher_id?: string | null;
  lesson_id?: string | null;
  room_id?: string | null;
  title?: string | null;
  description?: string | null;
  session_date?: string | null;
  override_start_time?: string | null;
  override_end_time?: string | null;
  mode?: SessionMode | null;
  meeting_url?: string | null;
  status?: SessionStatus | null;
  note?: string | null;
};

export type ListSessionsQuery = {
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_order?: SortOrder;
  status?: SessionStatus;
  mode?: SessionMode;
  from_date?: string;
  to_date?: string;
};
