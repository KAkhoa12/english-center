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

export type ClassSession = {
  id: string;
  class_id: string;
  teacher_id: string | null;
  lesson_id: string | null;
  room_id: string | null;
  title: string;
  description: string | null;
  session_date: string;
  start_time: string;
  end_time: string;
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
};

export type CreateClassSessionRequest = {
  teacher_id?: string | null;
  lesson_id?: string | null;
  room_id?: string | null;
  title: string;
  description?: string | null;
  session_date: string;
  start_time: string;
  end_time: string;
  mode: string;
  meeting_url?: string | null;
  note?: string | null;
};

export type UpdateClassSessionRequest = {
  teacher_id?: string | null;
  lesson_id?: string | null;
  room_id?: string | null;
  title?: string | null;
  description?: string | null;
  session_date?: string | null;
  start_time?: string | null;
  end_time?: string | null;
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

export type ListMySessionsQuery = {
  page?: number;
  page_size?: number;
  status?: string;
  from_date?: string;
  to_date?: string;
};
