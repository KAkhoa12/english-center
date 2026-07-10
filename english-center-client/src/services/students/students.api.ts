import { httpClient } from "@/config/http-client";
import { apiClient } from "@/config/api-client";

import type {
  ListStudentsQuery,
  StudentImportResult,
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

const downloadJson = (filename: string, payload: unknown) => {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.URL.revokeObjectURL(url);
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

  exportStudents: async () => {
    const response = await httpClient.get("/students/export", { responseType: "blob" });
    downloadJson("students-export.json", JSON.parse(await response.data.text()));
  },

  importStudents: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.postForm<StudentImportResult>("/students/import", formData);
  },

  deleteStudent: (studentId: string) =>
    apiClient.delete<void>(`/students/${studentId}`),
};
