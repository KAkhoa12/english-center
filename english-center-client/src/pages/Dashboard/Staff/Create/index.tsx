import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { StaffForm } from "@/components/Dashboard/Staff/StaffForm";
import { useFilesStore } from "@/services/files/files.store";
import { useStaffStore } from "@/services/staff/staff.store";
import type { StaffCreateRequest } from "@/services/staff/staff.type";
import { PRIVATE_ROUTES } from "@/shared/routes";

export default function DashboardStaffCreatePage() {
  const navigate = useNavigate();
  const { createStaff, isLoading } = useStaffStore();
  const { uploadFile } = useFilesStore();

  return (
    <section>
      <DashboardListPageHeader title="Tạo nhân viên" description="Thêm nhân viên mới" />
      <StaffForm
        isCreate
        loading={isLoading}
        onSubmit={async (payload, avatarFile) => {
          try {
            const data: StaffCreateRequest = { ...(payload as StaffCreateRequest) };
            if (avatarFile) {
              const uploaded = await uploadFile(avatarFile, "avatar", "avatars/staff");
              data.avatar_url = uploaded.object_name;
            }
            const item = await createStaff(data);
            toast.success("Tạo nhân viên thành công");
            navigate(PRIVATE_ROUTES.DASHBOARD_STAFF_EDIT.replace(":staffId", item.id));
          } catch {
            toast.error("Tạo nhân viên thất bại");
          }
        }}
      />
    </section>
  );
}
