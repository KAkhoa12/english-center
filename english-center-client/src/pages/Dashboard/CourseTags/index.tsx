import { useEffect, useState } from "react";

import { DashboardListPageHeader } from "@/components/Dashboard/Comon/DashboardListPageHeader";
import { CourseTagsListTable } from "@/components/Dashboard/CourseTags/CourseTagsListTable";
import { Input } from "@/components/ui/input";
import { useCoursesTagStore } from "@/services/coursesTag/coursesTag.store";

export const DashboardCourseTagsPage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { tags, pagination, isLoading, listTags } = useCoursesTagStore();

  useEffect(() => {
    void listTags({
      page,
      page_size: pageSize,
      search: search.trim() || undefined,
    });
  }, [listTags, page, pageSize, search]);

  return (
    <section>
      <DashboardListPageHeader
        title="Danh sách tag khóa học"
        description="Quản lý nhãn gắn cho khóa học"
      />

      <div className="mb-4 max-w-sm">
        <Input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Tìm theo tên hoặc slug"
        />
      </div>

      <CourseTagsListTable
        data={tags}
        loading={isLoading}
        pagination={pagination}
        onPageChange={setPage}
        onPageSizeChange={(value) => {
          setPageSize(value);
          setPage(1);
        }}
      />
    </section>
  );
};

export default DashboardCourseTagsPage;
