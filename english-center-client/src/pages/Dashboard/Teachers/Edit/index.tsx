import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { TeacherForm } from "@/components/Dashboard/Teachers/TeacherForm";
import { useTeachersStore } from "@/services/teachers/teachers.store";
import { PRIVATE_ROUTES } from "@/shared/routes";

export default function DashboardTeacherEditPage() {
  const { teacherId = "" } = useParams();
  const navigate = useNavigate();
  const { selectedTeacher, isLoading, getTeacher, updateTeacher, clearSelectedTeacher } = useTeachersStore();

  useEffect(() => { if (!teacherId) return; void getTeacher(teacherId).catch(() => toast.error("Không thể tải giáo viên")); return () => clearSelectedTeacher(); }, [teacherId, getTeacher, clearSelectedTeacher]);

  return (<section><DashboardListPageHeader title="Chỉnh sửa giáo viên" description="Cập nhật thông tin giáo viên" /><TeacherForm initialData={selectedTeacher} loading={isLoading} onSubmit={async (payload) => { try { await updateTeacher(teacherId, payload); toast.success("Cập nhật giáo viên thành công"); navigate(PRIVATE_ROUTES.DASHBOARD_TEACHERS); } catch { toast.error("Cập nhật giáo viên thất bại"); } }} /></section>);
}
