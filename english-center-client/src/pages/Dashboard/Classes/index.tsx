import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { ClassesListTable } from "@/components/Dashboard/Classes/ClassesListTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useClassesStore } from "@/services/classes/classes.store";
import type { Pagination } from "@/shared/types/response";
import { PRIVATE_ROUTES } from "@/shared/routes";

export default function DashboardClassesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { classes, isLoading, listClasses } = useClassesStore();

  useEffect(() => {
    void listClasses({ search: search.trim() || undefined }).catch(() => toast.error("Khong the tai danh sach lop hoc"));
  }, [listClasses, search]);

  const pagination = useMemo<Pagination>(() => {
    const totalItems = classes.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const safePage = Math.min(page, totalPages);
    return {
      page: safePage,
      page_size: pageSize,
      total_items: totalItems,
      total_pages: totalPages,
      has_next: safePage < totalPages,
      has_previous: safePage > 1,
    };
  }, [classes.length, page, pageSize]);

  const visible = useMemo(() => {
    const start = (pagination.page - 1) * pageSize;
    return classes.slice(start, start + pageSize);
  }, [classes, pagination.page, pageSize]);

  return (
    <section>
      <DashboardListPageHeader title="Quan ly lop hoc" description="Quan tri cac lop hoc" />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Tim theo ten lop" className="max-w-sm" />
        <Button variant="outline" onClick={() => navigate(PRIVATE_ROUTES.DASHBOARD_CLASSES_CREATE)}>Them lop hoc</Button>
      </div>
      <ClassesListTable data={visible} loading={isLoading} pagination={pagination} onPageChange={setPage} onPageSizeChange={(v) => { setPageSize(v); setPage(1); }} onEdit={(item) => navigate(PRIVATE_ROUTES.DASHBOARD_CLASSES_EDIT.replace(":classId", item.id))} />
    </section>
  );
}
