import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { SearchableSelect, type SearchableOption } from "@/components/Dashboard/Classes/SearchableSelect";
import { sessionStatusOptions } from "@/components/Dashboard/Classes/classOptions";
import { DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { WeeklySchedule, formatDateParam, getWeekRange } from "@/components/Dashboard/Schedule/WeeklySchedule";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuthStore } from "@/services/auth/auth.store";
import { useClassSessionsStore } from "@/services/classSessions/classSessions.store";
import { useTeachersStore } from "@/services/teachers/teachers.store";
import { hasAnyPermission } from "@/shared/auth/rbac";
import { PRIVATE_ROUTES } from "@/shared/routes";

const teacherFilterPermissions = ["class_session.sheadual.teacher.view", "class_session.schedule.teacher.view"];
const statusFilterPermissions = ["class_sesion.sheadual.view", "class_session.schedule.view"];

export default function DashboardTeachingSchedulePage() {
  const navigate = useNavigate();
  const me = useAuthStore((state) => state.me);
  const { sessions, isLoading, listAllSessions } = useClassSessionsStore();
  const { teachers, listTeachers } = useTeachersStore();
  const [weekDate, setWeekDate] = useState(() => new Date());
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const range = useMemo(() => getWeekRange(weekDate), [weekDate]);
  const canFilterTeacher = hasAnyPermission(me, teacherFilterPermissions);
  const canFilterStatus = hasAnyPermission(me, statusFilterPermissions);
  const teacherOptions = useMemo<SearchableOption[]>(() => teachers.map((teacher) => ({ value: teacher.id, label: teacher.user.full_name, description: teacher.user.email })), [teachers]);

  useEffect(() => {
    if (!canFilterTeacher) return;
    void listTeachers({ page: 1, page_size: 100, sort_by: "created_at", sort_order: "desc" }).catch(() => toast.error("Không thể tải danh sách giảng viên"));
  }, [canFilterTeacher, listTeachers]);

  useEffect(() => {
    void listAllSessions({
      page: 1,
      page_size: 500,
      sort_by: "session_date",
      sort_order: "asc",
      from_date: formatDateParam(range.start),
      to_date: formatDateParam(range.end),
      teacher_id: canFilterTeacher ? teacherId ?? undefined : undefined,
      status: canFilterStatus ? status ?? undefined : undefined,
    }).catch((error) => toast.error(error instanceof Error ? error.message : "Không thể tải lịch giảng dạy"));
  }, [canFilterStatus, canFilterTeacher, listAllSessions, range.start, range.end, status, teacherId]);

  const filters = canFilterTeacher || canFilterStatus ? (
    <div className="grid gap-2 sm:grid-cols-2">
      {canFilterTeacher ? (
        <SearchableSelect value={teacherId} options={teacherOptions} placeholder="Lọc theo giảng viên" searchPlaceholder="Tìm giảng viên..." onChange={setTeacherId} />
      ) : null}
      {canFilterStatus ? (
        <Select value={status ?? "all"} onValueChange={(value) => setStatus(value === "all" ? null : value)}>
          <SelectTrigger className="h-10 w-full rounded-xl border-gray-200 bg-white"><SelectValue placeholder="Lọc trạng thái" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            {sessionStatusOptions.map((item) => <SelectItem key={item.value} value={item.value}>{item.key}</SelectItem>)}
          </SelectContent>
        </Select>
      ) : null}
    </div>
  ) : null;

  return (
    <section>
      <DashboardListPageHeader title="Lịch giảng dạy" description="Theo dõi lịch dạy và các buổi học được phân công" />
      <WeeklySchedule
        sessions={sessions}
        weekDate={weekDate}
        loading={isLoading}
        filters={filters}
        onWeekChange={setWeekDate}
        onSessionClick={(session) => navigate(PRIVATE_ROUTES.DASHBOARD_CLASSES_EDIT.replace(":classId", session.class_id))}
      />
    </section>
  );
}
