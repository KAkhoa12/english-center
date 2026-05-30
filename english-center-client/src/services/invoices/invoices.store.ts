import { create } from "zustand";

import type { ApiResponse, Pagination } from "@/shared/types/response";

import { invoicesApi } from "./invoices.api";
import type { Invoice, ListInvoicesQuery, ListMyInvoicesQuery } from "./invoices.type";

const unwrap = <T>(response: ApiResponse<T>, fallbackMessage: string): T => {
  if (!response.success) throw new Error(response.message || fallbackMessage);
  return response.payload;
};

type InvoicesState = {
  invoices: Invoice[];
  pagination: Pagination | null;
  selectedInvoice: Invoice | null;
  isLoading: boolean;
  error: string | null;

  listInvoices: (query?: ListInvoicesQuery) => Promise<Invoice[]>;
  myInvoices: (query?: ListMyInvoicesQuery) => Promise<Invoice[]>;
  getInvoice: (invoiceId: string) => Promise<Invoice>;
  getOrderInvoice: (orderId: string) => Promise<Invoice>;
  clearSelectedInvoice: () => void;
  clearError: () => void;
};

export const useInvoicesStore = create<InvoicesState>()((set) => ({
  invoices: [],
  pagination: null,
  selectedInvoice: null,
  isLoading: false,
  error: null,

  listInvoices: async (query) => {
    const response = await invoicesApi.listInvoices(query);
    const invoices = unwrap(response, "Lay danh sach hoa don that bai");
    set({ invoices, pagination: response.pagination ?? null });
    return invoices;
  },

  myInvoices: async (query) => {
    const response = await invoicesApi.myInvoices(query);
    const invoices = unwrap(response, "Lay danh sach hoa don cua toi that bai");
    set({ invoices, pagination: response.pagination ?? null });
    return invoices;
  },

  getInvoice: async (invoiceId) => {
    const response = await invoicesApi.getInvoice(invoiceId);
    const invoice = unwrap(response, "Lay chi tiet hoa don that bai");
    set({ selectedInvoice: invoice });
    return invoice;
  },

  getOrderInvoice: async (orderId) => {
    const response = await invoicesApi.getOrderInvoice(orderId);
    const invoice = unwrap(response, "Lay hoa don theo don hang that bai");
    set({ selectedInvoice: invoice });
    return invoice;
  },

  clearSelectedInvoice: () => set({ selectedInvoice: null }),
  clearError: () => set({ error: null }),
}));
