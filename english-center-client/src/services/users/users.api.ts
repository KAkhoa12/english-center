import { apiClient } from "@/config/api-client";

import type {
  AssignUserRolesRequest,
  CreateUserRequest,
  ListUsersQuery,
  UpdateUserRequest,
  User,
} from "./users.type";

const buildListUsersQuery = (query?: ListUsersQuery): string => {
  if (!query) return "";

  const params = new URLSearchParams();

  if (query.page !== undefined) params.set("page", String(query.page));
  if (query.page_size !== undefined) params.set("page_size", String(query.page_size));
  if (query.search) params.set("search", query.search);
  if (query.sort_by) params.set("sort_by", query.sort_by);
  if (query.sort_order) params.set("sort_order", query.sort_order);

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
};

export const usersApi = {
  createUser: (data: CreateUserRequest) =>
    apiClient.post<User, CreateUserRequest>("/users", data),

  listUsers: (query?: ListUsersQuery) =>
    apiClient.get<User[]>(`/users${buildListUsersQuery(query)}`),

  getUser: (userId: string) =>
    apiClient.get<User>(`/users/${userId}`),

  updateUser: (userId: string, data: UpdateUserRequest) =>
    apiClient.patch<User, UpdateUserRequest>(`/users/${userId}`, data),

  deleteUser: (userId: string) =>
    apiClient.delete<void>(`/users/${userId}`),

  assignUserRoles: (userId: string, data: AssignUserRolesRequest) =>
    apiClient.post<void, AssignUserRolesRequest>(`/users/${userId}/roles`, data),

  removeUserRole: (userId: string, roleId: string) =>
    apiClient.delete<void>(`/users/${userId}/roles/${roleId}`),
};
