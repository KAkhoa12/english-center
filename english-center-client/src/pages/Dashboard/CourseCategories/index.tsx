import { useEffect, useState } from "react";

import { CourseCategoriesListTable } from "@/components/Dashboard/CourseCategories/CourseCategoriesListTable";
import { DashboardListPageHeader } from "@/components/Dashboard/Comon/DashboardListPageHeader";
import { Input } from "@/components/ui/input";
import { useCoursesCategoryStore } from "@/services/coursesCategory/coursesCategory.store";

export const DashboardCourseCategoriesPage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { categories, pagination, isLoading, listCategories } = useCoursesCategoryStore();

  useEffect(() => {
    void listCategories({
      page,
      page_size: pageSize,
      search: search.trim() || undefined,
    });
  }, [listCategories, page, pageSize, search]);

  return (
    <section>
      <DashboardListPageHeader
        title="Danh sách loại khóa học"
        description="Quản lý nhóm phân loại của khóa học"
      />

      <div className="mb-4 max-w-sm">
        <Input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Tìm theo tên, slug hoặc mô tả"
        />
      </div>

      <CourseCategoriesListTable
        data={categories}
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

export default DashboardCourseCategoriesPage;
