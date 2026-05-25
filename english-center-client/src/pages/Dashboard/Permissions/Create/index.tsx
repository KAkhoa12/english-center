import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { PermissionForm } from "@/components/Dashboard/Permissions/PermissionForm";
import { usePermissionsStore } from "@/services/permissions/permissions.store";
import { PRIVATE_ROUTES } from "@/shared/routes";

export default function DashboardPermissionCreatePage() {
  const navigate = useNavigate();
  const { createPermission, isLoading } = usePermissionsStore();

  return (<section>
    <DashboardListPageHeader title="Tạo quyền" description="Tạo quyền mới cho hệ thống" />
    <PermissionForm loading={isLoading} onSubmit={async (payload) => { try { const item = await createPermission(payload as import("@/services/permissions/permissions.type").PermissionCreateRequest); toast.success("Tạo quyền thành công"); navigate(PRIVATE_ROUTES.DASHBOARD_PERMISSIONS_EDIT.replace(":permissionId", item.id)); } catch { toast.error("Tạo quyền thất bại"); } }} />
  </section>);
}
