import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useOrdersStore } from "@/services/orders/orders.store";
import { PRIVATE_ROUTES } from "@/shared/routes";

export default function DashboardInvoiceCreatePage() {
  const navigate = useNavigate();
  const { checkout } = useOrdersStore();
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [note, setNote] = useState("");

  const handleCreate = async () => {
    try {
      const created = await checkout({
        buyer_name: buyerName || undefined,
        buyer_email: buyerEmail || undefined,
        buyer_phone: buyerPhone || undefined,
        billing_address: billingAddress || undefined,
        note: note || undefined,
      });
      toast.success("Tao hoa don thanh cong");
      navigate(PRIVATE_ROUTES.DASHBOARD_FINANCE_INVOICES_EDIT.replace(":invoiceId", created.id));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Tao hoa don that bai");
    }
  };

  return (
    <section>
      <DashboardListPageHeader title="Tao hoa don" description="Tao hoa don moi" />
      <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input value={buyerName} onChange={(e) => setBuyerName(e.target.value)} placeholder="Ten nguoi mua" />
          <Input value={buyerEmail} onChange={(e) => setBuyerEmail(e.target.value)} placeholder="Email" />
          <Input value={buyerPhone} onChange={(e) => setBuyerPhone(e.target.value)} placeholder="So dien thoai" />
          <Input value={billingAddress} onChange={(e) => setBillingAddress(e.target.value)} placeholder="Dia chi xuat hoa don" />
        </div>
        <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} placeholder="Ghi chu" />
        <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => navigate(-1)}>Quay lai</Button><Button onClick={() => void handleCreate()}>Luu</Button></div>
      </div>
    </section>
  );
}
