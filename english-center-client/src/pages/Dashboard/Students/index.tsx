import { Download, Upload } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const importInputRef = useRef<HTMLInputElement | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleting, setDeleting] = useState<Student | null>(null);

  const { students, pagination, isLoading, listStudents, deleteStudent, exportStudents, importStudents } =
    useStudentsStore();

  const loadStudents = useCallback(() => {
    return listStudents({ page, page_size: pageSize, search: search.trim() || undefined });
  }, [listStudents, page, pageSize, search]);

  useEffect(() => {
    void loadStudents();
  }, [loadStudents]);

  const handleExport = async () => {
    try {
      await exportStudents();
      toast.success("Xuất dữ liệu học viên thành công");
    } catch {
      toast.error("Xuất dữ liệu học viên thất bại");
    }
  };

  const handleImport = async (file: File | null) => {
    if (!file) return;

    try {
      const result = await importStudents(file);
      toast.success(`Nhập dữ liệu học viên thành công: ${result.created} tạo mới, ${result.updated} cập nhật`);
      await loadStudents();
    } catch {
      toast.error("Nhập dữ liệu học viên thất bại");
    } finally {
      if (importInputRef.current) {
        importInputRef.current.value = "";
      }
    }
  };

  return (
    <section>
      <DashboardListPageHeader
        title="Quản lý học viên"
        description="Theo dõi và quản trị học viên"
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4" />
              Xuất JSON
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                importInputRef.current?.click();
              }}
            >
              <Upload className="h-4 w-4" />
              Nhập JSON
            </Button>
            <Button onClick={() => navigate(PRIVATE_ROUTES.DASHBOARD_STUDENTS_CREATE)}>Thêm học viên</Button>
          </div>
        }
      />

      <input
        ref={importInputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={(event) => void handleImport(event.target.files?.[0] ?? null)}
      />

      <div className="mb-4 max-w-sm">
        <Input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Tìm theo tên, email"
        />
      </div>

      <StudentsListTable
        data={students}
        loading={isLoading}
        pagination={pagination}
        onPageChange={setPage}
        onPageSizeChange={(value) => {
          setPageSize(value);
          setPage(1);
        }}
        onEdit={(item) => navigate(PRIVATE_ROUTES.DASHBOARD_STUDENTS_EDIT.replace(":studentId", item.id))}
        onDelete={setDeleting}
      />

      <DashboardConfirmDeleteDialog
        open={!!deleting}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        description={`Bạn có chắc muốn xóa học viên "${deleting?.user.full_name ?? ""}"?`}
        onConfirm={async () => {
          if (!deleting) return;
          try {
            await deleteStudent(deleting.id);
            toast.success("Xóa học viên thành công");
            setDeleting(null);
          } catch {
            toast.error("Xóa học viên thất bại");
          }
        }}
      />
    </section>
  );
}
