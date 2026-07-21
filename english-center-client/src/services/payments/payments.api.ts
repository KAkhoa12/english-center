import { apiClient } from "@/config/api-client";

import type {
  MarkOrderPaidRequest,
  Payment,
  SePayCreatePaymentRequest,
  SePayCreatePaymentResponse,
} from "./payments.type";
import type { Order } from "@/services/orders/orders.type";

export const paymentsApi = {
  createSePayPayment: (data: SePayCreatePaymentRequest) =>
    apiClient.post<SePayCreatePaymentResponse, SePayCreatePaymentRequest>("/payments/sepay/create", data),

  getPayment: (paymentId: string) =>
    apiClient.get<Payment>(`/payments/${paymentId}`),

  getOrderPayments: (orderId: string) =>
    apiClient.get<Payment[]>(`/orders/${orderId}/payments`),

  markOrderPaid: (orderId: string, data: MarkOrderPaidRequest) =>
    apiClient.post<Order, MarkOrderPaidRequest>(`/orders/${orderId}/payments/mark-paid`, data),
};
