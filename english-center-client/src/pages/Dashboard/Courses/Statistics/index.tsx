import { BookOpen, GraduationCap, Users } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

import { DashboardListPageHeader, SectionCard } from "@/components/Dashboard/Comon";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCoursesStore } from "@/services/courses/courses.store";
import type { CourseMode } from "@/services/courses/courses.type";

type DashboardCourseStatisticsPageProps = {
  mode: CourseMode;
};

export default function DashboardCourseStatisticsPage({ mode }: DashboardCourseStatisticsPageProps) {
  const { statistics, isLoading, getCourseStatistics } = useCoursesStore();
  const isCenter = mode === "center";

  useEffect(() => {
    void getCourseStatistics(mode).catch((error) => {
      toast.error(error instanceof Error ? error.message : "Không thể tải thống kê khóa học");
    });
  }, [getCourseStatistics, mode]);

  const totals = statistics.reduce(
    (result, item) => ({
      enrollments: result.enrollments + item.total_enrollments,
      classes: result.classes + (item.classes_count ?? 0),
      students: result.students + (item.total_class_students ?? 0),
    }),
    { enrollments: 0, classes: 0, students: 0 },
  );

  return (
    <section>
      <DashboardListPageHeader
        title={isCenter ? "Thống kê khóa học tại trung tâm" : "Thống kê khóa học có sẵn"}
        description={isCenter ? "Theo dõi số học viên mua khóa và sĩ số từng lớp" : "Theo dõi số học viên đăng ký/mua theo từng khóa học có sẵn"}
      />

      <div className="mb-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-brand-50 p-3 text-brand-600"><BookOpen className="h-5 w-5" /></div>
            <div><p className="text-sm text-gray-500">Khóa học</p><p className="text-2xl font-bold text-gray-950">{statistics.length}</p></div>
          </div>
        </div>
        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600"><Users className="h-5 w-5" /></div>
            <div><p className="text-sm text-gray-500">Lượt đăng ký/mua</p><p className="text-2xl font-bold text-gray-950">{totals.enrollments}</p></div>
          </div>
        </div>
        {isCenter ? (
          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-amber-50 p-3 text-amber-600"><GraduationCap className="h-5 w-5" /></div>
              <div><p className="text-sm text-gray-500">Học viên trong lớp</p><p className="text-2xl font-bold text-gray-950">{totals.students}</p></div>
            </div>
          </div>
        ) : null}
      </div>

      <SectionCard title="Danh sách thống kê">
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead>Khóa học</TableHead>
                <TableHead>Mã</TableHead>
                <TableHead className="text-right">Lượt đăng ký/mua</TableHead>
                {isCenter ? <TableHead className="text-right">Số lớp</TableHead> : null}
                {isCenter ? <TableHead className="text-right">Học viên trong lớp</TableHead> : null}
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={isCenter ? 6 : 4} className="py-8 text-center text-gray-500">Đang tải thống kê...</TableCell></TableRow>
              ) : statistics.length === 0 ? (
                <TableRow><TableCell colSpan={isCenter ? 6 : 4} className="py-8 text-center text-gray-500">Chưa có dữ liệu thống kê</TableCell></TableRow>
              ) : statistics.map((item) => (
                <TableRow key={item.course.id}>
                  <TableCell className="font-semibold text-gray-900">
                    <div>{item.course.name}</div>
                    {isCenter && item.classes?.length ? (
                      <div className="mt-3 space-y-2">
                        {item.classes.map((classItem) => (
                          <div key={classItem.id} className="rounded-xl bg-gray-50 px-3 py-2 text-xs text-gray-500">
                            <span className="font-semibold text-gray-800">{classItem.name}</span>
                            <span> · {classItem.students_count}/{classItem.max_students} học viên</span>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </TableCell>
                  <TableCell>{item.course.code}</TableCell>
                  <TableCell className="text-right">{item.total_enrollments}</TableCell>
                  {isCenter ? <TableCell className="text-right">{item.classes_count ?? 0}</TableCell> : null}
                  {isCenter ? <TableCell className="text-right">{item.total_class_students ?? 0}</TableCell> : null}
                  <TableCell><Badge variant="outline">{item.course.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
    </section>
  );
}
