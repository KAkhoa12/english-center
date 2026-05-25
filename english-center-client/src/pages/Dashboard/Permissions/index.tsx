import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { DashboardConfirmDeleteDialog, DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { PermissionsListTable } from "@/components/Dashboard/Permissions/PermissionsListTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePermissionsStore } from "@/services/permissions/permissions.store";
import type { Permission } from "@/services/permissions/permissions.type";
import { PRIVATE_ROUTES } from "@/shared/routes";

export default function DashboardPermissionsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleting, setDeleting] = useState<Permission | null>(null);
  const { permissions, pagination, isLoading, listPermissions, deletePermission } = usePermissionsStore();

  useEffect(() => { void listPermissions({ page, page_size: pageSize, search: search.trim() || undefined }); }, [listPermissions, page, pageSize, search]);

  return (<section>
    <DashboardListPageHeader title="Quản lý quyền" description="Theo dõi và quản trị quyền hệ thống" actions={<Button onClick={() => navigate(PRIVATE_ROUTES.DASHBOARD_PERMISSIONS_CREATE)}>Tạo quyền</Button>} />
    <div className="mb-4 max-w-sm"><Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Tìm theo mã hoặc tên quyền" /></div>
    <PermissionsListTable data={permissions} loading={isLoading} pagination={pagination} onPageChange={setPage} onPageSizeChange={(v) => { setPageSize(v); setPage(1); }} onEdit={(item) => navigate(PRIVATE_ROUTES.DASHBOARD_PERMISSIONS_EDIT.replace(":permissionId", item.id))} onDelete={setDeleting} />
    <DashboardConfirmDeleteDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)} description={`Bạn có chắc muốn xóa quyền "${deleting?.code ?? ""}"?`} onConfirm={async () => { if (!deleting) return; try { await deletePermission(deleting.id); toast.success("Xóa quyền thành công"); setDeleting(null); } catch { toast.error("Xóa quyền thất bại"); } }} />
  </section>);
}
