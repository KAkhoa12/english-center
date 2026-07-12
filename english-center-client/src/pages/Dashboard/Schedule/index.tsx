import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays } from "lucide-react";

import { DashboardListPageHeader, SectionCard } from "@/components/Dashboard/Comon";
import { useClassSessionsStore } from "@/services/classSessions/classSessions.store";
import { PRIVATE_ROUTES } from "@/shared/routes";

const formatDate = (value: string) => new Date(value).toLocaleDateString("vi-VN");

export default function DashboardSchedulePage() {
  const navigate = useNavigate();
  const { sessions, isLoading, mySessions } = useClassSessionsStore();

  useEffect(() => {
    void mySessions({ page: 1, page_size: 100 });
  }, [mySessions]);

  return (
    <section>
      <DashboardListPageHeader
        title="Lịch học"
        description="Theo dõi các buổi học sắp tới của bạn"
      />
      <SectionCard title="Danh sách buổi học">
        {isLoading ? (
          <p className="text-sm text-gray-500">Đang tải lịch học...</p>
        ) : sessions.length === 0 ? (
          <p className="text-sm text-gray-500">Chưa có buổi học nào.</p>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <button
                key={session.id}
                type="button"
                onClick={() => navigate(PRIVATE_ROUTES.DASHBOARD_SCHEDULE_DETAIL.replace(":sessionId", session.id))}
                className="flex w-full flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-left transition hover:border-brand-200 hover:bg-brand-50"
              >
                <div>
                  <p className="font-semibold text-gray-900">{session.title}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {session.class?.name ?? "Lớp học"} · {formatDate(session.session_date)}
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 text-sm font-medium text-brand-600">
                  <CalendarDays className="h-4 w-4" />
                  {session.start_time} - {session.end_time}
                </div>
              </button>
            ))}
          </div>
        )}
      </SectionCard>
    </section>
  );
}
