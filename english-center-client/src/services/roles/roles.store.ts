import { create } from "zustand";

import type { ApiResponse, Pagination } from "@/shared/types/response";

import { rolesApi } from "./roles.api";
import type {
  AssignPermissionsRequest,
  ListRolesQuery,
  Role,
  RoleCreateRequest,
  RoleUpdateRequest,
} from "./roles.type";

const unwrap = <T>(response: ApiResponse<T>, fallbackMessage: string): T => {
  if (!response.success) throw new Error(response.message || fallbackMessage);
  return response.payload;
};

type RolesState = {
  roles: Role[];
  pagination: Pagination | null;
  selectedRole: Role | null;
  isLoading: boolean;
  error: string | null;

  listRoles: (query?: ListRolesQuery) => Promise<Role[]>;
  getRole: (roleId: string) => Promise<Role>;
  createRole: (data: RoleCreateRequest) => Promise<Role>;
  updateRole: (roleId: string, data: RoleUpdateRequest) => Promise<Role>;
  deleteRole: (roleId: string) => Promise<void>;
  assignPermissions: (roleId: string, data: AssignPermissionsRequest) => Promise<void>;
  removePermission: (roleId: string, permissionId: string) => Promise<void>;
  clearSelectedRole: () => void;
  clearError: () => void;
};

export const useRolesStore = create<RolesState>()((set) => ({
  roles: [],
  pagination: null,
  selectedRole: null,
  isLoading: false,
  error: null,

  listRoles: async (query) => {
    const response = await rolesApi.listRoles(query);
    const roles = unwrap(response, "Lay danh sach vai tro that bai");
    set({ roles, pagination: response.pagination ?? null });
    return roles;
  },

  getRole: async (roleId) => {
    const response = await rolesApi.getRole(roleId);
    const role = unwrap(response, "Lay thong tin vai tro that bai");
    set({ selectedRole: role });
    return role;
  },

  createRole: async (data) => {
    const response = await rolesApi.createRole(data);
    const created = unwrap(response, "Tao vai tro that bai");
    set((state) => ({ roles: [created, ...state.roles], selectedRole: created }));
    return created;
  },

  updateRole: async (roleId, data) => {
    const response = await rolesApi.updateRole(roleId, data);
    const updated = unwrap(response, "Cap nhat vai tro that bai");
    set((state) => ({
      roles: state.roles.map((item) => (item.id === updated.id ? updated : item)),
      selectedRole: state.selectedRole?.id === updated.id ? updated : state.selectedRole,
    }));
    return updated;
  },

  deleteRole: async (roleId) => {
    const response = await rolesApi.deleteRole(roleId);
    unwrap(response, "Xoa vai tro that bai");
    set((state) => ({
      roles: state.roles.filter((item) => item.id !== roleId),
      selectedRole: state.selectedRole?.id === roleId ? null : state.selectedRole,
    }));
  },

  assignPermissions: async (roleId, data) => {
    const response = await rolesApi.assignPermissions(roleId, data);
    unwrap(response, "Gan quyen cho vai tro that bai");
  },

  removePermission: async (roleId, permissionId) => {
    const response = await rolesApi.removePermission(roleId, permissionId);
    unwrap(response, "Xoa quyen khoi vai tro that bai");
  },

  clearSelectedRole: () => set({ selectedRole: null }),
  clearError: () => set({ error: null }),
}));
