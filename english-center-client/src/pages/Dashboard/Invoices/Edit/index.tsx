import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiClient } from "@/config/api-client";
import { useOrdersStore } from "@/services/orders/orders.store";
import { usePaymentsStore } from "@/services/payments/payments.store";
import { PRIVATE_ROUTES } from "@/shared/routes";

export default function DashboardInvoiceEditPage() {
  const { invoiceId = "" } = useParams();
  const navigate = useNavigate();
  const { selectedOrder, getOrder } = useOrdersStore();
  const { markOrderPaid } = usePaymentsStore();
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [plan, setPlan] = useState<Record<string, unknown> | null>(null);
  const [installments, setInstallments] = useState<Record<string, unknown>[]>([]);
  const [payMethod, setPayMethod] = useState("manual_cash");

  const loadPaymentPlan = useCallback(async (orderId: string) => {
    const res = await apiClient.get<Record<string, unknown> | null>(`/orders/${orderId}/payment-plans`);
    if (!res.success || !res.payload) return;
    setPlan(res.payload);
    const planId = (res.payload as Record<string, unknown>).id as string;
    const instRes = await apiClient.get<Record<string, unknown>[]>(`/payment-plans/${planId}/installments`);
    if (instRes.success) setInstallments(instRes.payload);
  }, []);

  useEffect(() => {
    if (!invoiceId) return;
    void getOrder(invoiceId)
      .then((data) => { setInvoiceNumber(data.invoice_number ?? ""); loadPaymentPlan(invoiceId); })
      .catch(() => toast.error("Khong the tai hoa don"));
  }, [invoiceId, getOrder, loadPaymentPlan]);

  const handleCancel = async () => {
    try {
      await useOrdersStore.getState().cancelOrder(invoiceId);
      toast.success("Da huy don hang");
      navigate(PRIVATE_ROUTES.DASHBOARD_FINANCE_INVOICES);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Huy don that bai");
    }
  };

  const handleMarkPaid = async (installmentId?: string, amount?: number) => {
    try {
      if (installmentId && amount) {
        const res = await apiClient.post(`/installments/${installmentId}/pay`, { amount, payment_method: payMethod });
        if (!res.success) throw new Error(res.message);
        toast.success("Da ghi nhan thanh toan");
        loadPaymentPlan(invoiceId);
      } else {
        await markOrderPaid(invoiceId, { payment_method: payMethod });
        toast.success("Da danh dau da thanh toan");
        getOrder(invoiceId);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Ghi nhan that bai");
    }
  };

  const item = selectedOrder?.items?.[0];
  const fmt = (v: unknown) => (Number(v) || 0).toLocaleString() + " VND";

  return (
    <section>
      <DashboardListPageHeader title="Chi tiet don hang" description="Thong tin don hang va thanh toan" />
      <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5">
        <div className="grid grid-cols-2 gap-4">
          <Input value={selectedOrder?.order_code ?? ""} readOnly placeholder="Ma don hang" />
          <Input value={selectedOrder?.status ?? ""} readOnly placeholder="Trang thai" />
          <Input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} placeholder="So hoa don" />
          <Input value={selectedOrder?.total_amount ? fmt(selectedOrder.total_amount) : ""} readOnly placeholder="Tong tien" />
        </div>
        {item && (
          <div className="rounded-lg bg-gray-50 p-3 text-sm">
            <p><strong>Khoa hoc:</strong> {String(item.course_name)} ({String(item.course_code ?? "")})</p>
            <p><strong>Lop:</strong> {item.class ? String(item.class.name) : "—"}</p>
          </div>
        )}
      </div>

      {plan && (
        <div className="mt-4 space-y-3 rounded-2xl border border-gray-100 bg-white p-5">
          <h3 className="font-semibold">Ke hoach thanh toan</h3>
          <p className="text-sm">Hinh thuc: {String(plan.plan_type)}</p>
          {Number(plan.deposit_amount) > 0 && (
            <p className="text-sm">Tien coc: {fmt(plan.deposit_amount)}</p>
          )}
          {installments.length > 0 && (
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left"><th className="py-1">Dot</th><th>So tien</th><th>Han</th><th>Trang thai</th><th></th></tr></thead>
              <tbody>
                {installments.map((inst) => (
                  <tr key={String(inst.id)} className="border-b">
                    <td className="py-1">{String(inst.installment_number)}</td>
                    <td>{fmt(inst.amount)}</td>
                    <td>{String(inst.due_date ?? "—")}</td>
                    <td>{String(inst.status)}</td>
                    <td>
                      {inst.status === "pending" && (
                        <Button size="sm" variant="outline" onClick={() => handleMarkPaid(String(inst.id), Number(inst.amount))}>
                          Thu tien
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Select value={payMethod} onValueChange={setPayMethod}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <              SelectItem value="cash">Tien mat</SelectItem>
              <SelectItem value="bank_transfer">Chuyen khoan</SelectItem>
            </SelectContent>
          </Select>
          {!plan && (
            <Button onClick={() => handleMarkPaid()}>Danh dau da thanh toan</Button>
          )}
          <Button variant="outline" onClick={() => navigate(-1)}>Quay lai</Button>
          <Button variant="destructive" onClick={() => void handleCancel()}>Huy don</Button>
        </div>
      </div>
    </section>
  );
}
