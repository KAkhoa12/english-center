import { apiClient } from "@/config/api-client";

import type {
  CreateLessonRequest,
  Lesson,
  ListLessonsQuery,
  SetLessonThumbnailRequest,
  UpdateLessonRequest,
} from "./lessons.type";

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

export const lessonsApi = {
  createLesson: (courseId: string, data: CreateLessonRequest) =>
    apiClient.post<Lesson, CreateLessonRequest>(`/courses/${courseId}/lessons`, data),

  listLessons: (courseId: string, query?: ListLessonsQuery) =>
    apiClient.getWithMeta<Lesson[]>(appendQuery(`/courses/${courseId}/lessons`, query)),

  getLesson: (lessonId: string) =>
    apiClient.get<Lesson>(`/lessons/${lessonId}`),

  updateLesson: (lessonId: string, data: UpdateLessonRequest) =>
    apiClient.patch<Lesson, UpdateLessonRequest>(`/lessons/${lessonId}`, data),

  uploadLessonThumbnail: (lessonId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post<Lesson, FormData>(`/lessons/${lessonId}/thumbnail`, formData);
  },

  setLessonThumbnail: (lessonId: string, data: SetLessonThumbnailRequest) =>
    apiClient.patch<Lesson, SetLessonThumbnailRequest>(`/lessons/${lessonId}/thumbnail`, data),

  deleteLesson: (lessonId: string) =>
    apiClient.delete<void>(`/lessons/${lessonId}`),
};
