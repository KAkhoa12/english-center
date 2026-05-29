import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { CashflowListTable } from "@/components/Dashboard/Cashflow/CashflowListTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cashflowMockStore, type CashflowItem } from "@/services/cashflow/cashflow.mock";
import { PRIVATE_ROUTES } from "@/shared/routes";

export default function DashboardCashflowPage() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<CashflowItem[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await cashflowMockStore.list(search);
        setItems(data);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [search]);

  return (
    <section>
      <DashboardListPageHeader title="Thu chi" description="Quan ly dong tien (UI mock, chua ket noi API)" />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Tim kiem thu chi" className="max-w-sm" />
        <Button onClick={() => setSearch(searchInput)}>Tim kiem</Button>
        <Button variant="outline" onClick={() => navigate(PRIVATE_ROUTES.DASHBOARD_FINANCE_CASHFLOW_CREATE)}>Them moi</Button>
      </div>
      <CashflowListTable data={items} loading={loading} onEdit={(item) => navigate(PRIVATE_ROUTES.DASHBOARD_FINANCE_CASHFLOW_EDIT.replace(":cashflowId", item.id))} />
    </section>
  );
}
