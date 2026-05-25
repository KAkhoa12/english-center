import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { DashboardConfirmDeleteDialog, DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { StaffListTable } from "@/components/Dashboard/Staff/StaffListTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStaffStore } from "@/services/staff/staff.store";
import type { Staff } from "@/services/staff/staff.type";
import { PRIVATE_ROUTES } from "@/shared/routes";

export default function DashboardStaffPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleting, setDeleting] = useState<Staff | null>(null);
  const { staff, pagination, isLoading, listStaff, deleteStaff } = useStaffStore();

  useEffect(() => { void listStaff({ page, page_size: pageSize, search: search.trim() || undefined }); }, [listStaff, page, pageSize, search]);

  return (<section><DashboardListPageHeader title="Quản lý nhân viên" description="Theo dõi và quản trị nhân viên" actions={<Button onClick={() => navigate(PRIVATE_ROUTES.DASHBOARD_STAFF_CREATE)}>Thêm nhân viên</Button>} /><div className="mb-4 max-w-sm"><Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Tìm theo tên, email" /></div><StaffListTable data={staff} loading={isLoading} pagination={pagination} onPageChange={setPage} onPageSizeChange={(v) => { setPageSize(v); setPage(1); }} onEdit={(item) => navigate(PRIVATE_ROUTES.DASHBOARD_STAFF_EDIT.replace(":staffId", item.id))} onDelete={setDeleting} /><DashboardConfirmDeleteDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)} description={`Bạn có chắc muốn xóa nhân viên "${deleting?.user.full_name ?? ""}"?`} onConfirm={async () => { if (!deleting) return; try { await deleteStaff(deleting.id); toast.success("Xóa nhân viên thành công"); setDeleting(null); } catch { toast.error("Xóa nhân viên thất bại"); } }} /></section>);
}
