import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { StudentForm } from "@/components/Dashboard/Students/StudentForm";
import { useStudentsStore } from "@/services/students/students.store";
import { PRIVATE_ROUTES } from "@/shared/routes";

export default function DashboardStudentEditPage() {
  const { studentId = "" } = useParams();
  const navigate = useNavigate();
  const { selectedStudent, isLoading, getStudent, updateStudent, clearSelectedStudent } = useStudentsStore();

  useEffect(() => { if (!studentId) return; void getStudent(studentId).catch(() => toast.error("Không thể tải học viên")); return () => clearSelectedStudent(); }, [studentId, getStudent, clearSelectedStudent]);

  return (<section><DashboardListPageHeader title="Chỉnh sửa học viên" description="Cập nhật thông tin học viên" /><StudentForm initialData={selectedStudent} loading={isLoading} onSubmit={async (payload) => { try { await updateStudent(studentId, payload); toast.success("Cập nhật học viên thành công"); navigate(PRIVATE_ROUTES.DASHBOARD_STUDENTS); } catch { toast.error("Cập nhật học viên thất bại"); } }} /></section>);
}
