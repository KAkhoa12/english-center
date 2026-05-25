import { apiClient } from "@/config/api-client";

import type {
  ListTeachersQuery,
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

  deleteTeacher: (teacherId: string) =>
    apiClient.delete<void>(`/teachers/${teacherId}`),
};
