import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { DashboardConfirmDeleteDialog, DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { TeachersListTable } from "@/components/Dashboard/Teachers/TeachersListTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTeachersStore } from "@/services/teachers/teachers.store";
import type { Teacher } from "@/services/teachers/teachers.type";
import { PRIVATE_ROUTES } from "@/shared/routes";

export default function DashboardTeachersPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleting, setDeleting] = useState<Teacher | null>(null);
  const { teachers, pagination, isLoading, listTeachers, deleteTeacher } = useTeachersStore();

  useEffect(() => { void listTeachers({ page, page_size: pageSize, search: search.trim() || undefined }); }, [listTeachers, page, pageSize, search]);

  return (<section><DashboardListPageHeader title="Quản lý giáo viên" description="Theo dõi và quản trị giáo viên" actions={<Button onClick={() => navigate(PRIVATE_ROUTES.DASHBOARD_TEACHERS_CREATE)}>Thêm giáo viên</Button>} /><div className="mb-4 max-w-sm"><Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Tìm theo tên, email" /></div><TeachersListTable data={teachers} loading={isLoading} pagination={pagination} onPageChange={setPage} onPageSizeChange={(v) => { setPageSize(v); setPage(1); }} onEdit={(item) => navigate(PRIVATE_ROUTES.DASHBOARD_TEACHERS_EDIT.replace(":teacherId", item.id))} onDelete={setDeleting} /><DashboardConfirmDeleteDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)} description={`Bạn có chắc muốn xóa giáo viên "${deleting?.user.full_name ?? ""}"?`} onConfirm={async () => { if (!deleting) return; try { await deleteTeacher(deleting.id); toast.success("Xóa giáo viên thành công"); setDeleting(null); } catch { toast.error("Xóa giáo viên thất bại"); } }} /></section>);
}
