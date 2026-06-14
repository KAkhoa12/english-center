import { apiClient } from "@/config/api-client";

import type {
  CourseDetail,
  CourseListItem,
  CourseOutcome,
  CourseRequirement,
  CourseStatistic,
  CourseThumbnailUploadResult,
  CreateCourseOutcomeRequest,
  CreateCourseRequest,
  CreateCourseRequirementRequest,
  ListCoursesQuery,
  UpdateCourseOutcomeRequest,
  UpdateCourseRequest,
  UpdateCourseRequirementRequest,
} from "./courses.type";

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

export const coursesApi = {
  createCourse: (data: CreateCourseRequest) =>
    apiClient.post<CourseDetail, CreateCourseRequest>("/courses", data),

  listCourses: (query?: ListCoursesQuery) =>
    apiClient.getWithMeta<CourseListItem[]>(appendQuery("/courses", query)),

  getCourse: (courseId: string) =>
    apiClient.get<CourseDetail>(`/courses/${courseId}`),

  getCourseBySlug: (slug: string) =>
    apiClient.get<CourseDetail>(`/courses/slug/${slug}`),

  getCourseStatistics: (mode: "center" | "template") =>
    apiClient.get<CourseStatistic[]>(`/courses/statistics/${mode}`),

  updateCourse: (courseId: string, data: UpdateCourseRequest) =>
    apiClient.patch<CourseDetail, UpdateCourseRequest>(`/courses/${courseId}`, data),

  uploadCourseThumbnail: (courseId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.postForm<CourseThumbnailUploadResult>(`/courses/${courseId}/thumbnail`, formData);
  },

  deleteCourse: (courseId: string) =>
    apiClient.delete<void>(`/courses/${courseId}`),

  createRequirement: (courseId: string, data: CreateCourseRequirementRequest) =>
    apiClient.post<CourseRequirement, CreateCourseRequirementRequest>(`/courses/${courseId}/requirements`, data),

  listRequirements: (courseId: string) =>
    apiClient.get<CourseRequirement[]>(`/courses/${courseId}/requirements`),

  updateRequirement: (requirementId: string, data: UpdateCourseRequirementRequest) =>
    apiClient.patch<CourseRequirement, UpdateCourseRequirementRequest>(`/course-requirements/${requirementId}`, data),

  deleteRequirement: (requirementId: string) =>
    apiClient.delete<void>(`/course-requirements/${requirementId}`),

  createOutcome: (courseId: string, data: CreateCourseOutcomeRequest) =>
    apiClient.post<CourseOutcome, CreateCourseOutcomeRequest>(`/courses/${courseId}/outcomes`, data),

  listOutcomes: (courseId: string) =>
    apiClient.get<CourseOutcome[]>(`/courses/${courseId}/outcomes`),

  updateOutcome: (outcomeId: string, data: UpdateCourseOutcomeRequest) =>
    apiClient.patch<CourseOutcome, UpdateCourseOutcomeRequest>(`/course-outcomes/${outcomeId}`, data),

  deleteOutcome: (outcomeId: string) =>
    apiClient.delete<void>(`/course-outcomes/${outcomeId}`),
};
