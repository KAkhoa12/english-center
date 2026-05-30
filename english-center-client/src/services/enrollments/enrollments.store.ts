import { create } from "zustand";

import type { ApiResponse, Pagination } from "@/shared/types/response";

import { enrollmentsApi } from "./enrollments.api";
import type { Enrollment, ListEnrollmentsQuery } from "./enrollments.type";

const unwrap = <T>(response: ApiResponse<T>, fallbackMessage: string): T => {
  if (!response.success) throw new Error(response.message || fallbackMessage);
  return response.payload;
};

type EnrollmentsState = {
  enrollments: Enrollment[];
  pagination: Pagination | null;
  isLoading: boolean;
  error: string | null;

  listEnrollments: (query?: ListEnrollmentsQuery) => Promise<Enrollment[]>;
  myEnrollments: (query?: ListEnrollmentsQuery) => Promise<Enrollment[]>;
  clearError: () => void;
};

export const useEnrollmentsStore = create<EnrollmentsState>()((set) => ({
  enrollments: [],
  pagination: null,
  isLoading: false,
  error: null,

  listEnrollments: async (query) => {
    const response = await enrollmentsApi.listEnrollments(query);
    const enrollments = unwrap(response, "Lay danh sach dang ky that bai");
    set({ enrollments, pagination: response.pagination ?? null });
    return enrollments;
  },

  myEnrollments: async (query) => {
    const response = await enrollmentsApi.myEnrollments(query);
    const enrollments = unwrap(response, "Lay danh sach dang ky cua toi that bai");
    set({ enrollments, pagination: response.pagination ?? null });
    return enrollments;
  },

  clearError: () => set({ error: null }),
}));
