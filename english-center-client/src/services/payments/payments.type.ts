export type Payment = {
  id: string;
  order_id: string;
  provider: string;
  payment_method: string;
  status: string;
  amount: number;
  currency: string;
  checkout_url: string | null;
  provider_transaction_id: string | null;
};

export type SePayCreatePaymentRequest = {
  order_id: string;
  payment_method?: string;
};

export type SePayCreatePaymentResponse = Payment & {
  invoice_number: string;
  checkout_form_fields?: Record<string, unknown> | null;
};

export type SePayIpnResponse = {
  success: boolean;
};

export type MarkOrderPaidRequest = {
  payment_method?: string;
  reference?: string | null;
};
