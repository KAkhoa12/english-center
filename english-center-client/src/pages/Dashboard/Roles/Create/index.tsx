import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { RoleForm } from "@/components/Dashboard/Roles/RoleForm";
import { useRolesStore } from "@/services/roles/roles.store";
import { PRIVATE_ROUTES } from "@/shared/routes";

export default function DashboardRoleCreatePage() {
  const navigate = useNavigate();
  const { createRole, isLoading } = useRolesStore();

  return (<section><DashboardListPageHeader title="Tạo vai trò" description="Tạo vai trò mới" /><RoleForm loading={isLoading} onSubmit={async (payload) => { try { const item = await createRole(payload as import("@/services/roles/roles.type").RoleCreateRequest); toast.success("Tạo vai trò thành công"); navigate(PRIVATE_ROUTES.DASHBOARD_ROLES_EDIT.replace(":roleId", item.id)); } catch { toast.error("Tạo vai trò thất bại"); } }} /></section>);
}
