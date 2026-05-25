import { apiClient } from "@/config/api-client";

import type {
  ListStudentsQuery,
  Student,
  StudentCreateRequest,
  StudentUpdateRequest,
} from "./students.type";

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

export const studentsApi = {
  createStudent: (data: StudentCreateRequest) =>
    apiClient.post<Student, StudentCreateRequest>("/students", data),

  listStudents: (query?: ListStudentsQuery) =>
    apiClient.getWithMeta<Student[]>(appendQuery("/students", query)),

  getStudent: (studentId: string) =>
    apiClient.get<Student>(`/students/${studentId}`),

  updateStudent: (studentId: string, data: StudentUpdateRequest) =>
    apiClient.patch<Student, StudentUpdateRequest>(`/students/${studentId}`, data),

  updateStudentAvatar: (studentId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.patch<Student, FormData>(`/students/${studentId}/avatar`, formData);
  },

  deleteStudent: (studentId: string) =>
    apiClient.delete<void>(`/students/${studentId}`),
};
