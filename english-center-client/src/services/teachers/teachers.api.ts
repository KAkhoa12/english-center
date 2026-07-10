import { httpClient } from "@/config/http-client";
import { apiClient } from "@/config/api-client";

import type {
  ListTeachersQuery,
  TeacherImportResult,
  Teacher,
  TeacherCreateRequest,
  TeacherUpdateRequest,
} from "./teachers.type";

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

export const teachersApi = {
  createTeacher: (data: TeacherCreateRequest) =>
    apiClient.post<Teacher, TeacherCreateRequest>("/teachers", data),

  listTeachers: (query?: ListTeachersQuery) =>
    apiClient.getWithMeta<Teacher[]>(appendQuery("/teachers", query)),

  getTeacher: (teacherId: string) =>
    apiClient.get<Teacher>(`/teachers/${teacherId}`),

  updateTeacher: (teacherId: string, data: TeacherUpdateRequest) =>
    apiClient.patch<Teacher, TeacherUpdateRequest>(`/teachers/${teacherId}`, data),

  updateTeacherAvatar: (teacherId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.patch<Teacher, FormData>(`/teachers/${teacherId}/avatar`, formData);
  },

  exportTeachers: async () => {
    const response = await httpClient.get("/teachers/export", { responseType: "blob" });
    downloadJson("teachers-export.json", JSON.parse(await response.data.text()));
  },

  importTeachers: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.postForm<TeacherImportResult>("/teachers/import", formData);
  },

  deleteTeacher: (teacherId: string) =>
    apiClient.delete<void>(`/teachers/${teacherId}`),
};
