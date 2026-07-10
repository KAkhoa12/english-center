import { create } from "zustand";

import type { ApiResponse, Pagination } from "@/shared/types/response";

import { staffApi } from "./staff.api";
import type {
  ListStaffQuery,
  StaffImportResult,
  Staff,
  StaffCreateRequest,
  StaffUpdateRequest,
} from "./staff.type";

const unwrap = <T>(response: ApiResponse<T>, fallbackMessage: string): T => {
  if (!response.success) throw new Error(response.message || fallbackMessage);
  return response.payload;
};

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
  exportStaff: () => Promise<void>;
  importStaff: (file: File) => Promise<StaffImportResult>;
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
    const response = await staffApi.listStaff(query);
    const staff = unwrap(response, "Lay danh sach nhan vien that bai");
    set({ staff, pagination: response.pagination ?? null });
    return staff;
  },

  getStaff: async (staffId) => {
    const response = await staffApi.getStaff(staffId);
    const item = unwrap(response, "Lay thong tin nhan vien that bai");
    set({ selectedStaff: item });
    return item;
  },

  createStaff: async (data) => {
    const response = await staffApi.createStaff(data);
    const item = unwrap(response, "Tao nhan vien that bai");
    set((state) => ({ staff: [item, ...state.staff], selectedStaff: item }));
    return item;
  },

  updateStaff: async (staffId, data) => {
    const response = await staffApi.updateStaff(staffId, data);
    const item = unwrap(response, "Cap nhat nhan vien that bai");
    set((state) => ({
      staff: state.staff.map((x) => (x.id === item.id ? item : x)),
      selectedStaff: state.selectedStaff?.id === item.id ? item : state.selectedStaff,
    }));
    return item;
  },

  updateStaffAvatar: async (staffId, file) => {
    const response = await staffApi.updateStaffAvatar(staffId, file);
    const item = unwrap(response, "Cap nhat avatar nhan vien that bai");
    set((state) => ({
      staff: state.staff.map((x) => (x.id === item.id ? item : x)),
      selectedStaff: state.selectedStaff?.id === item.id ? item : state.selectedStaff,
    }));
    return item;
  },

  exportStaff: async () => {
    await staffApi.exportStaff();
  },

  importStaff: async (file) => {
    const response = await staffApi.importStaff(file);
    return unwrap(response, "Nhap du lieu nhan vien that bai");
  },

  deleteStaff: async (staffId) => {
    const response = await staffApi.deleteStaff(staffId);
    unwrap(response, "Xoa nhan vien that bai");
    set((state) => ({
      staff: state.staff.filter((x) => x.id !== staffId),
      selectedStaff: state.selectedStaff?.id === staffId ? null : state.selectedStaff,
    }));
  },

  clearSelectedStaff: () => set({ selectedStaff: null }),
  clearError: () => set({ error: null }),
}));
