export type SessionAttendanceSummary = {
  present: number;
  absent: number;
  late: number;
  excused: number;
  not_marked: number;
};

export type SessionClassRef = {
  id: string;
  name: string;
};

export type SessionCourseRef = {
  id: string;
  name: string;
};

export type SessionTeacherRef = {
  id: string;
  full_name: string;
  email: string;
} | null;

export type SessionRoomRef = {
  id: string;
  name: string;
} | null;

export type SessionLessonRef = {
  id: string;
  title: string;
} | null;

export type SessionMediaRef = {
  id: string;
  class_session_id: string;
  media_id: string;
  title: string | null;
  description: string | null;
  order_index: number;
};

export type ClassScheduleName = "T2" | "T3" | "T4" | "T5" | "T6" | "T7" | "CN";

export type ClassScheduleRef = {
  id: string;
  class_id: string;
  schedule_name: ClassScheduleName;
  start_time: string;
  end_time: string;
};

export type ClassSession = {
  id: string;
  class_id: string;
  teacher_id: string | null;
  lesson_id: string | null;
  room_id: string | null;
  title: string;
  description: string | null;
  session_date: string;
  class_schedule_id: string;
  schedule: ClassScheduleRef | null;
  start_time: string;
  end_time: string;
  override_start_time: string | null;
  override_end_time: string | null;
  mode: string;
  meeting_url: string | null;
  status: string;
  note: string | null;
  class?: SessionClassRef;
  course?: SessionCourseRef;
  teacher?: SessionTeacherRef;
  room?: SessionRoomRef;
  lesson?: SessionLessonRef;
  attendance_summary?: SessionAttendanceSummary;
  media?: SessionMediaRef[];
};

export type CreateClassSessionRequest = {
  class_schedule_id: string;
  teacher_id?: string | null;
  lesson_id?: string | null;
  room_id?: string | null;
  title: string;
  description?: string | null;
  session_date: string;
  override_start_time?: string | null;
  override_end_time?: string | null;
  mode: string;
  meeting_url?: string | null;
  note?: string | null;
};

export type BulkCreateClassSessionsRequest = {
  start_date: string;
  class_schedule_ids: string[];
  weeks: number;
  mode: string;
  meeting_url?: string | null;
  room_id?: string | null;
  teacher_id?: string | null;
  lesson_id?: string | null;
  title_prefix?: string;
  description?: string | null;
  note?: string | null;
};

export type UpdateClassSessionRequest = {
  class_schedule_id?: string | null;
  teacher_id?: string | null;
  lesson_id?: string | null;
  room_id?: string | null;
  title?: string | null;
  description?: string | null;
  session_date?: string | null;
  override_start_time?: string | null;
  override_end_time?: string | null;
  mode?: string | null;
  meeting_url?: string | null;
  status?: string | null;
  note?: string | null;
};

export type ListClassSessionsQuery = {
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  status?: string;
  mode?: string;
  from_date?: string;
  to_date?: string;
};

export type ListAllSessionsQuery = ListClassSessionsQuery & {
  class_id?: string;
  course_id?: string;
  class_ids?: string[];
  course_ids?: string[];
  teacher_id?: string;
  room_id?: string;
};

export type ListMySessionsQuery = {
  page?: number;
  page_size?: number;
  status?: string;
  from_date?: string;
  to_date?: string;
};
