export type PaymentInstallment = {
  id: string;
  payment_plan_id: string;
  installment_number: number;
  name: string;
  amount: number;
  due_date: string | null;
  grace_period_days: number | null;
  status: string;
  paid_amount: number | null;
  paid_at: string | null;
};

export type PaymentPlan = {
  id: string;
  order_id: string;
  plan_type: string;
  total_amount: number;
  deposit_amount: number | null;
  installment_count: number | null;
  grace_period_days: number | null;
  status: string;
  created_by: string | null;
  installments: PaymentInstallment[];
};

export type ListPaymentPlansQuery = {
  page?: number;
  page_size?: number;
  status?: string;
};
