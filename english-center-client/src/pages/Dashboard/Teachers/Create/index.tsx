import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { TeacherForm } from "@/components/Dashboard/Teachers/TeacherForm";
import { useTeachersStore } from "@/services/teachers/teachers.store";
import { PRIVATE_ROUTES } from "@/shared/routes";

export default function DashboardTeacherCreatePage() {
  const navigate = useNavigate();
  const { createTeacher, isLoading } = useTeachersStore();

  return (<section><DashboardListPageHeader title="Tạo giáo viên" description="Thêm giáo viên mới" /><TeacherForm isCreate loading={isLoading} onSubmit={async (payload) => { try { const item = await createTeacher(payload as import("@/services/teachers/teachers.type").TeacherCreateRequest); toast.success("Tạo giáo viên thành công"); navigate(PRIVATE_ROUTES.DASHBOARD_TEACHERS_EDIT.replace(":teacherId", item.id)); } catch { toast.error("Tạo giáo viên thất bại"); } }} /></section>);
}
