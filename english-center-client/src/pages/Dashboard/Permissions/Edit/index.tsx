import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { PermissionForm } from "@/components/Dashboard/Permissions/PermissionForm";
import { usePermissionsStore } from "@/services/permissions/permissions.store";
import { PRIVATE_ROUTES } from "@/shared/routes";

export default function DashboardPermissionEditPage() {
  const { permissionId = "" } = useParams();
  const navigate = useNavigate();
  const { selectedPermission, isLoading, getPermission, updatePermission, clearSelectedPermission } = usePermissionsStore();

  useEffect(() => {
    if (!permissionId) return;
    void getPermission(permissionId).catch(() => toast.error("Không thể tải quyền"));
    return () => clearSelectedPermission();
  }, [permissionId, getPermission, clearSelectedPermission]);

  return (<section>
    <DashboardListPageHeader title="Chỉnh sửa quyền" description="Cập nhật thông tin quyền" />
    <PermissionForm initialData={selectedPermission} loading={isLoading} onSubmit={async (payload) => { try { await updatePermission(permissionId, payload); toast.success("Cập nhật quyền thành công"); navigate(PRIVATE_ROUTES.DASHBOARD_PERMISSIONS); } catch { toast.error("Cập nhật quyền thất bại"); } }} />
  </section>);
}
