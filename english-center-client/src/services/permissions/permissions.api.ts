import { apiClient } from "@/config/api-client";

import type {
  ListPermissionsQuery,
  Permission,
  PermissionCreateRequest,
  PermissionUpdateRequest,
} from "./permissions.type";

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

export const permissionsApi = {
  listPermissions: (query?: ListPermissionsQuery) =>
    apiClient.getWithMeta<Permission[]>(appendQuery("/permissions", query)),

  createPermission: (data: PermissionCreateRequest) =>
    apiClient.post<Permission, PermissionCreateRequest>("/permissions", data),

  getPermission: (permissionId: string) =>
    apiClient.get<Permission>(`/permissions/${permissionId}`),

  updatePermission: (permissionId: string, data: PermissionUpdateRequest) =>
    apiClient.patch<Permission, PermissionUpdateRequest>(`/permissions/${permissionId}`, data),

  deletePermission: (permissionId: string) =>
    apiClient.delete<void>(`/permissions/${permissionId}`),
};
