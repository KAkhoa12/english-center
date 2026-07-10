import { Download, Upload } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const importInputRef = useRef<HTMLInputElement | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleting, setDeleting] = useState<Staff | null>(null);

  const { staff, pagination, isLoading, listStaff, deleteStaff, exportStaff, importStaff } = useStaffStore();

  const loadStaff = useCallback(() => {
    return listStaff({ page, page_size: pageSize, search: search.trim() || undefined });
  }, [listStaff, page, pageSize, search]);

  useEffect(() => {
    void loadStaff();
  }, [loadStaff]);

  const handleExport = async () => {
    try {
      await exportStaff();
      toast.success("Xuất dữ liệu nhân viên thành công");
    } catch {
      toast.error("Xuất dữ liệu nhân viên thất bại");
    }
  };

  const handleImport = async (file: File | null) => {
    if (!file) return;

    try {
      const result = await importStaff(file);
      toast.success(`Nhập dữ liệu nhân viên thành công: ${result.created} tạo mới, ${result.updated} cập nhật`);
      await loadStaff();
    } catch {
      toast.error("Nhập dữ liệu nhân viên thất bại");
    } finally {
      if (importInputRef.current) {
        importInputRef.current.value = "";
      }
    }
  };

  return (
    <section>
      <DashboardListPageHeader
        title="Quản lý nhân viên"
        description="Theo dõi và quản trị nhân viên"
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
            <Button onClick={() => navigate(PRIVATE_ROUTES.DASHBOARD_STAFF_CREATE)}>Thêm nhân viên</Button>
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

      <StaffListTable
        data={staff}
        loading={isLoading}
        pagination={pagination}
        onPageChange={setPage}
        onPageSizeChange={(value) => {
          setPageSize(value);
          setPage(1);
        }}
        onEdit={(item) => navigate(PRIVATE_ROUTES.DASHBOARD_STAFF_EDIT.replace(":staffId", item.id))}
        onDelete={setDeleting}
      />

      <DashboardConfirmDeleteDialog
        open={!!deleting}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        description={`Bạn có chắc muốn xóa nhân viên "${deleting?.user.full_name ?? ""}"?`}
        onConfirm={async () => {
          if (!deleting) return;
          try {
            await deleteStaff(deleting.id);
            toast.success("Xóa nhân viên thành công");
            setDeleting(null);
          } catch {
            toast.error("Xóa nhân viên thất bại");
          }
        }}
      />
    </section>
  );
}
