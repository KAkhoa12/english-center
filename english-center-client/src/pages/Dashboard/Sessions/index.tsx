import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { DashboardListPageHeader, DashboardTablePagination, SectionCard } from "@/components/Dashboard/Comon";
import { labelOf, sessionModeOptions, sessionStatusOptions } from "@/components/Dashboard/Classes/classOptions";
import { MultiSelectBadge } from "@/components/MultiSelectBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useClassSessionsStore } from "@/services/classSessions/classSessions.store";
import type { ClassSession } from "@/services/classSessions/classSessions.type";
import { useClassesStore } from "@/services/classes/classes.store";
import type { ClassItem } from "@/services/classes/classes.type";
import { useCoursesStore } from "@/services/courses/courses.store";
import { PRIVATE_ROUTES } from "@/shared/routes";

const formatTime = (value?: string | null) => value?.slice(0, 5) || "--:--";

const statusBadgeClass = (status: string) => {
  if (status === "completed") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "cancelled") return "border-red-200 bg-red-50 text-red-700";
  return "border-brand-100 bg-brand-50 text-brand-700";
};

export default function DashboardSessionsPage() {
  const navigate = useNavigate();
  const { sessions, pagination, isLoading, listAllSessions } = useClassSessionsStore();
  const { courses, listCourses } = useCoursesStore();
  const { listClasses } = useClassesStore();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [status, setStatus] = useState("all");
  const [mode, setMode] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [courseIds, setCourseIds] = useState<string[]>([]);
  const [classIds, setClassIds] = useState<string[]>([]);
  const [classOptionsSource, setClassOptionsSource] = useState<ClassItem[]>([]);

  useEffect(() => {
    void listCourses({ page: 1, page_size: 100, mode: "center", status: "active" }).catch(() => toast.error("Không thể tải danh sách khóa học"));
  }, [listCourses]);

  useEffect(() => {
    let cancelled = false;
    const loadClasses = async () => {
      if (!courseIds.length) {
        setClassOptionsSource([]);
        setClassIds([]);
        return;
      }
      try {
        const rows: ClassItem[] = [];
        for (const courseId of courseIds) {
          const items = await listClasses({ page: 1, page_size: 100, course_id: courseId });
          rows.push(...items);
        }
        if (!cancelled) {
          setClassOptionsSource(rows);
          setClassIds((current) => current.filter((id) => rows.some((item) => item.id === id)));
        }
      } catch {
        if (!cancelled) toast.error("Không thể tải danh sách lớp học");
      }
    };
    void loadClasses();
    return () => {
      cancelled = true;
    };
  }, [courseIds, listClasses]);

  const courseOptions = useMemo(() => courses.map((course) => ({ value: course.id, label: course.name })), [courses]);
  const classOptions = useMemo(() => classOptionsSource.map((item) => ({ value: item.id, label: item.name })), [classOptionsSource]);

  useEffect(() => {
    void listAllSessions({
      page,
      page_size: pageSize,
      sort_by: "session_date",
      sort_order: "asc",
      status: status === "all" ? undefined : status,
      mode: mode === "all" ? undefined : mode,
      course_ids: courseIds.length ? courseIds : undefined,
      class_ids: classIds.length ? classIds : undefined,
      from_date: fromDate || undefined,
      to_date: toDate || undefined,
    }).catch((error) => toast.error(error instanceof Error ? error.message : "Không thể tải danh sách buổi học"));
  }, [classIds, courseIds, fromDate, listAllSessions, mode, page, pageSize, status, toDate]);

  const openSession = (session: ClassSession) => {
    navigate(PRIVATE_ROUTES.DASHBOARD_SESSIONS_DETAIL.replace(":sessionId", session.id));
  };

  return (
    <section>
      <DashboardListPageHeader
        title="Buổi học"
        description="Danh sách buổi học theo phân quyền admin và giáo viên"
      />

      <SectionCard title="Danh sách buổi học">
        <div className="mb-5 grid gap-3 md:grid-cols-4">
          <MultiSelectBadge options={courseOptions} value={courseIds} placeholder="Lọc theo khóa học" onChange={(value) => { setCourseIds(value); setPage(1); }} />
          <MultiSelectBadge options={classOptions} value={classIds} placeholder="Lọc theo lớp học" disabled={!courseIds.length} onChange={(value) => { setClassIds(value); setPage(1); }} />
          <Select value={status} onValueChange={(value) => { setStatus(value); setPage(1); }}>
            <SelectTrigger><SelectValue placeholder="Trạng thái" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              {sessionStatusOptions.map((item) => <SelectItem key={item.value} value={item.value}>{item.value}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={mode} onValueChange={(value) => { setMode(value); setPage(1); }}>
            <SelectTrigger><SelectValue placeholder="Hình thức" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả hình thức</SelectItem>
              {sessionModeOptions.map((item) => <SelectItem key={item.value} value={item.value}>{item.value}</SelectItem>)}
            </SelectContent>
          </Select>
          {/*<DashboardDateInput value={fromDate} onChange={(value) => { setFromDate(value); setPage(1); }} />
          <DashboardDateInput value={toDate} onChange={(value) => { setToDate(value); setPage(1); }} />*/}
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead>Buổi học</TableHead>
                <TableHead>Lớp</TableHead>
                <TableHead>Khóa học</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Giờ</TableHead>
                <TableHead>Giáo viên</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Chi tiết</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={8} className="py-8 text-center text-gray-500">Đang tải buổi học...</TableCell></TableRow>
              ) : sessions.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="py-8 text-center text-gray-500">Chưa có buổi học nào</TableCell></TableRow>
              ) : sessions.map((session) => (
                <TableRow key={session.id} className="cursor-pointer" onClick={() => openSession(session)}>
                  <TableCell className="font-semibold text-gray-900">{session.title}</TableCell>
                  <TableCell>{session.class?.name ?? "-"}</TableCell>
                  <TableCell>{session.course?.name ?? "-"}</TableCell>
                  <TableCell>{session.session_date}</TableCell>
                  <TableCell>{formatTime(session.start_time)} - {formatTime(session.end_time)}</TableCell>
                  <TableCell>{session.teacher?.full_name ?? "-"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusBadgeClass(session.status)}>
                      {labelOf(sessionStatusOptions, session.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button type="button" variant="outline" onClick={(event) => { event.stopPropagation(); openSession(session); }}>
                      Xem
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <DashboardTablePagination
          pagination={pagination}
          onPageChange={setPage}
          onPageSizeChange={(value) => {
            setPageSize(value);
            setPage(1);
          }}
        />
      </SectionCard>
    </section>
  );
}
