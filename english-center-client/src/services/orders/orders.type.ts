
export type OrderItemClassRef = {
  id: string;
  name: string;
  code: string | null;
  start_date: string | null;
  status: string;
};

export type OrderItem = {
  id: string;
  course_id: string;
  class_id: string | null;
  class: OrderItemClassRef | null;
  course_name: string;
  course_code: string | null;
  unit_price: number;
  quantity: number;
  total_price: number;
};

export type OrderInvoiceRef = {
  id: string;
  invoice_number: string;
  invoice_status: string;
};

export type Payment = {
  id: string;
  order_id: string;
  provider: string;
  payment_method: string;
  status: string;
  amount: number;
  currency: string;
  checkout_url: string | null;
  external_order_id: string | null;
  external_transaction_id: string | null;
  provider_transaction_id: string | null;
  provider_payment_id: string | null;
  paid_at: string | null;
  failed_at: string | null;
  cancelled_at: string | null;
};

export type Order = {
  id: string;
  user_id: string;
  order_code: string;
  invoice_number: string | null;
  status: string;
  currency: string;
  subtotal_amount: number;
  discount_amount: number;
  total_amount: number;
  payment_method: string | null;
  items: OrderItem[];
  invoice: OrderInvoiceRef | null;
  payments: Payment[];
};

export type CheckoutRequest = {
  note?: string | null;
  buyer_name?: string | null;
  buyer_email?: string | null;
  buyer_phone?: string | null;
  billing_address?: string | null;
};

export type ListOrdersQuery = {
  page?: number;
  page_size?: number;
  status?: string;
  user_id?: string;
};

export type ListMyOrdersQuery = {
  page?: number;
  page_size?: number;
};
