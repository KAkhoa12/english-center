export type InvoiceItem = {
  id: string;
  course_id: string | null;
  class_id: string | null;
  class: {
    id: string;
    name: string;
    code: string | null;
    start_date: string | null;
    status: string;
  } | null;
  item_name: string;
  item_code: string | null;
  unit_price: number;
  quantity: number;
  total_price: number;
};

export type Invoice = {
  id: string;
  order_id: string;
  invoice_number: string;
  invoice_status: string;
  buyer_name: string | null;
  buyer_email: string | null;
  buyer_phone: string | null;
  currency: string;
  subtotal_amount: number;
  discount_amount: number;
  total_amount: number;
  items: InvoiceItem[];
  issued_at: string | null;
  paid_at: string | null;
};

export type ListInvoicesQuery = {
  page?: number;
  page_size?: number;
  status?: string;
  user_id?: string;
};

export type ListMyInvoicesQuery = {
  page?: number;
  page_size?: number;
};
