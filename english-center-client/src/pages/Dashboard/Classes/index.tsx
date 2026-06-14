import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { ClassesFilterBar } from "@/components/Dashboard/Classes/ClassesFilterBar";
import { ClassesListTable } from "@/components/Dashboard/Classes/ClassesListTable";
import type { SearchableOption } from "@/components/Dashboard/Classes/SearchableSelect";
import { useClassesStore } from "@/services/classes/classes.store";
import type { ListClassesQuery } from "@/services/classes/classes.type";
import { useCoursesStore } from "@/services/courses/courses.store";
import { useTeachersStore } from "@/services/teachers/teachers.store";
import type { Pagination } from "@/shared/types/response";
import { PRIVATE_ROUTES } from "@/shared/routes";

export default function DashboardClassesPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ListClassesQuery>({ sort_by: "created_at", sort_order: "desc" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { classes, isLoading, listClasses } = useClassesStore();
  const { courses, listCourses } = useCoursesStore();
  const { teachers, listTeachers } = useTeachersStore();

  useEffect(() => {
    void listCourses({ page: 1, page_size: 100, mode: "center", status: "active" }).catch(() => toast.error("Không thể tải danh sách khóa học"));
    void listTeachers({ page: 1, page_size: 100 }).catch(() => toast.error("Không thể tải danh sách giáo viên"));
  }, [listCourses, listTeachers]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void listClasses({ ...filters, search: filters.search?.trim() || undefined }).catch(() => toast.error("Không thể tải danh sách lớp học"));
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [listClasses, filters]);

  const courseOptions = useMemo<SearchableOption[]>(() => courses.map((course) => ({ value: course.id, label: course.name, description: course.code })), [courses]);
  const teacherOptions = useMemo<SearchableOption[]>(() => teachers.map((teacher) => ({ value: teacher.id, label: teacher.user.full_name, description: teacher.user.email })), [teachers]);

  const pagination = useMemo<Pagination>(() => {
    const totalItems = classes.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const safePage = Math.min(page, totalPages);
    return { page: safePage, page_size: pageSize, total_items: totalItems, total_pages: totalPages, has_next: safePage < totalPages, has_previous: safePage > 1 };
  }, [classes.length, page, pageSize]);

  const visible = useMemo(() => {
    const start = (pagination.page - 1) * pageSize;
    return classes.slice(start, start + pageSize);
  }, [classes, pagination.page, pageSize]);

  return (
    <section>
      <DashboardListPageHeader title="Quản lý lớp học" description="Quản trị các lớp học" />
      <ClassesFilterBar
        value={filters}
        courseOptions={courseOptions}
        teacherOptions={teacherOptions}
        onChange={(query) => { setFilters(query); setPage(1); }}
        onCreate={() => navigate(PRIVATE_ROUTES.DASHBOARD_CLASSES_CREATE)}
      />
      <ClassesListTable data={visible} loading={isLoading} pagination={pagination} onPageChange={setPage} onPageSizeChange={(value) => { setPageSize(value); setPage(1); }} onEdit={(item) => navigate(PRIVATE_ROUTES.DASHBOARD_CLASSES_EDIT.replace(":classId", item.id))} />
    </section>
  );
}
