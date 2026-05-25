import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { StaffForm } from "@/components/Dashboard/Staff/StaffForm";
import { useStaffStore } from "@/services/staff/staff.store";
import { PRIVATE_ROUTES } from "@/shared/routes";

export default function DashboardStaffEditPage() {
  const { staffId = "" } = useParams();
  const navigate = useNavigate();
  const { selectedStaff, isLoading, getStaff, updateStaff, clearSelectedStaff } = useStaffStore();

  useEffect(() => { if (!staffId) return; void getStaff(staffId).catch(() => toast.error("Không thể tải nhân viên")); return () => clearSelectedStaff(); }, [staffId, getStaff, clearSelectedStaff]);

  return (<section><DashboardListPageHeader title="Chỉnh sửa nhân viên" description="Cập nhật thông tin nhân viên" /><StaffForm initialData={selectedStaff} loading={isLoading} onSubmit={async (payload) => { try { await updateStaff(staffId, payload); toast.success("Cập nhật nhân viên thành công"); navigate(PRIVATE_ROUTES.DASHBOARD_STAFF); } catch { toast.error("Cập nhật nhân viên thất bại"); } }} /></section>);
}
