import { create } from "zustand";

import type { ApiResponse, Pagination } from "@/shared/types/response";

import { guestEnrollmentsApi } from "./guestEnrollments.api";
import type {
  GuestEnrollment,
  GuestEnrollmentCreateRequest,
  GuestEnrollmentUpdateRequest,
  ListGuestEnrollmentsQuery,
} from "./guestEnrollments.type";

const unwrap = <T>(response: ApiResponse<T>, fallbackMessage: string): T => {
  if (!response.success) throw new Error(response.message || fallbackMessage);
  return response.payload;
};

type GuestEnrollmentsState = {
  guestEnrollments: GuestEnrollment[];
  pagination: Pagination | null;
  selectedGuestEnrollment: GuestEnrollment | null;
  isLoading: boolean;
  error: string | null;
  message: string | null;

  listGuestEnrollments: (query?: ListGuestEnrollmentsQuery) => Promise<GuestEnrollment[]>;
  getGuestEnrollment: (guestEnrollmentId: string) => Promise<GuestEnrollment>;
  createGuestEnrollment: (data: GuestEnrollmentCreateRequest) => Promise<GuestEnrollment>;
  updateGuestEnrollment: (guestEnrollmentId: string, data: GuestEnrollmentUpdateRequest) => Promise<GuestEnrollment>;
  deleteGuestEnrollment: (guestEnrollmentId: string) => Promise<void>;
  clearSelectedGuestEnrollment: () => void;
  clearError: () => void;
};

export const useGuestEnrollmentsStore = create<GuestEnrollmentsState>()((set) => ({
  guestEnrollments: [],
  pagination: null,
  selectedGuestEnrollment: null,
  isLoading: false,
  error: null,
  message: null,

  listGuestEnrollments: async (query) => {
    try {
      set({ isLoading: true, error: null });
      const response = await guestEnrollmentsApi.listGuestEnrollments(query);
      const guestEnrollments = unwrap(response, "Lấy danh sách khách vãng lai thất bại");
      set({
        guestEnrollments,
        pagination: response.pagination ?? null,
        isLoading: false,
        error: null,
        message: response.message,
      });
      return guestEnrollments;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Lấy danh sách khách vãng lai thất bại";
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  getGuestEnrollment: async (guestEnrollmentId) => {
    const response = await guestEnrollmentsApi.getGuestEnrollment(guestEnrollmentId);
    const guestEnrollment = unwrap(response, "Lấy thông tin khách vãng lai thất bại");
    set({ selectedGuestEnrollment: guestEnrollment, message: response.message });
    return guestEnrollment;
  },

  createGuestEnrollment: async (data) => {
    const response = await guestEnrollmentsApi.createGuestEnrollment(data);
    const guestEnrollment = unwrap(response, "Tạo khách vãng lai thất bại");
    set((state) => ({
      guestEnrollments: [guestEnrollment, ...state.guestEnrollments],
      selectedGuestEnrollment: guestEnrollment,
      message: response.message,
    }));
    return guestEnrollment;
  },

  updateGuestEnrollment: async (guestEnrollmentId, data) => {
    const response = await guestEnrollmentsApi.updateGuestEnrollment(guestEnrollmentId, data);
    const guestEnrollment = unwrap(response, "Cập nhật khách vãng lai thất bại");
    set((state) => ({
      guestEnrollments: state.guestEnrollments.map((item) => (item.id === guestEnrollment.id ? guestEnrollment : item)),
      selectedGuestEnrollment:
        state.selectedGuestEnrollment?.id === guestEnrollment.id ? guestEnrollment : state.selectedGuestEnrollment,
      message: response.message,
    }));
    return guestEnrollment;
  },

  deleteGuestEnrollment: async (guestEnrollmentId) => {
    const response = await guestEnrollmentsApi.deleteGuestEnrollment(guestEnrollmentId);
    unwrap(response, "Xóa khách vãng lai thất bại");
    set((state) => ({
      guestEnrollments: state.guestEnrollments.filter((item) => item.id !== guestEnrollmentId),
      selectedGuestEnrollment:
        state.selectedGuestEnrollment?.id === guestEnrollmentId ? null : state.selectedGuestEnrollment,
      message: response.message,
    }));
  },

  clearSelectedGuestEnrollment: () => set({ selectedGuestEnrollment: null }),
  clearError: () => set({ error: null }),
}));
