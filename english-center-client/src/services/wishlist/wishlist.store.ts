import { create } from "zustand";

import type { ApiResponse, Pagination } from "@/shared/types/response";

import { wishlistApi } from "./wishlist.api";
import type {
  ListWishlistQuery,
  WishlistCreateRequest,
  WishlistItem,
} from "./wishlist.type";

const unwrap = <T>(response: ApiResponse<T>, fallbackMessage: string): T => {
  if (!response.success) throw new Error(response.message || fallbackMessage);
  return response.payload;
};

type WishlistState = {
  wishlist: WishlistItem[];
  pagination: Pagination | null;
  favorited: Record<string, boolean>;
  isLoading: boolean;
  error: string | null;

  getWishlist: (query?: ListWishlistQuery) => Promise<WishlistItem[]>;
  addWishlist: (data: WishlistCreateRequest) => Promise<{ id: string; course_id: string }>;
  removeWishlist: (courseId: string) => Promise<void>;
  getWishlistStatus: (courseId: string) => Promise<boolean>;
  clearError: () => void;
};

export const useWishlistStore = create<WishlistState>()((set) => ({
  wishlist: [],
  pagination: null,
  favorited: {},
  isLoading: false,
  error: null,

  getWishlist: async (query) => {
    const response = await wishlistApi.getWishlist(query);
    const wishlist = unwrap(response, "Lay wishlist that bai");
    set({ wishlist, pagination: response.pagination ?? null });
    return wishlist;
  },

  addWishlist: async (data) => {
    const response = await wishlistApi.addWishlist(data);
    const item = unwrap(response, "Them vao wishlist that bai");
    set((state) => ({ favorited: { ...state.favorited, [item.course_id]: true } }));
    return item;
  },

  removeWishlist: async (courseId) => {
    const response = await wishlistApi.removeWishlist(courseId);
    unwrap(response, "Xoa khoi wishlist that bai");
    set((state) => ({
      wishlist: state.wishlist.filter((item) => item.course_id !== courseId),
      favorited: { ...state.favorited, [courseId]: false },
    }));
  },

  getWishlistStatus: async (courseId) => {
    const response = await wishlistApi.getWishlistStatus(courseId);
    const status = unwrap(response, "Lay trang thai wishlist that bai");
    set((state) => ({ favorited: { ...state.favorited, [courseId]: status.is_favorited } }));
    return status.is_favorited;
  },

  clearError: () => set({ error: null }),
}));
