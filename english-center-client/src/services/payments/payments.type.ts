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

export type SePayCreatePaymentRequest = {
  order_id: string;
  payment_method?: string;
  payment_type?: string;
};

export type SePayCreatePaymentResponse = Payment & {
  invoice_number: string;
  checkout_form_fields?: Record<string, unknown> | null;
};

export type MarkOrderPaidRequest = {
  payment_method?: string;
  reference?: string | null;
};
