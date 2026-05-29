import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOrdersStore } from "@/services/orders/orders.store";
import { PRIVATE_ROUTES } from "@/shared/routes";

export default function DashboardInvoiceEditPage() {
  const { invoiceId = "" } = useParams();
  const navigate = useNavigate();
  const { selectedOrder, getOrder, cancelOrder } = useOrdersStore();
  const [invoiceNumber, setInvoiceNumber] = useState("");

  useEffect(() => {
    if (!invoiceId) return;
    void getOrder(invoiceId)
      .then((data) => setInvoiceNumber(data.invoice_number))
      .catch(() => toast.error("Khong the tai hoa don"));
  }, [invoiceId, getOrder]);

  const handleCancel = async () => {
    try {
      await cancelOrder(invoiceId);
      toast.success("Cap nhat hoa don thanh cong");
      navigate(PRIVATE_ROUTES.DASHBOARD_FINANCE_INVOICES);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Cap nhat hoa don that bai");
    }
  };

  return (
    <section>
      <DashboardListPageHeader title="Chinh sua hoa don" description="Cap nhat thong tin hoa don" />
      <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} placeholder="So hoa don" />
          <Input value={selectedOrder?.status ?? ""} readOnly placeholder="Trang thai" />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>Quay lai</Button>
          <Button variant="destructive" onClick={() => void handleCancel()}>Huy don</Button>
        </div>
      </div>
    </section>
  );
}
