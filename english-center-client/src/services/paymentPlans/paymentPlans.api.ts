import { apiClient } from "@/config/api-client";

import type {
  ListPaymentPlansQuery,
  PaymentPlan,
} from "./paymentPlans.type";

export const paymentPlansApi = {
  listAll: (query?: ListPaymentPlansQuery) =>
    apiClient.getWithMeta<PaymentPlan[]>(appendQuery("/payment-plans", query)),

  listByUserId: (query?: ListPaymentPlansQuery) =>
    apiClient.getWithMeta<PaymentPlan[]>(appendQuery("/payment-plans/my", query)),

  getPlan: (planId: string) =>
    apiClient.get<PaymentPlan>(`/payment-plans/${planId}`),

  listByOrderIds: (orderIds: string[]) =>
    apiClient.post<PaymentPlan[], { order_ids: string[] }>("/payment-plans/by-order-ids", { order_ids: orderIds }),
};

// Helper to append query parameters
const appendQuery = (url: string, query?: Record<string, unknown>): string => {
  if (!query) return url;
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    params.set(key, String(value));
  });
  const queryString = params.toString();
  return queryString ? `${url}?${queryString}` : url;
};
