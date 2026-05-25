import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { DashboardConfirmDeleteDialog, DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { StudentsListTable } from "@/components/Dashboard/Students/StudentsListTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStudentsStore } from "@/services/students/students.store";
import type { Student } from "@/services/students/students.type";
import { PRIVATE_ROUTES } from "@/shared/routes";

export default function DashboardStudentsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleting, setDeleting] = useState<Student | null>(null);
  const { students, pagination, isLoading, listStudents, deleteStudent } = useStudentsStore();

  useEffect(() => { void listStudents({ page, page_size: pageSize, search: search.trim() || undefined }); }, [listStudents, page, pageSize, search]);

  return (<section><DashboardListPageHeader title="Quản lý học viên" description="Theo dõi và quản trị học viên" actions={<Button onClick={() => navigate(PRIVATE_ROUTES.DASHBOARD_STUDENTS_CREATE)}>Thêm học viên</Button>} /><div className="mb-4 max-w-sm"><Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Tìm theo tên, email" /></div><StudentsListTable data={students} loading={isLoading} pagination={pagination} onPageChange={setPage} onPageSizeChange={(v) => { setPageSize(v); setPage(1); }} onEdit={(item) => navigate(PRIVATE_ROUTES.DASHBOARD_STUDENTS_EDIT.replace(":studentId", item.id))} onDelete={setDeleting} /><DashboardConfirmDeleteDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)} description={`Bạn có chắc muốn xóa học viên "${deleting?.user.full_name ?? ""}"?`} onConfirm={async () => { if (!deleting) return; try { await deleteStudent(deleting.id); toast.success("Xóa học viên thành công"); setDeleting(null); } catch { toast.error("Xóa học viên thất bại"); } }} /></section>);
}
