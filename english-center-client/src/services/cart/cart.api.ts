import { apiClient } from "@/config/api-client";

import type {
  AddCartItemRequest,
  Cart,
  UpdateCartItemRequest,
} from "./cart.type";

export const cartApi = {
  getCart: () =>
    apiClient.get<Cart>("/cart"),

  addCartItem: (data: AddCartItemRequest) =>
    apiClient.post<Cart, AddCartItemRequest>("/cart/items", data),

  updateCartItem: (cartItemId: string, data: UpdateCartItemRequest) =>
    apiClient.patch<Cart, UpdateCartItemRequest>(`/cart/items/${cartItemId}`, data),

  deleteCartItem: (cartItemId: string) =>
    apiClient.delete<Cart>(`/cart/items/${cartItemId}`),

  clearCart: () =>
    apiClient.delete<Cart>("/cart/clear"),
};
