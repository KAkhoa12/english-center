import { create } from "zustand";

import type { Pagination } from "@/shared/types/response";

import { staffApi } from "./staff.api";
import type { ListStaffQuery, Staff } from "./staff.type";

type StaffState = {
  staff: Staff[];
  pagination: Pagination | null;
  isLoading: boolean;
  error: string | null;
  listStaff: (query?: ListStaffQuery) => Promise<Staff[]>;
};

export const useStaffStore = create<StaffState>()((set) => ({
  staff: [],
  pagination: null,
  isLoading: false,
  error: null,

  listStaff: async (query) => {
    try {
      set({ isLoading: true, error: null });
      const response = await staffApi.listStaff(query);
      set({
        staff: response.payload,
        pagination: response.pagination ?? null,
        isLoading: false,
        error: null,
      });
      return response.payload;
    } catch {
      set({ isLoading: false, error: "Lấy danh sách nhân viên thất bại" });
      throw new Error("Lấy danh sách nhân viên thất bại");
    }
  },
}));
