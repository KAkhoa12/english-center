import { apiClient } from "@/config/api-client";

import type {
  ListWishlistQuery,
  WishlistCreateRequest,
  WishlistItem,
} from "./wishlist.type";

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

export const wishlistApi = {
  getWishlist: (query?: ListWishlistQuery) =>
    apiClient.getWithMeta<WishlistItem[]>(appendQuery("/wishlist", query)),

  addWishlist: (data: WishlistCreateRequest) =>
    apiClient.post<{ id: string; course_id: string }, WishlistCreateRequest>("/wishlist", data),

  removeWishlist: (courseId: string) =>
    apiClient.delete<void>(`/wishlist/${courseId}`),

  getWishlistStatus: (courseId: string) =>
    apiClient.get<{ is_favorited: boolean }>(`/courses/${courseId}/wishlist-status`),
};
