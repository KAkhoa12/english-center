import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { WeeklySchedule, formatDateParam, getWeekRange } from "@/components/Dashboard/Schedule/WeeklySchedule";
import { useClassSessionsStore } from "@/services/classSessions/classSessions.store";
import { PRIVATE_ROUTES } from "@/shared/routes";

export default function DashboardTeachingSchedulePage() {
  const navigate = useNavigate();
  const { sessions, isLoading, listAllSessions } = useClassSessionsStore();
  const [weekDate, setWeekDate] = useState(() => new Date());
  const range = useMemo(() => getWeekRange(weekDate), [weekDate]);

  useEffect(() => {
    void listAllSessions({
      page: 1,
      page_size: 500,
      sort_by: "session_date",
      sort_order: "asc",
      from_date: formatDateParam(range.start),
      to_date: formatDateParam(range.end),
    }).catch((error) => toast.error(error instanceof Error ? error.message : "Không thể tải lịch giảng dạy"));
  }, [listAllSessions, range.start, range.end]);

  return (
    <section>
      <DashboardListPageHeader title="Lịch giảng dạy" description="Theo dõi lịch dạy và các buổi học được phân công" />
      <WeeklySchedule
        sessions={sessions}
        weekDate={weekDate}
        loading={isLoading}
        onWeekChange={setWeekDate}
        onSessionClick={(session) => navigate(PRIVATE_ROUTES.DASHBOARD_CLASSES_EDIT.replace(":classId", session.class_id))}
      />
    </section>
  );
}
