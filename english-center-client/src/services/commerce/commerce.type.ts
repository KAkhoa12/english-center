import type { ApiResponse } from "../common/common.type";

export type CartStatus = string;
export type OrderStatus = string;
export type InvoiceStatus = string;
export type PaymentStatus = string;

export type CartItem = {
  id: string;
  course_id: string;
  course_name: string;
  course_code: string;
  unit_price: number;
  quantity: number;
  total_price: number;
};

export type Cart = {
  id: string;
  user_id: string;
  status: CartStatus;
  items: CartItem[];
  subtotal_amount: number;
  total_items: number;
};

export type WishlistItem = {
  id: string;
  course_id: string;
  course: Record<string, unknown>;
  created_at: string;
};

export type Enrollment = {
  id: string;
  course_id: string;
  course: { id: string; name: string; code: string; thumbnail_url: string | null };
  order_id: string | null;
  enrollment_status: string;
  enrolled_at: string;
};

export type OrderItem = {
  id: string;
  course_id: string;
  course_name: string;
  course_code: string;
  unit_price: number;
  quantity: number;
  total_price: number;
};

export type Payment = {
  id: string;
  order_id: string;
  provider: string;
  payment_method: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  checkout_url: string | null;
  provider_transaction_id: string | null;
  invoice_number?: string;
  checkout_form_fields?: Record<string, unknown>;
};

export type Order = {
  id: string;
  user_id: string;
  order_code: string;
  invoice_number: string;
  status: OrderStatus;
  currency: string;
  subtotal_amount: number;
  discount_amount: number;
  total_amount: number;
  payment_method: string | null;
  items: OrderItem[];
  invoice: { id: string; invoice_number: string; invoice_status: string } | null;
  payments: Payment[];
};

export type Invoice = {
  id: string;
  order_id: string;
  invoice_number: string;
  invoice_status: InvoiceStatus;
  buyer_name: string | null;
  buyer_email: string | null;
  buyer_phone: string | null;
  currency: string;
  subtotal_amount: number;
  discount_amount: number;
  total_amount: number;
  items: Array<{ id: string; item_name: string; item_code: string; unit_price: number; quantity: number; total_price: number }>;
  issued_at: string | null;
  paid_at: string | null;
};

export type AddCartItemRequest = { course_id: string };
export type UpdateCartItemRequest = { quantity: number };
export type WishlistCreateRequest = { course_id: string };
export type CheckoutRequest = {
  note?: string | null;
  buyer_name?: string | null;
  buyer_email?: string | null;
  buyer_phone?: string | null;
  billing_address?: string | null;
};
export type CreateSePayPaymentRequest = { order_id: string; payment_method?: string };

export type GetCartResponse = ApiResponse<Cart>;
export type CartActionResponse = ApiResponse<Cart>;
export type GetWishlistResponse = ApiResponse<WishlistItem[]>;
export type AddWishlistResponse = ApiResponse<{ id: string; course_id: string }>;
export type RemoveWishlistResponse = ApiResponse<null>;
export type WishlistStatusResponse = ApiResponse<{ is_favorited: boolean }>;
export type CheckoutResponse = ApiResponse<Order>;
export type ListOrdersResponse = ApiResponse<Order[]>;
export type GetOrderResponse = ApiResponse<Order>;
export type CancelOrderResponse = ApiResponse<Order>;
export type ListInvoicesResponse = ApiResponse<Invoice[]>;
export type GetInvoiceResponse = ApiResponse<Invoice>;
export type CreateSePayPaymentResponse = ApiResponse<Payment>;
export type GetPaymentResponse = ApiResponse<Payment>;
export type GetOrderPaymentsResponse = ApiResponse<Payment[]>;
export type ListEnrollmentsResponse = ApiResponse<Enrollment[]>;
