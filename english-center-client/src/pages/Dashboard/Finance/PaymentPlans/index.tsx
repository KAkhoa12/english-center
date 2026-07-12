import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { PaymentPlansListTable } from "@/components/Dashboard/PaymentPlans/PaymentPlansListTable";
// removed unused Button import
import { Input } from "@/components/ui/input";
import { usePaymentPlansStore } from "@/services/paymentPlans/paymentPlans.store";
import { PRIVATE_ROUTES } from "@/shared/routes";

export default function DashboardPaymentPlansPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { plans, pagination, isLoading, listAll } = usePaymentPlansStore();

  useEffect(() => {
    void listAll({ page, page_size: pageSize, status: search.trim() || undefined }).catch(() => {
      toast.error("Khong the tai danh sach ke hoach chi tra");
    });
  }, [listAll, page, pageSize, search]);

  return (
    <section>
      <DashboardListPageHeader title="Kế hoạch chi trả" description="Quản lý danh sách kế hoạch chi trả" />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Lọc theo trạng thái" className="max-w-sm" />
        {/* Add button for creating new plan if needed */}
      </div>
      <PaymentPlansListTable
        data={plans}
        loading={isLoading}
        pagination={pagination}
        onPageChange={setPage}
        onPageSizeChange={(v) => { setPageSize(v); setPage(1); }}
        onView={(item) => navigate(PRIVATE_ROUTES.DASHBOARD_FINANCE_PAYMENT_PLAN_DETAIL.replace(":planId", item.id))}
      />
    </section>
  );
}
