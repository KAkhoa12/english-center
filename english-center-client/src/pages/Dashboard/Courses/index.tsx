import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { DashboardListPageHeader } from "@/components/Dashboard/Comon/DashboardListPageHeader";
import { DashboardRowActions } from "@/components/Dashboard/Comon/DashboardRowActions";
import { DashboardTablePagination } from "@/components/Dashboard/Comon/DashboardTablePagination";
import { CoursesFilter } from "@/pages/Dashboard/Courses/components/CoursesFilter";
import { TableList } from "@/components/Comon/TableList";
import { Badge } from "@/components/ui/badge";
import { useCoursesStore } from "@/services/courses/courses.store";
import type { CourseMode } from "@/services/courses/courses.type";
import { useCoursesCategoryStore } from "@/services/coursesCategory/coursesCategory.store";
import { useCoursesTagStore } from "@/services/coursesTag/coursesTag.store";
import { PRIVATE_ROUTES } from "@/shared/routes";

type DashboardCoursesPageProps = {
  modeFilter?: CourseMode;
};

export const DashboardCoursesPage = ({ modeFilter }: DashboardCoursesPageProps) => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [status, setStatus] = useState<string>("all");
  const [mode, setMode] = useState<string>(modeFilter ?? "all");
  const [targetLevel, setTargetLevel] = useState<string>("all");
  const [categoryId, setCategoryId] = useState<string>("all");
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const { courses, pagination, isLoading, listCourses, deleteCourse } = useCoursesStore();
  const { categories, listCategories } = useCoursesCategoryStore();
  const { tags, listTags } = useCoursesTagStore();

  useEffect(() => {
    void listCategories({ page: 1, page_size: 100, sort_by: "name", sort_order: "asc" });
    void listTags({ page: 1, page_size: 100, sort_by: "name", sort_order: "asc" });
  }, [listCategories, listTags]);

  useEffect(() => {
    void listCourses({
      page,
      page_size: pageSize,
      search: searchKeyword.trim() || undefined,
      status: status !== "all" ? status : undefined,
      mode: modeFilter ?? (mode !== "all" ? (mode as CourseMode) : undefined),
      target_level: targetLevel !== "all" ? targetLevel : undefined,
      category_id: categoryId !== "all" ? categoryId : undefined,
      tag_ids: tagIds.length ? tagIds : undefined,
      sort_by: sortBy || undefined,
      sort_order: sortOrder,
      min_price: minPrice.trim() ? Number(minPrice) : undefined,
      max_price: maxPrice.trim() ? Number(maxPrice) : undefined,
    });
  }, [
    listCourses,
    page,
    pageSize,
    searchKeyword,
    status,
    mode,
    modeFilter,
    targetLevel,
    categoryId,
    tagIds,
    sortBy,
    sortOrder,
    minPrice,
    maxPrice,
  ]);

  const courseColumns = [
    {
      key: "code",
      header: "Mã khóa học",
      render: (row: (typeof courses)[number]) => <span className="font-medium text-gray-900">{row.code}</span>,
    },
    {
      key: "name",
      header: "Tên khóa học",
      render: (row: (typeof courses)[number]) => <span className="font-medium text-gray-900">{row.name}</span>,
    },
    {
      key: "mode",
      header: "Mode",
      render: (row: (typeof courses)[number]) => (
        <Badge className={row.mode === "center" ? "bg-blue-50 text-blue-700" : "bg-violet-50 text-violet-700"}>
          {row.mode === "center" ? "Trung tâm" : "Template"}
        </Badge>
      ),
    },
    {
      key: "category",
      header: "Loại",
      render: (row: (typeof courses)[number]) => row.category?.name ?? row.categories?.[0]?.name ?? "-",
    },
    {
      key: "target_level",
      header: "Trình độ",
      render: (row: (typeof courses)[number]) => row.target_level ?? "-",
    },
    {
      key: "price",
      header: "Học phí",
      headerClassName: "text-right",
      className: "text-right",
      render: (row: (typeof courses)[number]) => `${row.price.toLocaleString("vi-VN")} đ`,
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (row: (typeof courses)[number]) => (
        <Badge
          className={
            row.status === "active"
              ? "bg-emerald-100 text-emerald-700"
              : row.status === "inactive"
                ? "bg-amber-100 text-amber-700"
                : "bg-gray-200 text-gray-700"
          }
        >
          {row.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Thao tác",
      headerClassName: "text-right",
      className: "text-right",
      render: (row: (typeof courses)[number]) => (
        <div onClick={(event) => event.stopPropagation()}>
          <DashboardRowActions onEdit={() => navigate(`/dashboard/courses/${row.id}/edit`)} />
        </div>
      ),
    },
  ];

  return (
    <section className="p-3">
      <DashboardListPageHeader
        title={modeFilter === "center" ? "Khóa học tại trung tâm" : modeFilter === "template" ? "Khóa học có sẵn" : "Danh sách khóa học"}
        description={modeFilter === "center" ? "Quản lý các khóa học mở lớp tại trung tâm" : modeFilter === "template" ? "Quản lý các khóa học template/có sẵn" : "Quản lý toàn bộ khóa học trong hệ thống"}
      />

      <CoursesFilter
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        onSearch={() => {
          setSearchKeyword(searchInput);
          setPage(1);
        }}
        status={status}
        onStatusChange={(value) => {
          setStatus(value);
          setPage(1);
        }}
        mode={mode}
        modeFilter={modeFilter}
        onModeChange={(value) => {
          setMode(value);
          setPage(1);
        }}
        targetLevel={targetLevel}
        onTargetLevelChange={(value) => {
          setTargetLevel(value);
          setPage(1);
        }}
        categoryId={categoryId}
        onCategoryIdChange={(value) => {
          setCategoryId(value);
          setPage(1);
        }}
        tagIds={tagIds}
        onTagIdsChange={(value) => {
          setTagIds(value);
          setPage(1);
        }}
        sortBy={sortBy}
        onSortByChange={(value) => {
          setSortBy(value);
          setPage(1);
        }}
        sortOrder={sortOrder}
        onSortOrderChange={(value) => {
          setSortOrder(value);
          setPage(1);
        }}
        minPrice={minPrice}
        onMinPriceChange={(value) => {
          setMinPrice(value);
          setPage(1);
        }}
        maxPrice={maxPrice}
        onMaxPriceChange={(value) => {
          setMaxPrice(value);
          setPage(1);
        }}
        categories={categories}
        tags={tags}
        onCreateCourse={() => navigate(PRIVATE_ROUTES.DASHBOARD_COURSES_CREATE)}
        onReset={() => {
          setStatus("all");
          setMode("all");
          setTargetLevel("all");
          setCategoryId("all");
          setTagIds([]);
          setSortBy("created_at");
          setSortOrder("desc");
          setMinPrice("");
          setMaxPrice("");
          setSearchInput("");
          setSearchKeyword("");
          setPage(1);
        }}
      />

      <TableList
        data={courses}
        pagination={pagination}
        columns={courseColumns}
        onPageChange={setPage}
        getRowId={(row) => row.id}
        loading={isLoading}
        selectedRowIds={selectedCourseIds}
        onSelectedRowIdsChange={setSelectedCourseIds}
        bulkActions={[
          {
            label: "Xóa đã chọn",
            variant: "destructive",
            onClick: async (rows) => {
              if (rows.length === 0) return;
              const confirmed = window.confirm(`Xóa ${rows.length} khóa học đã chọn?`);
              if (!confirmed) return;
              try {
                for (const row of rows) {
                  await deleteCourse(row.id);
                }
                setSelectedCourseIds([]);
                await listCourses({
                  page,
                  page_size: pageSize,
                  search: searchKeyword.trim() || undefined,
                  status: status !== "all" ? status : undefined,
                  mode: modeFilter ?? (mode !== "all" ? (mode as CourseMode) : undefined),
                  target_level: targetLevel !== "all" ? targetLevel : undefined,
                  category_id: categoryId !== "all" ? categoryId : undefined,
                  tag_ids: tagIds.length ? tagIds : undefined,
                  sort_by: sortBy || undefined,
                  sort_order: sortOrder,
                  min_price: minPrice.trim() ? Number(minPrice) : undefined,
                  max_price: maxPrice.trim() ? Number(maxPrice) : undefined,
                });
                toast.success("Xóa khóa học thành công");
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Xóa khóa học thất bại");
              }
            },
          },
        ]}
      />
    </section>
  );
};

export default DashboardCoursesPage;
