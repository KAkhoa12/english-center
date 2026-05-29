import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { InvoicesListTable } from "@/components/Dashboard/Invoices/InvoicesListTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOrdersStore } from "@/services/orders/orders.store";
import { PRIVATE_ROUTES } from "@/shared/routes";

export default function DashboardInvoicesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { orders, pagination, isLoading, listOrders } = useOrdersStore();

  useEffect(() => {
    void listOrders({ page, page_size: pageSize, status: search.trim() || undefined }).catch(() => {
      toast.error("Khong the tai danh sach hoa don");
    });
  }, [listOrders, page, pageSize, search]);

  return (
    <section>
      <DashboardListPageHeader title="Hoa don" description="Quan ly danh sach hoa don" />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Loc theo trang thai" className="max-w-sm" />
        <Button variant="outline" onClick={() => navigate(PRIVATE_ROUTES.DASHBOARD_FINANCE_INVOICES_CREATE)}>Tao moi</Button>
      </div>
      <InvoicesListTable data={orders} loading={isLoading} pagination={pagination} onPageChange={setPage} onPageSizeChange={(v) => { setPageSize(v); setPage(1); }} onEdit={(item) => navigate(PRIVATE_ROUTES.DASHBOARD_FINANCE_INVOICES_EDIT.replace(":invoiceId", item.id))} />
    </section>
  );
}
