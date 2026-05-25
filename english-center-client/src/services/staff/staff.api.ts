import { apiClient } from "@/config/api-client";

import type {
  ListStaffQuery,
  Staff,
  StaffCreateRequest,
  StaffUpdateRequest,
} from "./staff.type";

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

export const staffApi = {
  createStaff: (data: StaffCreateRequest) =>
    apiClient.post<Staff, StaffCreateRequest>("/staff", data),

  listStaff: (query?: ListStaffQuery) =>
    apiClient.getWithMeta<Staff[]>(appendQuery("/staff", query)),

  getStaff: (staffId: string) =>
    apiClient.get<Staff>(`/staff/${staffId}`),

  updateStaff: (staffId: string, data: StaffUpdateRequest) =>
    apiClient.patch<Staff, StaffUpdateRequest>(`/staff/${staffId}`, data),

  updateStaffAvatar: (staffId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.patch<Staff, FormData>(`/staff/${staffId}/avatar`, formData);
  },

  deleteStaff: (staffId: string) =>
    apiClient.delete<void>(`/staff/${staffId}`),
};
