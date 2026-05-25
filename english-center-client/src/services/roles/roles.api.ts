import { apiClient } from "@/config/api-client";

import type {
  AssignPermissionsRequest,
  ListRolesQuery,
  Role,
  RoleCreateRequest,
  RoleUpdateRequest,
} from "./roles.type";

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

export const rolesApi = {
  listRoles: (query?: ListRolesQuery) =>
    apiClient.getWithMeta<Role[]>(appendQuery("/roles", query)),

  createRole: (data: RoleCreateRequest) =>
    apiClient.post<Role, RoleCreateRequest>("/roles", data),

  getRole: (roleId: string) =>
    apiClient.get<Role>(`/roles/${roleId}`),

  updateRole: (roleId: string, data: RoleUpdateRequest) =>
    apiClient.patch<Role, RoleUpdateRequest>(`/roles/${roleId}`, data),

  deleteRole: (roleId: string) =>
    apiClient.delete<void>(`/roles/${roleId}`),

  assignPermissions: (roleId: string, data: AssignPermissionsRequest) =>
    apiClient.post<void, AssignPermissionsRequest>(`/roles/${roleId}/permissions`, data),

  removePermission: (roleId: string, permissionId: string) =>
    apiClient.delete<void>(`/roles/${roleId}/permissions/${permissionId}`),
};
