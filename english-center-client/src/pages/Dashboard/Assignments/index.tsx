import { useEffect } from "react";

import { DashboardListPageHeader, SectionCard } from "@/components/Dashboard/Comon";
import { useAuthStore } from "@/services/auth/auth.store";
import { useAssignmentsStore } from "@/services/assignments/assignments.store";
import { hasRole } from "@/shared/auth/rbac";

const formatDueDate = (value: string | null) =>
  value ? new Date(value).toLocaleString("vi-VN") : "Không giới hạn";

export default function DashboardAssignmentsPage() {
  const me = useAuthStore((state) => state.me);
  const { assignments, isLoading, myAssignments } = useAssignmentsStore();
  const isStudent = hasRole(me, "student");

  useEffect(() => {
    if (isStudent) {
      void myAssignments({ page: 1, page_size: 20 });
    }
  }, [isStudent, myAssignments]);

  return (
    <section>
      <DashboardListPageHeader
        title="Bài tập"
        description="Theo dõi bài tập được giao và trạng thái nộp bài"
      />
      <SectionCard title={isStudent ? "Bài tập của tôi" : "Quản lý bài tập"}>
        {!isStudent ? (
          <p className="text-sm text-gray-500">
            Bài tập được quản lý theo từng lớp học. Vào chi tiết lớp để tạo, xuất bản hoặc chấm bài.
          </p>
        ) : isLoading ? (
          <p className="text-sm text-gray-500">Đang tải bài tập...</p>
        ) : assignments.length === 0 ? (
          <p className="text-sm text-gray-500">Chưa có bài tập nào.</p>
        ) : (
          <div className="space-y-3">
            {assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">{assignment.title}</p>
                    <p className="mt-1 text-sm text-gray-500">
                      {assignment.class?.name ?? "Lớp học"} · Hạn nộp: {formatDueDate(assignment.due_at)}
                    </p>
                  </div>
                  <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
                    {assignment.my_submission?.status ?? assignment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </section>
  );
}
