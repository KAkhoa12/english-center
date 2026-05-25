import { create } from "zustand";

import type { Pagination } from "@/shared/types/response";

import { rolesApi } from "./roles.api";
import type { ListRolesQuery, Role } from "./roles.type";

type RolesState = {
  roles: Role[];
  pagination: Pagination | null;
  isLoading: boolean;
  error: string | null;
  listRoles: (query?: ListRolesQuery) => Promise<Role[]>;
};

export const useRolesStore = create<RolesState>()((set) => ({
  roles: [],
  pagination: null,
  isLoading: false,
  error: null,

  listRoles: async (query) => {
    try {
      set({ isLoading: true, error: null });
      const response = await rolesApi.listRoles(query);
      set({
        roles: response.payload,
        pagination: response.pagination ?? null,
        isLoading: false,
        error: null,
      });
      return response.payload;
    } catch {
      set({ isLoading: false, error: "Lấy danh sách vai trò thất bại" });
      throw new Error("Lấy danh sách vai trò thất bại");
    }
  },
}));
