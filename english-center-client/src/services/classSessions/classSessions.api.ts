import { apiClient } from "@/config/api-client";

import type {
  ClassSession,
  BulkCreateClassSessionsRequest,
  CreateClassSessionRequest,
  ListAllSessionsQuery,
  ListClassSessionsQuery,
  ListMySessionsQuery,
  UpdateClassSessionRequest,
} from "./classSessions.type";

const appendQuery = (url: string, query?: Record<string, unknown>): string => {
  if (!query) return url;

  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      value.filter(Boolean).forEach((item) => params.append(key, String(item)));
      return;
    }
    params.set(key, String(value));
  });

  const queryString = params.toString();
  return queryString ? `${url}?${queryString}` : url;
};

export const classSessionsApi = {
  createSession: (classId: string, data: CreateClassSessionRequest) =>
    apiClient.post<ClassSession, CreateClassSessionRequest>(`/classes/${classId}/sessions`, data),

  createSessionsBulk: (classId: string, data: BulkCreateClassSessionsRequest) =>
    apiClient.post<ClassSession[], BulkCreateClassSessionsRequest>(`/classes/${classId}/sessions/bulk`, data),

  listSessions: (classId: string, query?: ListClassSessionsQuery) =>
    apiClient.getWithMeta<ClassSession[]>(appendQuery(`/classes/${classId}/sessions`, query)),

  listAllSessions: (query?: ListAllSessionsQuery) =>
    apiClient.getWithMeta<ClassSession[]>(appendQuery("/sessions", query)),

  getSession: (sessionId: string) =>
    apiClient.get<ClassSession>(`/sessions/${sessionId}`),

  updateSession: (sessionId: string, data: UpdateClassSessionRequest) =>
    apiClient.patch<ClassSession, UpdateClassSessionRequest>(`/sessions/${sessionId}`, data),

  deleteSession: (sessionId: string) =>
    apiClient.delete<void>(`/sessions/${sessionId}`),

  mySessions: (query?: ListMySessionsQuery) =>
    apiClient.getWithMeta<ClassSession[]>(appendQuery("/students/me/sessions", query)),

  getMySessionDetail: (sessionId: string) =>
    apiClient.get<ClassSession>(`/students/me/sessions/${sessionId}`),
};
