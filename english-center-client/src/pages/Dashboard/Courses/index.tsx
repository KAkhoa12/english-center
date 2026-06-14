import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { DashboardListPageHeader } from "@/components/Dashboard/Comon/DashboardListPageHeader";
import { CoursesListTable } from "@/components/Dashboard/Courses/CoursesListTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [tagId, setTagId] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const { courses, pagination, isLoading, listCourses } = useCoursesStore();
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
      tag_id: tagId !== "all" ? tagId : undefined,
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
    tagId,
    sortBy,
    sortOrder,
    minPrice,
    maxPrice,
  ]);

  return (
    <section>
      <DashboardListPageHeader
        title={modeFilter === "center" ? "Khóa học tại trung tâm" : modeFilter === "template" ? "Khóa học có sẵn" : "Danh sách khóa học"}
        description={modeFilter === "center" ? "Quản lý các khóa học mở lớp tại trung tâm" : modeFilter === "template" ? "Quản lý các khóa học template/có sẵn" : "Quản lý toàn bộ khóa học trong hệ thống"}
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Input
          value={searchInput}
          onChange={(event) => {
            setSearchInput(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key !== "Enter") return;
            setSearchKeyword(searchInput);
            setPage(1);
          }}
          placeholder="Tìm theo tên, mã hoặc slug khóa học"
          className="max-w-sm"
        />
        <Button
          type="button"
          onClick={() => {
            setSearchKeyword(searchInput);
            setPage(1);
          }}
        >
          Tìm kiếm
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(PRIVATE_ROUTES.DASHBOARD_COURSES_CREATE)}
        >
          Thêm khóa học mới
        </Button>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 rounded-2xl border border-gray-100 bg-white p-4 md:grid-cols-2 xl:grid-cols-4">
        <Select
          value={status}
          onValueChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="active">Đang mở</SelectItem>
            <SelectItem value="inactive">Tạm ẩn</SelectItem>
            <SelectItem value="archived">Lưu trữ</SelectItem>
          </SelectContent>
        </Select>

        {!modeFilter ? <Select
          value={mode}
          onValueChange={(value) => {
            setMode(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Mode khóa học" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả mode</SelectItem>
            <SelectItem value="center">Khóa trung tâm</SelectItem>
            <SelectItem value="template">Khóa template</SelectItem>
          </SelectContent>
        </Select> : null}

        <Select
          value={targetLevel}
          onValueChange={(value) => {
            setTargetLevel(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Trình độ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trình độ</SelectItem>
            {["A0", "A1", "A2", "B1", "B2", "C1", "C2"].map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={categoryId}
          onValueChange={(value) => {
            setCategoryId(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Loại khóa học" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại khóa học</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={tagId}
          onValueChange={(value) => {
            setTagId(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Tag khóa học" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả tag</SelectItem>
            {tags.map((tag) => (
              <SelectItem key={tag.id} value={tag.id}>
                {tag.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="number"
          min={0}
          value={minPrice}
          onChange={(event) => {
            setMinPrice(event.target.value);
            setPage(1);
          }}
          placeholder="Học phí từ"
        />

        <Input
          type="number"
          min={0}
          value={maxPrice}
          onChange={(event) => {
            setMaxPrice(event.target.value);
            setPage(1);
          }}
          placeholder="Học phí đến"
        />

        <Select
          value={sortBy}
          onValueChange={(value) => {
            setSortBy(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sắp xếp theo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">Ngày tạo</SelectItem>
            <SelectItem value="updated_at">Ngày cập nhật</SelectItem>
            <SelectItem value="name">Tên khóa học</SelectItem>
            <SelectItem value="price">Học phí</SelectItem>
            <SelectItem value="code">Mã khóa học</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Select
            value={sortOrder}
            onValueChange={(value: "asc" | "desc") => {
              setSortOrder(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Thứ tự" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Giảm dần</SelectItem>
              <SelectItem value="asc">Tăng dần</SelectItem>
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setStatus("all");
              setMode("all");
              setTargetLevel("all");
              setCategoryId("all");
              setTagId("all");
              setSortBy("created_at");
              setSortOrder("desc");
              setMinPrice("");
              setMaxPrice("");
              setSearchInput("");
              setSearchKeyword("");
              setPage(1);
            }}
          >
            Xóa lọc
          </Button>
        </div>
      </div>

      <CoursesListTable
        data={courses}
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

export default DashboardCoursesPage;
