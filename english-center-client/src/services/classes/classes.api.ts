import { apiClient } from "@/config/api-client";

import type {
  AddStudentToClassRequest,
  ClassCreateRequest,
  ClassItem,
  ClassStudentItem,
  ClassUpdateRequest,
  ListClassesQuery,
  ListCourseClassesQuery,
  ListClassStudentsQuery,
  ListStudentClassesQuery,
  UpdateClassStudentRequest,
} from "./classes.type";

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

export const classesApi = {
  createClass: (data: ClassCreateRequest) =>
    apiClient.post<ClassItem, ClassCreateRequest>("/classes", data),

  listClasses: (query?: ListClassesQuery) =>
    apiClient.get<ClassItem[]>(appendQuery("/classes", query)),

  getClass: (classId: string) =>
    apiClient.get<ClassItem>(`/classes/${classId}`),

  updateClass: (classId: string, data: ClassUpdateRequest) =>
    apiClient.patch<ClassItem, ClassUpdateRequest>(`/classes/${classId}`, data),

  deleteClass: (classId: string) =>
    apiClient.delete<void>(`/classes/${classId}`),

  listCourseClasses: (courseId: string, query?: ListCourseClassesQuery) =>
    apiClient.get<ClassItem[]>(appendQuery(`/courses/${courseId}/classes`, query)),

  addStudentToClass: (classId: string, data: AddStudentToClassRequest) =>
    apiClient.post<ClassStudentItem, AddStudentToClassRequest>(`/classes/${classId}/students`, data),

  listClassStudents: (classId: string, query?: ListClassStudentsQuery) =>
    apiClient.get<ClassStudentItem[]>(appendQuery(`/classes/${classId}/students`, query)),

  updateClassStudent: (classId: string, studentId: string, data: UpdateClassStudentRequest) =>
    apiClient.patch<ClassStudentItem, UpdateClassStudentRequest>(`/classes/${classId}/students/${studentId}`, data),

  removeClassStudent: (classId: string, studentId: string) =>
    apiClient.delete<void>(`/classes/${classId}/students/${studentId}`),

  listStudentClasses: (studentId: string, query?: ListStudentClassesQuery) =>
    apiClient.get<ClassItem[]>(appendQuery(`/students/${studentId}/classes`, query)),
};
