import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { DashboardConfirmDeleteDialog, DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { RolesListTable } from "@/components/Dashboard/Roles/RolesListTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRolesStore } from "@/services/roles/roles.store";
import type { Role } from "@/services/roles/roles.type";
import { PRIVATE_ROUTES } from "@/shared/routes";

export default function DashboardRolesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleting, setDeleting] = useState<Role | null>(null);
  const { roles, pagination, isLoading, listRoles, deleteRole } = useRolesStore();

  useEffect(() => { void listRoles({ page, page_size: pageSize, search: search.trim() || undefined }); }, [listRoles, page, pageSize, search]);

  return (<section>
    <DashboardListPageHeader title="Quản lý vai trò" description="Theo dõi và quản trị vai trò" actions={<Button onClick={() => navigate(PRIVATE_ROUTES.DASHBOARD_ROLES_CREATE)}>Tạo vai trò</Button>} />
    <div className="mb-4 max-w-sm"><Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Tìm theo tên vai trò" /></div>
    <RolesListTable data={roles} loading={isLoading} pagination={pagination} onPageChange={setPage} onPageSizeChange={(v) => { setPageSize(v); setPage(1); }} onEdit={(item) => navigate(PRIVATE_ROUTES.DASHBOARD_ROLES_EDIT.replace(":roleId", item.id))} onDelete={setDeleting} />
    <DashboardConfirmDeleteDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)} description={`Bạn có chắc muốn xóa vai trò "${deleting?.name ?? ""}"?`} onConfirm={async () => { if (!deleting) return; try { await deleteRole(deleting.id); toast.success("Xóa vai trò thành công"); setDeleting(null); } catch { toast.error("Xóa vai trò thất bại"); } }} />
  </section>);
}
