import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { PaymentPlansListTable } from "@/components/Dashboard/PaymentPlans/PaymentPlansListTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePaymentPlansStore } from "@/services/paymentPlans/paymentPlans.store";
import { PRIVATE_ROUTES } from "@/shared/routes";

export default function MyPaymentPlansPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { plans, pagination, isLoading, listByUserId } = usePaymentPlansStore();

  useEffect(() => {
    void listByUserId({ page, page_size: pageSize, status: search.trim() || undefined }).catch(() => {
      toast.error("Không thể tải danh sách kế hoạch chi trả của tôi");
    });
  }, [listByUserId, page, pageSize, search]);

  return (
    <section className="bg-gray-50 pb-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <DashboardListPageHeader title="Kế hoạch chi trả của tôi" description="Lịch sử kế hoạch chi trả" />
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Lọc theo trạng thái" className="max-w-sm" />
        </div>
        {isLoading && plans.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <span className="text-gray-500">Đang tải dữ liệu...</span>
          </div>
        ) : plans.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center"
               >
            <p className="text-xl font-semibold text-gray-900">Bạn chưa có kế hoạch chi trả nào</p>
          </div>
        ) : (
          <PaymentPlansListTable
            data={plans}
            loading={isLoading}
            pagination={pagination}
            onPageChange={setPage}
            onPageSizeChange={(v) => { setPageSize(v); setPage(1); }}
            onView={(item) => navigate(PRIVATE_ROUTES.DASHBOARD_MY_PAYMENT_PLAN_DETAIL.replace(":planId", item.id))}
          />
        )}
      </div>
    </section>
  );
}
