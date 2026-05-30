import { apiClient } from "@/config/api-client";

import type {
  ClassAttendanceSummary,
  ClassStudentAttendanceSummary,
  ListClassStudentsSummaryQuery,
  StudentAttendanceSummary,
} from "./attendanceReports.type";

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

export const attendanceReportsApi = {
  getClassSummary: (classId: string) =>
    apiClient.get<ClassAttendanceSummary>(`/classes/${classId}/attendance/summary`),

  getClassStudentsSummary: (classId: string, query?: ListClassStudentsSummaryQuery) =>
    apiClient.getWithMeta<ClassStudentAttendanceSummary[]>(
      appendQuery(`/classes/${classId}/attendance/students-summary`, query)
    ),

  getStudentSummary: (studentId: string) =>
    apiClient.get<StudentAttendanceSummary>(`/students/${studentId}/attendance/summary`),
};
