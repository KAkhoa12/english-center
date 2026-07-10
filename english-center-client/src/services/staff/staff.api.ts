import { httpClient } from "@/config/http-client";
import { apiClient } from "@/config/api-client";

import type {
  ListStaffQuery,
  StaffImportResult,
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

const downloadJson = (filename: string, payload: unknown) => {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.URL.revokeObjectURL(url);
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

  exportStaff: async () => {
    const response = await httpClient.get("/staff/export", { responseType: "blob" });
    downloadJson("staff-export.json", JSON.parse(await response.data.text()));
  },

  importStaff: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.postForm<StaffImportResult>("/staff/import", formData);
  },

  deleteStaff: (staffId: string) =>
    apiClient.delete<void>(`/staff/${staffId}`),
};
