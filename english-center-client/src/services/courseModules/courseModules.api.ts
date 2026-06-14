import { apiClient } from "@/config/api-client";

import type {
  CourseModule,
  CreateCourseModuleRequest,
  UpdateCourseModuleRequest,
} from "./courseModules.type";

export const courseModulesApi = {
  createModule: (courseId: string, data: CreateCourseModuleRequest) =>
    apiClient.post<CourseModule, CreateCourseModuleRequest>(`/courses/${courseId}/modules`, data),

  listModules: (courseId: string) =>
    apiClient.get<CourseModule[]>(`/courses/${courseId}/modules`),

  getModule: (moduleId: string) =>
    apiClient.get<CourseModule>(`/course-modules/${moduleId}`),

  updateModule: (moduleId: string, data: UpdateCourseModuleRequest) =>
    apiClient.patch<CourseModule, UpdateCourseModuleRequest>(`/course-modules/${moduleId}`, data),

  uploadModuleMedia: (moduleId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.postForm<CourseModule>(`/course-modules/${moduleId}/media`, formData);
  },

  deleteModule: (moduleId: string) =>
    apiClient.delete<void>(`/course-modules/${moduleId}`),
};
