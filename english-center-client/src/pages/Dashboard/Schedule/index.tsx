import { useEffect } from "react";
import { CalendarDays } from "lucide-react";

import { DashboardListPageHeader, SectionCard } from "@/components/Dashboard/Comon";
import { useClassSessionsStore } from "@/services/classSessions/classSessions.store";

const formatDate = (value: string) => new Date(value).toLocaleDateString("vi-VN");

export default function DashboardSchedulePage() {
  const { sessions, isLoading, mySessions } = useClassSessionsStore();

  useEffect(() => {
    void mySessions({ page: 1, page_size: 20 });
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
              <div
                key={session.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3"
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
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </section>
  );
}
