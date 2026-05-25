import { apiClient } from "@/config/api-client";

import type {
  CourseCategory,
  CreateCourseCategoryRequest,
  ListCourseCategoriesQuery,
  UpdateCourseCategoryRequest,
} from "./coursesCategory.type";

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

export const coursesCategoryApi = {
  createCategory: (data: CreateCourseCategoryRequest) =>
    apiClient.post<CourseCategory, CreateCourseCategoryRequest>("/course-categories", data),

  listCategories: (query?: ListCourseCategoriesQuery) =>
    apiClient.getWithMeta<CourseCategory[]>(appendQuery("/course-categories", query)),

  getCategory: (categoryId: string) =>
    apiClient.get<CourseCategory>(`/course-categories/${categoryId}`),

  updateCategory: (categoryId: string, data: UpdateCourseCategoryRequest) =>
    apiClient.patch<CourseCategory, UpdateCourseCategoryRequest>(`/course-categories/${categoryId}`, data),

  deleteCategory: (categoryId: string) =>
    apiClient.delete<void>(`/course-categories/${categoryId}`),
};
