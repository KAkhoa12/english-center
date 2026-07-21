import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useClassesStore } from "@/services/classes/classes.store";
import { ClassStudentsTable } from "./ClassStudentsTable";
import { enrollmentStatusOptions } from "./classOptions";

type ClassStudentsTabProps = {
  classId: string;
};

export function ClassStudentsTab({ classId }: ClassStudentsTabProps) {
  const { classStudents, classStudentsPagination, isLoading, listClassStudents } = useClassesStore();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [enrollmentStatus, setEnrollmentStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void listClassStudents(classId, {
        page,
        page_size: pageSize,
        search: search.trim() || undefined,
        enrollment_status: enrollmentStatus === "all" ? undefined : enrollmentStatus,
        sort_by: "enrolled_at",
        sort_order: sortOrder,
      }).catch((error) => toast.error(error instanceof Error ? error.message : "Không thể tải danh sách học viên"));
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [classId, listClassStudents, page, pageSize, search, enrollmentStatus, sortOrder]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-gray-100 bg-white p-4">
        <Input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Tìm học viên" className="max-w-sm" />
        <Select value={enrollmentStatus} onValueChange={(value) => { setEnrollmentStatus(value); setPage(1); }}><SelectTrigger className="w-52"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Tất cả trạng thái</SelectItem>{enrollmentStatusOptions.map((item) => <SelectItem key={item.value} value={item.value}>{item.key}</SelectItem>)}</SelectContent></Select>
        <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as "asc" | "desc")}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="asc">Tăng dần</SelectItem><SelectItem value="desc">Giảm dần</SelectItem></SelectContent></Select>
      </div>
      <ClassStudentsTable data={classStudents} loading={isLoading} pagination={classStudentsPagination} onPageChange={setPage} onPageSizeChange={(value) => { setPageSize(value); setPage(1); }} />
    </div>
  );
}
