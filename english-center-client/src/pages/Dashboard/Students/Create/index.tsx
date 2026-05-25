import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { StudentForm } from "@/components/Dashboard/Students/StudentForm";
import { useStudentsStore } from "@/services/students/students.store";
import { PRIVATE_ROUTES } from "@/shared/routes";

export default function DashboardStudentCreatePage() {
  const navigate = useNavigate();
  const { createStudent, isLoading } = useStudentsStore();

  return (<section><DashboardListPageHeader title="Tạo học viên" description="Thêm học viên mới" /><StudentForm isCreate loading={isLoading} onSubmit={async (payload) => { try { const item = await createStudent(payload as import("@/services/students/students.type").StudentCreateRequest); toast.success("Tạo học viên thành công"); navigate(PRIVATE_ROUTES.DASHBOARD_STUDENTS_EDIT.replace(":studentId", item.id)); } catch { toast.error("Tạo học viên thất bại"); } }} /></section>);
}
