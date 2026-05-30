import { create } from "zustand";

import type { ApiResponse } from "@/shared/types/response";

import { paymentsApi } from "./payments.api";
import type {
  MarkOrderPaidRequest,
  Payment,
  SePayCreatePaymentRequest,
  SePayCreatePaymentResponse,
} from "./payments.type";
import type { Order } from "@/services/orders/orders.type";

const unwrap = <T>(response: ApiResponse<T>, fallbackMessage: string): T => {
  if (!response.success) throw new Error(response.message || fallbackMessage);
  return response.payload;
};

type PaymentsState = {
  payments: Payment[];
  selectedPayment: Payment | null;
  latestSePayPayment: SePayCreatePaymentResponse | null;
  isLoading: boolean;
  error: string | null;

  createSePayPayment: (data: SePayCreatePaymentRequest) => Promise<SePayCreatePaymentResponse>;
  getPayment: (paymentId: string) => Promise<Payment>;
  getOrderPayments: (orderId: string) => Promise<Payment[]>;
  markOrderPaid: (orderId: string, data: MarkOrderPaidRequest) => Promise<Order>;
  clearSelectedPayment: () => void;
  clearLatestSePayPayment: () => void;
  clearError: () => void;
};

export const usePaymentsStore = create<PaymentsState>()((set) => ({
  payments: [],
  selectedPayment: null,
  latestSePayPayment: null,
  isLoading: false,
  error: null,

  createSePayPayment: async (data) => {
    const response = await paymentsApi.createSePayPayment(data);
    const payment = unwrap(response, "Tao giao dich SePay that bai");
    set({ latestSePayPayment: payment });
    return payment;
  },

  getPayment: async (paymentId) => {
    const response = await paymentsApi.getPayment(paymentId);
    const payment = unwrap(response, "Lay thong tin thanh toan that bai");
    set({ selectedPayment: payment });
    return payment;
  },

  getOrderPayments: async (orderId) => {
    const response = await paymentsApi.getOrderPayments(orderId);
    const payments = unwrap(response, "Lay danh sach thanh toan that bai");
    set({ payments });
    return payments;
  },

  markOrderPaid: async (orderId, data) => {
    const response = await paymentsApi.markOrderPaid(orderId, data);
    return unwrap(response, "Danh dau thanh toan that bai");
  },

  clearSelectedPayment: () => set({ selectedPayment: null }),
  clearLatestSePayPayment: () => set({ latestSePayPayment: null }),
  clearError: () => set({ error: null }),
}));
