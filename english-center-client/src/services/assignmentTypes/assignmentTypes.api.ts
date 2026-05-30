import { apiClient } from "@/config/api-client";

import type {
  AssignmentType,
  AssignmentTypeCreateRequest,
  AssignmentTypeUpdateRequest,
  ListAssignmentTypesQuery,
} from "./assignmentTypes.type";

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

export const assignmentTypesApi = {
  listAssignmentTypes: (query?: ListAssignmentTypesQuery) =>
    apiClient.getWithMeta<AssignmentType[]>(appendQuery("/assignment-types", query)),

  createAssignmentType: (data: AssignmentTypeCreateRequest) =>
    apiClient.post<AssignmentType, AssignmentTypeCreateRequest>("/assignment-types", data),

  getAssignmentType: (assignmentTypeId: string) =>
    apiClient.get<AssignmentType>(`/assignment-types/${assignmentTypeId}`),

  updateAssignmentType: (assignmentTypeId: string, data: AssignmentTypeUpdateRequest) =>
    apiClient.patch<AssignmentType, AssignmentTypeUpdateRequest>(`/assignment-types/${assignmentTypeId}`, data),

  deleteAssignmentType: (assignmentTypeId: string) =>
    apiClient.delete<void>(`/assignment-types/${assignmentTypeId}`),
};
