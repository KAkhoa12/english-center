import { apiClient } from "@/config/api-client";

import type {
  CheckoutRequest,
  ListMyOrdersQuery,
  ListOrdersQuery,
  Order,
  StaffCreateOrderRequest,
} from "./orders.type";

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

export const ordersApi = {
  checkout: (data: CheckoutRequest) =>
    apiClient.post<Order, CheckoutRequest>("/orders/checkout", data),

  listOrders: (query?: ListOrdersQuery) =>
    apiClient.getWithMeta<Order[]>(appendQuery("/orders", query)),

  myOrders: (query?: ListMyOrdersQuery) =>
    apiClient.getWithMeta<Order[]>(appendQuery("/orders/my", query)),

  getOrder: (orderId: string) =>
    apiClient.get<Order>(`/orders/${orderId}`),

  getOrderByInvoice: (invoiceNumber: string) =>
    apiClient.get<Order | null>(`/orders/by-invoice/${invoiceNumber}`),

  getOrderPaymentStatus: (orderId: string) =>
    apiClient.get<Order>(`/orders/${orderId}/payment-status`),

  cancelOrder: (orderId: string) =>
    apiClient.patch<Order, undefined>(`/orders/${orderId}/cancel`),

  createOrderForStudent: (data: StaffCreateOrderRequest) =>
    apiClient.post<Order, StaffCreateOrderRequest>("/orders/create-for-student", data),
};
