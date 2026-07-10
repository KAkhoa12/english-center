import { Download, Upload } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const importInputRef = useRef<HTMLInputElement | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleting, setDeleting] = useState<Teacher | null>(null);

  const { teachers, pagination, isLoading, listTeachers, deleteTeacher, exportTeachers, importTeachers } =
    useTeachersStore();

  const loadTeachers = useCallback(() => {
    return listTeachers({ page, page_size: pageSize, search: search.trim() || undefined });
  }, [listTeachers, page, pageSize, search]);

  useEffect(() => {
    void loadTeachers();
  }, [loadTeachers]);

  const handleExport = async () => {
    try {
      await exportTeachers();
      toast.success("Xuất dữ liệu giáo viên thành công");
    } catch {
      toast.error("Xuất dữ liệu giáo viên thất bại");
    }
  };

  const handleImport = async (file: File | null) => {
    if (!file) return;

    try {
      const result = await importTeachers(file);
      toast.success(`Nhập dữ liệu giáo viên thành công: ${result.created} tạo mới, ${result.updated} cập nhật`);
      await loadTeachers();
    } catch {
      toast.error("Nhập dữ liệu giáo viên thất bại");
    } finally {
      if (importInputRef.current) {
        importInputRef.current.value = "";
      }
    }
  };

  return (
    <section>
      <DashboardListPageHeader
        title="Quản lý giáo viên"
        description="Theo dõi và quản trị giáo viên"
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
            <Button onClick={() => navigate(PRIVATE_ROUTES.DASHBOARD_TEACHERS_CREATE)}>Thêm giáo viên</Button>
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

      <TeachersListTable
        data={teachers}
        loading={isLoading}
        pagination={pagination}
        onPageChange={setPage}
        onPageSizeChange={(value) => {
          setPageSize(value);
          setPage(1);
        }}
        onEdit={(item) => navigate(PRIVATE_ROUTES.DASHBOARD_TEACHERS_EDIT.replace(":teacherId", item.id))}
        onDelete={setDeleting}
      />

      <DashboardConfirmDeleteDialog
        open={!!deleting}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        description={`Bạn có chắc muốn xóa giáo viên "${deleting?.user.full_name ?? ""}"?`}
        onConfirm={async () => {
          if (!deleting) return;
          try {
            await deleteTeacher(deleting.id);
            toast.success("Xóa giáo viên thành công");
            setDeleting(null);
          } catch {
            toast.error("Xóa giáo viên thất bại");
          }
        }}
      />
    </section>
  );
}
