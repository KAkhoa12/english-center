import { create } from "zustand";

import type { Pagination } from "@/shared/types/response";

import { permissionsApi } from "./permissions.api";
import type {
  ListPermissionsQuery,
  Permission,
  PermissionCreateRequest,
  PermissionUpdateRequest,
} from "./permissions.type";

type PermissionsState = {
  permissions: Permission[];
  pagination: Pagination | null;
  selectedPermission: Permission | null;
  isLoading: boolean;
  error: string | null;

  listPermissions: (query?: ListPermissionsQuery) => Promise<Permission[]>;
  getPermission: (permissionId: string) => Promise<Permission>;
  createPermission: (data: PermissionCreateRequest) => Promise<Permission>;
  updatePermission: (permissionId: string, data: PermissionUpdateRequest) => Promise<Permission>;
  deletePermission: (permissionId: string) => Promise<void>;
  clearSelectedPermission: () => void;
  clearError: () => void;
};

export const usePermissionsStore = create<PermissionsState>()((set) => ({
  permissions: [],
  pagination: null,
  selectedPermission: null,
  isLoading: false,
  error: null,

  listPermissions: async (query) => {
    try {
      set({ isLoading: true, error: null });
      const response = await permissionsApi.listPermissions(query);
      set({
        permissions: response.payload,
        pagination: response.pagination ?? null,
        isLoading: false,
        error: null,
      });
      return response.payload;
    } catch {
      set({ isLoading: false, error: "Lấy danh sách quyền thất bại" });
      throw new Error("Lấy danh sách quyền thất bại");
    }
  },

  getPermission: async (permissionId) => {
    try {
      set({ isLoading: true, error: null });
      const permission = await permissionsApi.getPermission(permissionId);
      set({ selectedPermission: permission, isLoading: false, error: null });
      return permission;
    } catch {
      set({ isLoading: false, error: "Lấy thông tin quyền thất bại" });
      throw new Error("Lấy thông tin quyền thất bại");
    }
  },

  createPermission: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const created = await permissionsApi.createPermission(data);
      set((state) => ({
        permissions: [created, ...state.permissions],
        selectedPermission: created,
        isLoading: false,
        error: null,
      }));
      return created;
    } catch {
      set({ isLoading: false, error: "Tạo quyền thất bại" });
      throw new Error("Tạo quyền thất bại");
    }
  },

  updatePermission: async (permissionId, data) => {
    try {
      set({ isLoading: true, error: null });
      const updated = await permissionsApi.updatePermission(permissionId, data);
      set((state) => ({
        permissions: state.permissions.map((item) => (item.id === updated.id ? updated : item)),
        selectedPermission: state.selectedPermission?.id === updated.id ? updated : state.selectedPermission,
        isLoading: false,
        error: null,
      }));
      return updated;
    } catch {
      set({ isLoading: false, error: "Cập nhật quyền thất bại" });
      throw new Error("Cập nhật quyền thất bại");
    }
  },

  deletePermission: async (permissionId) => {
    try {
      set({ isLoading: true, error: null });
      await permissionsApi.deletePermission(permissionId);
      set((state) => ({
        permissions: state.permissions.filter((item) => item.id !== permissionId),
        selectedPermission: state.selectedPermission?.id === permissionId ? null : state.selectedPermission,
        isLoading: false,
        error: null,
      }));
    } catch {
      set({ isLoading: false, error: "Xóa quyền thất bại" });
      throw new Error("Xóa quyền thất bại");
    }
  },

  clearSelectedPermission: () => set({ selectedPermission: null }),
  clearError: () => set({ error: null }),
}));
