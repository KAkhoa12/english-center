import { create } from "zustand";

import type { Pagination } from "@/shared/types/response";

import { rolesApi } from "./roles.api";
import type {
  AssignPermissionsRequest,
  ListRolesQuery,
  Role,
  RoleCreateRequest,
  RoleUpdateRequest,
} from "./roles.type";

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
    try {
      set({ isLoading: true, error: null });
      const response = await rolesApi.listRoles(query);
      set({ roles: response.payload, pagination: response.pagination ?? null, isLoading: false, error: null });
      return response.payload;
    } catch {
      set({ isLoading: false, error: "Lấy danh sách vai trò thất bại" });
      throw new Error("Lấy danh sách vai trò thất bại");
    }
  },

  getRole: async (roleId) => {
    try {
      set({ isLoading: true, error: null });
      const role = await rolesApi.getRole(roleId);
      set({ selectedRole: role, isLoading: false, error: null });
      return role;
    } catch {
      set({ isLoading: false, error: "Lấy thông tin vai trò thất bại" });
      throw new Error("Lấy thông tin vai trò thất bại");
    }
  },

  createRole: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const created = await rolesApi.createRole(data);
      set((state) => ({ roles: [created, ...state.roles], selectedRole: created, isLoading: false, error: null }));
      return created;
    } catch {
      set({ isLoading: false, error: "Tạo vai trò thất bại" });
      throw new Error("Tạo vai trò thất bại");
    }
  },

  updateRole: async (roleId, data) => {
    try {
      set({ isLoading: true, error: null });
      const updated = await rolesApi.updateRole(roleId, data);
      set((state) => ({
        roles: state.roles.map((item) => (item.id === updated.id ? updated : item)),
        selectedRole: state.selectedRole?.id === updated.id ? updated : state.selectedRole,
        isLoading: false,
        error: null,
      }));
      return updated;
    } catch {
      set({ isLoading: false, error: "Cập nhật vai trò thất bại" });
      throw new Error("Cập nhật vai trò thất bại");
    }
  },

  deleteRole: async (roleId) => {
    try {
      set({ isLoading: true, error: null });
      await rolesApi.deleteRole(roleId);
      set((state) => ({
        roles: state.roles.filter((item) => item.id !== roleId),
        selectedRole: state.selectedRole?.id === roleId ? null : state.selectedRole,
        isLoading: false,
        error: null,
      }));
    } catch {
      set({ isLoading: false, error: "Xóa vai trò thất bại" });
      throw new Error("Xóa vai trò thất bại");
    }
  },

  assignPermissions: async (roleId, data) => {
    await rolesApi.assignPermissions(roleId, data);
  },

  removePermission: async (roleId, permissionId) => {
    await rolesApi.removePermission(roleId, permissionId);
  },

  clearSelectedRole: () => set({ selectedRole: null }),
  clearError: () => set({ error: null }),
}));
