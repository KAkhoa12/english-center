import { useEffect } from "react";

import { DashboardListPageHeader, SectionCard } from "@/components/Dashboard/Comon";
import { useAuthStore } from "@/services/auth/auth.store";
import { useAttendanceStore } from "@/services/attendance/attendance.store";
import { hasRole } from "@/shared/auth/rbac";

export default function DashboardAttendancePage() {
  const me = useAuthStore((state) => state.me);
  const { attendance, isLoading, getMyAttendance } = useAttendanceStore();
  const isStudent = hasRole(me, "student");

  useEffect(() => {
    if (isStudent) {
      void getMyAttendance({ page: 1, page_size: 20 });
    }
  }, [getMyAttendance, isStudent]);

  return (
    <section>
      <DashboardListPageHeader
        title="Điểm danh"
        description="Theo dõi trạng thái điểm danh theo từng buổi học"
      />
      <SectionCard title={isStudent ? "Điểm danh của tôi" : "Quản lý điểm danh"}>
        {!isStudent ? (
          <p className="text-sm text-gray-500">
            Chọn một lớp hoặc buổi học trong phần quản lý lớp học để xem và cập nhật điểm danh.
          </p>
        ) : isLoading ? (
          <p className="text-sm text-gray-500">Đang tải dữ liệu điểm danh...</p>
        ) : attendance.length === 0 ? (
          <p className="text-sm text-gray-500">Chưa có dữ liệu điểm danh.</p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-100">
            {attendance.map((item) => (
              <div
                key={`${item.session_id}-${item.student_id}-${item.recorded_at ?? "pending"}`}
                className="grid gap-2 border-b border-gray-100 px-4 py-3 text-sm last:border-b-0 sm:grid-cols-3"
              >
                <span className="font-medium text-gray-900">{item.status}</span>
                <span className="text-gray-500">{item.check_in_time ?? "Chưa ghi nhận giờ vào"}</span>
                <span className="text-gray-500">{item.note ?? "Không có ghi chú"}</span>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </section>
  );
}
