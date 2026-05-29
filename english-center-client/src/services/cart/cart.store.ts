import { create } from "zustand";

import type { ApiResponse } from "@/shared/types/response";
import { cartApi } from "./cart.api";
import type { AddCartItemRequest, Cart, UpdateCartItemRequest } from "./cart.type";

const unwrap = <T>(response: ApiResponse<T>, fallbackMessage: string): T => {
  if (!response.success) throw new Error(response.message || fallbackMessage);
  return response.payload;
};

type CartState = {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;

  getCart: () => Promise<Cart>;
  addCartItem: (data: AddCartItemRequest) => Promise<Cart>;
  updateCartItem: (cartItemId: string, data: UpdateCartItemRequest) => Promise<Cart>;
  deleteCartItem: (cartItemId: string) => Promise<Cart>;
  clearCart: () => Promise<Cart>;
  clearError: () => void;
};

export const useCartStore = create<CartState>()((set) => ({
  cart: null,
  isLoading: false,
  error: null,

  getCart: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await cartApi.getCart();
      const cart = unwrap(response, "Lay gio hang that bai");
      set({ cart, isLoading: false, error: null });
      return cart;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Lay gio hang that bai";
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  addCartItem: async (data) => {
    const response = await cartApi.addCartItem(data);
    const cart = unwrap(response, "Them san pham vao gio hang that bai");
    set({ cart });
    return cart;
  },

  updateCartItem: async (cartItemId, data) => {
    const response = await cartApi.updateCartItem(cartItemId, data);
    const cart = unwrap(response, "Cap nhat gio hang that bai");
    set({ cart });
    return cart;
  },

  deleteCartItem: async (cartItemId) => {
    const response = await cartApi.deleteCartItem(cartItemId);
    const cart = unwrap(response, "Xoa san pham khoi gio hang that bai");
    set({ cart });
    return cart;
  },

  clearCart: async () => {
    const response = await cartApi.clearCart();
    const cart = unwrap(response, "Xoa gio hang that bai");
    set({ cart });
    return cart;
  },

  clearError: () => set({ error: null }),
}));
