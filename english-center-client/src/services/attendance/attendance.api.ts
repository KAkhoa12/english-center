import { apiClient } from "@/config/api-client";

import type {
  AttendanceBulkItemRequest,
  AttendanceItem,
  AttendanceUpdateRequest,
  ListAttendanceQuery,
  ListClassAttendanceQuery,
} from "./attendance.type";

const appendQuery = (url: string, query?: Record<string, unknown>): string => {
  if (!query) return url;

  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    params.set(key, String(value));
  });

  const queryString = params.toString();
  return queryString ? `${url}?${queryString}` : url;
};

export const attendanceApi = {
  markAttendance: (sessionId: string, data: AttendanceBulkItemRequest[]) =>
    apiClient.post<AttendanceItem[], AttendanceBulkItemRequest[]>(
      `/sessions/${sessionId}/attendance`,
      data
    ),

  getSessionAttendance: (sessionId: string, query?: ListAttendanceQuery) =>
    apiClient.getWithMeta<AttendanceItem[]>(
      appendQuery(`/sessions/${sessionId}/attendance`, query)
    ),

  updateAttendance: (attendanceId: string, data: AttendanceUpdateRequest) =>
    apiClient.patch<AttendanceItem, AttendanceUpdateRequest>(
      `/attendance/${attendanceId}`,
      data
    ),

  deleteAttendance: (attendanceId: string) =>
    apiClient.delete<void>(`/attendance/${attendanceId}`),

  getClassAttendance: (classId: string, query?: ListClassAttendanceQuery) =>
    apiClient.getWithMeta<AttendanceItem[]>(
      appendQuery(`/classes/${classId}/attendance`, query)
    ),

  getStudentAttendance: (
    studentId: string,
    query?: { page?: number; page_size?: number; class_id?: string }
  ) =>
    apiClient.getWithMeta<AttendanceItem[]>(
      appendQuery(`/students/${studentId}/attendance`, query)
    ),

  getMyAttendance: (query?: { page?: number; page_size?: number }) =>
    apiClient.getWithMeta<AttendanceItem[]>(
      appendQuery("/students/me/attendance", query)
    ),
};
