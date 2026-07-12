import { create } from "zustand";

import type { ApiResponse, Pagination } from "@/shared/types/response";

import { paymentPlansApi } from "./paymentPlans.api";
import type { ListPaymentPlansQuery, PaymentPlan } from "./paymentPlans.type";

const unwrap = <T>(response: ApiResponse<T>, fallbackMessage: string): T => {
  if (!response.success) throw new Error(response.message || fallbackMessage);
  return response.payload;
};

type PaymentPlansState = {
  plans: PaymentPlan[];
  pagination: Pagination | null;
  selectedPlan: PaymentPlan | null;
  isLoading: boolean;
  error: string | null;

  listAll: (query?: ListPaymentPlansQuery) => Promise<PaymentPlan[]>;
  listByUserId: (query?: ListPaymentPlansQuery) => Promise<PaymentPlan[]>;
  getPlan: (planId: string) => Promise<PaymentPlan>;
  listByOrderIds: (orderIds: string[]) => Promise<PaymentPlan[]>;
  clearSelectedPlan: () => void;
  clearError: () => void;
};

export const usePaymentPlansStore = create<PaymentPlansState>()((set) => ({
  plans: [],
  pagination: null,
  selectedPlan: null,
  isLoading: false,
  error: null,

  listAll: async (query) => {
    const response = await paymentPlansApi.listAll(query);
    const plans = unwrap(response, "Lay danh sach ke hoach chi tra that bai");
    set({ plans, pagination: response.pagination ?? null });
    return plans;
  },

  listByUserId: async (query) => {
    const response = await paymentPlansApi.listByUserId(query);
    const plans = unwrap(response, "Lay ke hoach chi tra cua nguoi dung that bai");
    set({ plans, pagination: response.pagination ?? null });
    return plans;
  },

  getPlan: async (planId) => {
    const response = await paymentPlansApi.getPlan(planId);
    const plan = unwrap(response, "Lay chi tiet ke hoach chi tra that bai");
    set({ selectedPlan: plan });
    return plan;
  },

  listByOrderIds: async (orderIds) => {
    const response = await paymentPlansApi.listByOrderIds(orderIds);
    const plans = unwrap(response, "Lay ke hoach chi tra theo order ids that bai");
    set({ plans, pagination: response.pagination ?? null });
    return plans;
  },

  clearSelectedPlan: () => set({ selectedPlan: null }),
  clearError: () => set({ error: null }),
}));
