import { httpClient } from "@/config/http-client";
import type { ApiResponse } from "@/shared/types/response";
import axios from "axios";

const getErrorResponse = <T>(error: unknown): ApiResponse<T> => {
  if (axios.isAxiosError<ApiResponse<T>>(error) && error.response?.data) {
    return error.response.data;
  }

  throw error;
};

export const apiClient = {
  get: async <T>(url: string): Promise<ApiResponse<T>> => {
    return httpClient
      .get<ApiResponse<T>>(url)
      .then((response) => response.data)
      .catch(getErrorResponse<T>);
  },

  getWithMeta: async <T>(url: string): Promise<ApiResponse<T>> => {
    return httpClient
      .get<ApiResponse<T>>(url)
      .then((response) => response.data)
      .catch(getErrorResponse<T>);
  },

  post: async <T, D = unknown>(url: string, data?: D): Promise<ApiResponse<T>> => {
    return httpClient
      .post<ApiResponse<T>>(url, data)
      .then((response) => response.data)
      .catch(getErrorResponse<T>);
  },

  put: async <T, D = unknown>(url: string, data?: D): Promise<ApiResponse<T>> => {
    return httpClient
      .put<ApiResponse<T>>(url, data)
      .then((response) => response.data)
      .catch(getErrorResponse<T>);
  },
  patch: async <T, D = unknown>(url: string, data?: D): Promise<ApiResponse<T>> => {
    return httpClient
      .patch<ApiResponse<T>>(url, data)
      .then((response) => response.data)
      .catch(getErrorResponse<T>);
  },

  delete: async <T = void>(url: string): Promise<ApiResponse<T>> => {
    return httpClient
      .delete<ApiResponse<T>>(url)
      .then((response) => response.data)
      .catch(getErrorResponse<T>);
  },
};
