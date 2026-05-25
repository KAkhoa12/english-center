import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { RoleForm } from "@/components/Dashboard/Roles/RoleForm";
import { useRolesStore } from "@/services/roles/roles.store";
import { PRIVATE_ROUTES } from "@/shared/routes";

export default function DashboardRoleEditPage() {
  const { roleId = "" } = useParams();
  const navigate = useNavigate();
  const { selectedRole, isLoading, getRole, updateRole, clearSelectedRole } = useRolesStore();

  useEffect(() => { if (!roleId) return; void getRole(roleId).catch(() => toast.error("Không thể tải vai trò")); return () => clearSelectedRole(); }, [roleId, getRole, clearSelectedRole]);

  return (<section><DashboardListPageHeader title="Chỉnh sửa vai trò" description="Cập nhật thông tin vai trò" /><RoleForm initialData={selectedRole} loading={isLoading} onSubmit={async (payload) => { try { await updateRole(roleId, payload); toast.success("Cập nhật vai trò thành công"); navigate(PRIVATE_ROUTES.DASHBOARD_ROLES); } catch { toast.error("Cập nhật vai trò thất bại"); } }} /></section>);
}
