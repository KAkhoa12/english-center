import { apiClient } from "@/config/api-client";

import type {
  CourseTag,
  CreateCourseTagRequest,
  ListCourseTagsQuery,
  UpdateCourseTagRequest,
} from "./coursesTag.type";

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

export const coursesTagApi = {
  createTag: (data: CreateCourseTagRequest) =>
    apiClient.post<CourseTag, CreateCourseTagRequest>("/course-tags", data),

  listTags: (query?: ListCourseTagsQuery) =>
    apiClient.getWithMeta<CourseTag[]>(appendQuery("/course-tags", query)),

  getTag: (tagId: string) =>
    apiClient.get<CourseTag>(`/course-tags/${tagId}`),

  updateTag: (tagId: string, data: UpdateCourseTagRequest) =>
    apiClient.patch<CourseTag, UpdateCourseTagRequest>(`/course-tags/${tagId}`, data),

  deleteTag: (tagId: string) =>
    apiClient.delete<void>(`/course-tags/${tagId}`),
};
