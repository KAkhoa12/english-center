import { create } from "zustand";

import type { ApiResponse, Pagination } from "@/shared/types/response";

import { ordersApi } from "./orders.api";
import type {
  CheckoutRequest,
  ListMyOrdersQuery,
  ListOrdersQuery,
  Order,
  StaffCreateOrderRequest,
} from "./orders.type";

const unwrap = <T>(response: ApiResponse<T>, fallbackMessage: string): T => {
  if (!response.success) throw new Error(response.message || fallbackMessage);
  return response.payload;
};

type OrdersState = {
  orders: Order[];
  pagination: Pagination | null;
  selectedOrder: Order | null;
  isLoading: boolean;
  error: string | null;

  checkout: (data: CheckoutRequest) => Promise<Order>;
  listOrders: (query?: ListOrdersQuery) => Promise<Order[]>;
  myOrders: (query?: ListMyOrdersQuery) => Promise<Order[]>;
  getOrder: (orderId: string) => Promise<Order>;
  getOrderByInvoice: (invoiceNumber: string) => Promise<Order | null>;
  getOrderPaymentStatus: (orderId: string) => Promise<Order>;
  cancelOrder: (orderId: string) => Promise<Order>;
  createOrderForStudent: (data: StaffCreateOrderRequest) => Promise<Order>;
  clearSelectedOrder: () => void;
  clearError: () => void;
};

export const useOrdersStore = create<OrdersState>()((set) => ({
  orders: [],
  pagination: null,
  selectedOrder: null,
  isLoading: false,
  error: null,

  checkout: async (data) => {
    const response = await ordersApi.checkout(data);
    const order = unwrap(response, "Thanh toan don hang that bai");
    set((state) => ({ orders: [order, ...state.orders], selectedOrder: order }));
    return order;
  },

  listOrders: async (query) => {
    const response = await ordersApi.listOrders(query);
    const orders = unwrap(response, "Lay danh sach don hang that bai");
    set({ orders, pagination: response.pagination ?? null });
    return orders;
  },

  myOrders: async (query) => {
    const response = await ordersApi.myOrders(query);
    const orders = unwrap(response, "Lay don hang cua toi that bai");
    set({ orders, pagination: response.pagination ?? null });
    return orders;
  },

  getOrder: async (orderId) => {
    const response = await ordersApi.getOrder(orderId);
    const order = unwrap(response, "Lay thong tin don hang that bai");
    set({ selectedOrder: order });
    return order;
  },

  getOrderByInvoice: async (invoiceNumber) => {
    const response = await ordersApi.getOrderByInvoice(invoiceNumber);
    const order = unwrap(response, "Lay don hang theo hoa don that bai");
    set({ selectedOrder: order });
    return order;
  },

  getOrderPaymentStatus: async (orderId) => {
    const response = await ordersApi.getOrderPaymentStatus(orderId);
    const order = unwrap(response, "Lay trang thai thanh toan that bai");
    set({ selectedOrder: order });
    return order;
  },

  cancelOrder: async (orderId) => {
    const response = await ordersApi.cancelOrder(orderId);
    const order = unwrap(response, "Huy don hang that bai");
    set((state) => ({
      orders: state.orders.map((item) => (item.id === order.id ? order : item)),
      selectedOrder: state.selectedOrder?.id === order.id ? order : state.selectedOrder,
    }));
    return order;
  },

  createOrderForStudent: async (data) => {
    const response = await ordersApi.createOrderForStudent(data);
    const order = unwrap(response, "Tao don hang that bai");
    set((state) => ({ orders: [order, ...state.orders], selectedOrder: order }));
    return order;
  },

  clearSelectedOrder: () => set({ selectedOrder: null }),
  clearError: () => set({ error: null }),
}));
