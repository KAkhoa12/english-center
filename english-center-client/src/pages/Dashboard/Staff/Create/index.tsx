import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { StaffForm } from "@/components/Dashboard/Staff/StaffForm";
import { useStaffStore } from "@/services/staff/staff.store";
import { PRIVATE_ROUTES } from "@/shared/routes";

export default function DashboardStaffCreatePage() {
  const navigate = useNavigate();
  const { createStaff, isLoading } = useStaffStore();

  return (<section><DashboardListPageHeader title="Tạo nhân viên" description="Thêm nhân viên mới" /><StaffForm isCreate loading={isLoading} onSubmit={async (payload) => { try { const item = await createStaff(payload as import("@/services/staff/staff.type").StaffCreateRequest); toast.success("Tạo nhân viên thành công"); navigate(PRIVATE_ROUTES.DASHBOARD_STAFF_EDIT.replace(":staffId", item.id)); } catch { toast.error("Tạo nhân viên thất bại"); } }} /></section>);
}
