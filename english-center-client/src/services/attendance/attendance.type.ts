import type { ApiResponse, SortOrder, UserRef } from "../common/common.type";

export type AttendanceStatus = string;

export type AttendanceItem = {
  id: string | null;
  session_id: string;
  class_id: string;
  student_id: string;
  student: UserRef;
  status: AttendanceStatus;
  check_in_time: string | null;
  note: string | null;
  recorded_by: UserRef | null;
  recorded_at: string | null;
};

export type AttendanceBulkItemRequest = {
  student_id: string;
  status: AttendanceStatus;
  check_in_time?: string | null;
  note?: string | null;
};

export type AttendanceUpdateRequest = {
  status?: AttendanceStatus | null;
  check_in_time?: string | null;
  note?: string | null;
};

export type ListAttendanceQuery = {
  page?: number;
  page_size?: number;
  search?: string;
  status?: AttendanceStatus;
};

export type ListClassAttendanceQuery = {
  page?: number;
  page_size?: number;
  session_id?: string;
  student_id?: string;
  status?: AttendanceStatus;
  from_date?: string;
  to_date?: string;
};

export type StudentAttendanceSummary = {
  student_id: string;
  student_name: string;
  total_sessions: number;
  present_count: number;
  absent_count: number;
  late_count: number;
  excused_count: number;
  not_marked_count: number;
  attendance_rate: number;
};

export type ClassAttendanceSummary = {
  class_id: string;
  class_name: string;
  course: { id: string; name: string };
  total_sessions: number;
  total_students: number;
  summary: Record<string, number>;
  attendance_rate: number;
};

export type MarkAttendanceResponse = ApiResponse<AttendanceItem[]>;
export type GetSessionAttendanceResponse = ApiResponse<AttendanceItem[]>;
export type UpdateAttendanceResponse = ApiResponse<AttendanceItem>;
export type DeleteAttendanceResponse = ApiResponse<null>;
export type GetClassAttendanceResponse = ApiResponse<AttendanceItem[]>;
export type GetStudentAttendanceResponse = ApiResponse<AttendanceItem[]>;
export type GetMyAttendanceResponse = ApiResponse<AttendanceItem[]>;
export type GetClassAttendanceSummaryResponse = ApiResponse<ClassAttendanceSummary>;
export type GetClassStudentsAttendanceSummaryResponse = ApiResponse<StudentAttendanceSummary[]>;
export type GetStudentAttendanceSummaryResponse = ApiResponse<StudentAttendanceSummary>;
