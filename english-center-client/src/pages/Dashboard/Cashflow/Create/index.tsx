import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cashflowMockStore } from "@/services/cashflow/cashflow.mock";
import { PRIVATE_ROUTES } from "@/shared/routes";

export default function DashboardCashflowCreatePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"income" | "expense">("income");
  const [amount, setAmount] = useState(0);
  const [transactionDate] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = async () => {
    try {
      await cashflowMockStore.create({ title, type, amount, transaction_date: transactionDate, note });
      toast.success("Tao ban ghi thu chi thanh cong");
      navigate(PRIVATE_ROUTES.DASHBOARD_FINANCE_CASHFLOW);
    } catch {
      toast.error("Tao ban ghi thu chi that bai");
    }
  };

  return (
    <section>
      <DashboardListPageHeader title="Tao moi thu chi" description="Trang tao (UI mock, chua ket noi API)" />
      <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input placeholder="Noi dung" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Select value={type} onValueChange={(v: "income" | "expense") => setType(v)}>
            <SelectTrigger><SelectValue placeholder="Loai" /></SelectTrigger>
            <SelectContent><SelectItem value="income">Thu</SelectItem><SelectItem value="expense">Chi</SelectItem></SelectContent>
          </Select>
          <Input type="number" min={0} value={amount} onChange={(e) => setAmount(Number(e.target.value || 0))} placeholder="So tien" />
          {/*<DashboardDateInput value={transactionDate} onChange={setTransactionDate} />*/}
        </div>
        <Textarea placeholder="Ghi chu" value={note} onChange={(e) => setNote(e.target.value)} rows={4} />
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>Quay lai</Button>
          <Button onClick={() => void handleSubmit()}>Luu</Button>
        </div>
      </div>
    </section>
  );
}
