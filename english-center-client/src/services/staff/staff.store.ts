import { create } from "zustand";

import type { Pagination } from "@/shared/types/response";

import { staffApi } from "./staff.api";
import type {
  ListStaffQuery,
  Staff,
  StaffCreateRequest,
  StaffUpdateRequest,
} from "./staff.type";

type StaffState = {
  staff: Staff[];
  pagination: Pagination | null;
  selectedStaff: Staff | null;
  isLoading: boolean;
  error: string | null;

  listStaff: (query?: ListStaffQuery) => Promise<Staff[]>;
  getStaff: (staffId: string) => Promise<Staff>;
  createStaff: (data: StaffCreateRequest) => Promise<Staff>;
  updateStaff: (staffId: string, data: StaffUpdateRequest) => Promise<Staff>;
  updateStaffAvatar: (staffId: string, file: File) => Promise<Staff>;
  deleteStaff: (staffId: string) => Promise<void>;
  clearSelectedStaff: () => void;
  clearError: () => void;
};

export const useStaffStore = create<StaffState>()((set) => ({
  staff: [],
  pagination: null,
  selectedStaff: null,
  isLoading: false,
  error: null,

  listStaff: async (query) => {
    try {
      set({ isLoading: true, error: null });
      const response = await staffApi.listStaff(query);
      set({ staff: response.payload, pagination: response.pagination ?? null, isLoading: false, error: null });
      return response.payload;
    } catch {
      set({ isLoading: false, error: "Lấy danh sách nhân viên thất bại" });
      throw new Error("Lấy danh sách nhân viên thất bại");
    }
  },

  getStaff: async (staffId) => {
    try {
      set({ isLoading: true, error: null });
      const item = await staffApi.getStaff(staffId);
      set({ selectedStaff: item, isLoading: false, error: null });
      return item;
    } catch {
      set({ isLoading: false, error: "Lấy thông tin nhân viên thất bại" });
      throw new Error("Lấy thông tin nhân viên thất bại");
    }
  },

  createStaff: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const item = await staffApi.createStaff(data);
      set((state) => ({ staff: [item, ...state.staff], selectedStaff: item, isLoading: false, error: null }));
      return item;
    } catch {
      set({ isLoading: false, error: "Tạo nhân viên thất bại" });
      throw new Error("Tạo nhân viên thất bại");
    }
  },

  updateStaff: async (staffId, data) => {
    try {
      set({ isLoading: true, error: null });
      const item = await staffApi.updateStaff(staffId, data);
      set((state) => ({
        staff: state.staff.map((x) => (x.id === item.id ? item : x)),
        selectedStaff: state.selectedStaff?.id === item.id ? item : state.selectedStaff,
        isLoading: false,
        error: null,
      }));
      return item;
    } catch {
      set({ isLoading: false, error: "Cập nhật nhân viên thất bại" });
      throw new Error("Cập nhật nhân viên thất bại");
    }
  },

  updateStaffAvatar: async (staffId, file) => {
    const item = await staffApi.updateStaffAvatar(staffId, file);
    set((state) => ({
      staff: state.staff.map((x) => (x.id === item.id ? item : x)),
      selectedStaff: state.selectedStaff?.id === item.id ? item : state.selectedStaff,
    }));
    return item;
  },

  deleteStaff: async (staffId) => {
    try {
      set({ isLoading: true, error: null });
      await staffApi.deleteStaff(staffId);
      set((state) => ({
        staff: state.staff.filter((x) => x.id !== staffId),
        selectedStaff: state.selectedStaff?.id === staffId ? null : state.selectedStaff,
        isLoading: false,
        error: null,
      }));
    } catch {
      set({ isLoading: false, error: "Xóa nhân viên thất bại" });
      throw new Error("Xóa nhân viên thất bại");
    }
  },

  clearSelectedStaff: () => set({ selectedStaff: null }),
  clearError: () => set({ error: null }),
}));
