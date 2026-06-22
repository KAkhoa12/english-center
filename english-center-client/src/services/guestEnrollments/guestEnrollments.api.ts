import { apiClient } from "@/config/api-client";

import type {
  GuestEnrollment,
  GuestEnrollmentCreateRequest,
  GuestEnrollmentUpdateRequest,
  ListGuestEnrollmentsQuery,
} from "./guestEnrollments.type";

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

export const guestEnrollmentsApi = {
  createGuestEnrollment: (data: GuestEnrollmentCreateRequest) =>
    apiClient.post<GuestEnrollment, GuestEnrollmentCreateRequest>("/guest-enrollments", data),

  listGuestEnrollments: (query?: ListGuestEnrollmentsQuery) =>
    apiClient.getWithMeta<GuestEnrollment[]>(appendQuery("/guest-enrollments", query)),

  getGuestEnrollment: (guestEnrollmentId: string) =>
    apiClient.get<GuestEnrollment>(`/guest-enrollments/${guestEnrollmentId}`),

  updateGuestEnrollment: (guestEnrollmentId: string, data: GuestEnrollmentUpdateRequest) =>
    apiClient.patch<GuestEnrollment, GuestEnrollmentUpdateRequest>(`/guest-enrollments/${guestEnrollmentId}`, data),

  deleteGuestEnrollment: (guestEnrollmentId: string) =>
    apiClient.delete<void>(`/guest-enrollments/${guestEnrollmentId}`),
};
