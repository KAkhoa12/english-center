import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePaymentPlansStore } from "@/services/paymentPlans/paymentPlans.store";

export default function DashboardPaymentPlanDetailPage() {
  const navigate = useNavigate();
  const { planId } = useParams<{ planId: string }>();
  const { selectedPlan, getPlan } = usePaymentPlansStore();

  useEffect(() => {
    if (planId) {
      void getPlan(planId).catch(() => {
        toast.error("Khong the tai chi tiet ke hoach chi tra");
        navigate(-1);
      });
    }
  }, [planId, getPlan, navigate]);

  if (!selectedPlan) {
    return null; // could show loading state
  }

  return (
    <section className="bg-gray-50 pb-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <DashboardListPageHeader title="Chi tiết kế hoạch chi trả" description="Thông tin chi tiết" />
        <div className="mt-6 space-y-4">
          <p className="text-sm"><strong>ID:</strong> {selectedPlan.id}</p>
          <p className="text-sm"><strong>Order ID:</strong> {selectedPlan.order_id}</p>
          <p className="text-sm"><strong>Type:</strong> {selectedPlan.plan_type}</p>
          <p className="text-sm"><strong>Total:</strong> {selectedPlan.total_amount.toLocaleString("vi-VN")} VNĐ</p>
          <p className="text-sm"><strong>Status:</strong> {selectedPlan.status}</p>
        </div>
        <h2 className="mt-8 text-lg font-semibold">Các khoản trả góp</h2>
        <Table className="mt-4">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Tên</TableHead>
              <TableHead>Số tiền</TableHead>
              <TableHead>Ngày đến hạn</TableHead>
              <TableHead>Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedPlan.installments.map((inst, idx) => (
              <TableRow key={inst.id}>
                <TableCell className="font-medium">{idx + 1}</TableCell>
                <TableCell>{inst.name}</TableCell>
                <TableCell>{inst.amount.toLocaleString("vi-VN")} VNĐ</TableCell>
                <TableCell>{inst.due_date ? new Date(inst.due_date).toLocaleDateString("vi-VN") : "-"}</TableCell>
                <TableCell>{inst.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
