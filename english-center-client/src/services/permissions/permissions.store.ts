import { create } from "zustand";

import type { ApiResponse, Pagination } from "@/shared/types/response";

import { permissionsApi } from "./permissions.api";
import type {
  ListPermissionsQuery,
  Permission,
  PermissionCreateRequest,
  PermissionUpdateRequest,
} from "./permissions.type";

const unwrap = <T>(response: ApiResponse<T>, fallbackMessage: string): T => {
  if (!response.success) throw new Error(response.message || fallbackMessage);
  return response.payload;
};

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
    const response = await permissionsApi.listPermissions(query);
    const permissions = unwrap(response, "Lay danh sach quyen that bai");
    set({ permissions, pagination: response.pagination ?? null });
    return permissions;
  },

  getPermission: async (permissionId) => {
    const response = await permissionsApi.getPermission(permissionId);
    const permission = unwrap(response, "Lay thong tin quyen that bai");
    set({ selectedPermission: permission });
    return permission;
  },

  createPermission: async (data) => {
    const response = await permissionsApi.createPermission(data);
    const created = unwrap(response, "Tao quyen that bai");
    set((state) => ({ permissions: [created, ...state.permissions], selectedPermission: created }));
    return created;
  },

  updatePermission: async (permissionId, data) => {
    const response = await permissionsApi.updatePermission(permissionId, data);
    const updated = unwrap(response, "Cap nhat quyen that bai");
    set((state) => ({
      permissions: state.permissions.map((item) => (item.id === updated.id ? updated : item)),
      selectedPermission: state.selectedPermission?.id === updated.id ? updated : state.selectedPermission,
    }));
    return updated;
  },

  deletePermission: async (permissionId) => {
    const response = await permissionsApi.deletePermission(permissionId);
    unwrap(response, "Xoa quyen that bai");
    set((state) => ({
      permissions: state.permissions.filter((item) => item.id !== permissionId),
      selectedPermission: state.selectedPermission?.id === permissionId ? null : state.selectedPermission,
    }));
  },

  clearSelectedPermission: () => set({ selectedPermission: null }),
  clearError: () => set({ error: null }),
}));
