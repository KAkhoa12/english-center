import { create } from "zustand";

import type { Pagination } from "@/shared/types/response";

import { permissionsApi } from "./permissions.api";
import type { ListPermissionsQuery, Permission } from "./permissions.type";

type PermissionsState = {
  permissions: Permission[];
  pagination: Pagination | null;
  isLoading: boolean;
  error: string | null;
  listPermissions: (query?: ListPermissionsQuery) => Promise<Permission[]>;
};

export const usePermissionsStore = create<PermissionsState>()((set) => ({
  permissions: [],
  pagination: null,
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
}));
