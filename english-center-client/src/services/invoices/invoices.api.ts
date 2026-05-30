import { apiClient } from "@/config/api-client";

import type { Invoice, ListInvoicesQuery, ListMyInvoicesQuery } from "./invoices.type";

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

export const invoicesApi = {
  listInvoices: (query?: ListInvoicesQuery) =>
    apiClient.getWithMeta<Invoice[]>(appendQuery("/invoices", query)),

  myInvoices: (query?: ListMyInvoicesQuery) =>
    apiClient.getWithMeta<Invoice[]>(appendQuery("/invoices/my", query)),

  getInvoice: (invoiceId: string) =>
    apiClient.get<Invoice>(`/invoices/${invoiceId}`),

  getOrderInvoice: (orderId: string) =>
    apiClient.get<Invoice>(`/orders/${orderId}/invoice`),
};
