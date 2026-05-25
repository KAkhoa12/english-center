import { httpClient } from "@/config/http-client";
import type { ApiResponse, Pagination } from "@/shared/types/response";

export const apiClient = {
  get: async <T>(url: string): Promise<T> => {
    const response = await httpClient.get<ApiResponse<T>>(url);
    return response.data.payload;
  },

  getWithMeta: async <T>(
    url: string
  ): Promise<{ payload: T; pagination?: Pagination }> => {
    const response = await httpClient.get<ApiResponse<T>>(url);
    return {
      payload: response.data.payload,
      pagination: response.data.pagination,
    };
  },

  post: async <T, D = unknown>(url: string, data?: D): Promise<T> => {
    const response = await httpClient.post<ApiResponse<T>>(url, data);
    return response.data.payload;
  },

  put: async <T, D = unknown>(url: string, data?: D): Promise<T> => {
    const response = await httpClient.put<ApiResponse<T>>(url, data);
    return response.data.payload;
  },
  patch: async <T, D = unknown>(url: string, data?: D): Promise<T> => {
    const response = await httpClient.patch<ApiResponse<T>>(url, data);
    return response.data.payload;
  },

  delete: async <T = void>(url: string): Promise<T> => {
    const response = await httpClient.delete<ApiResponse<T>>(url);
    return response.data.payload;
  },
};
