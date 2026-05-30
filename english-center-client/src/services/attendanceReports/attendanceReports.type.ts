export type AttendanceSummaryCounts = {
  present: number;
  absent: number;
  late: number;
  excused: number;
  not_marked: number;
};

export type ClassAttendanceSummary = {
  class_id: string;
  class_name: string;
  course: {
    id: string;
    name: string;
  };
  total_sessions: number;
  total_students: number;
  summary: AttendanceSummaryCounts;
  attendance_rate: number;
};

export type ClassStudentAttendanceSummary = {
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

export type ListClassStudentsSummaryQuery = {
  page?: number;
  page_size?: number;
  search?: string;
};
