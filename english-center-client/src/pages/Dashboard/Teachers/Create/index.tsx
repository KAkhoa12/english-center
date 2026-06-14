import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { TeacherForm } from "@/components/Dashboard/Teachers/TeacherForm";
import { useFilesStore } from "@/services/files/files.store";
import { useTeachersStore } from "@/services/teachers/teachers.store";
import type { TeacherCreateRequest } from "@/services/teachers/teachers.type";
import { PRIVATE_ROUTES } from "@/shared/routes";

export default function DashboardTeacherCreatePage() {
  const navigate = useNavigate();
  const { createTeacher, isLoading } = useTeachersStore();
  const { uploadFile } = useFilesStore();

  return (
    <section>
      <DashboardListPageHeader title="Tạo giáo viên" description="Thêm giáo viên mới" />
      <TeacherForm
        isCreate
        loading={isLoading}
        onSubmit={async (payload, avatarFile) => {
          try {
            const data: TeacherCreateRequest = { ...(payload as TeacherCreateRequest) };
            if (avatarFile) {
              const uploaded = await uploadFile(avatarFile, "avatar", "avatars/teachers");
              data.avatar_url = uploaded.object_name;
            }
            const item = await createTeacher(data);
            toast.success("Tạo giáo viên thành công");
            navigate(PRIVATE_ROUTES.DASHBOARD_TEACHERS_EDIT.replace(":teacherId", item.id));
          } catch {
            toast.error("Tạo giáo viên thất bại");
          }
        }}
      />
    </section>
  );
}
