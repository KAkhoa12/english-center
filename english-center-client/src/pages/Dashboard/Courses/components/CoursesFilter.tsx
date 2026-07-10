import * as React from "react";
import { RotateCcw, Search, SlidersHorizontal, Plus } from "lucide-react";
import { MutilSelect } from "@/components/Comon/MutilSelect";
import { Select, type SelectOption } from "@/components/Comon/Select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { CourseMode } from "@/services/courses/courses.type";
import type { CourseCategory } from "@/services/coursesCategory/coursesCategory.type";
import type { CourseTag } from "@/services/coursesTag/coursesTag.type";

type CoursesFilterProps = {
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  onSearch: () => void;
  status: string;
  onStatusChange: (value: string) => void;
  mode: string;
  modeFilter?: CourseMode;
  onModeChange: (value: string) => void;
  targetLevel: string;
  onTargetLevelChange: (value: string) => void;
  categoryId: string;
  onCategoryIdChange: (value: string) => void;
  tagIds: string[];
  onTagIdsChange: (value: string[]) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  sortOrder: "asc" | "desc";
  onSortOrderChange: (value: "asc" | "desc") => void;
  minPrice: string;
  onMinPriceChange: (value: string) => void;
  maxPrice: string;
  onMaxPriceChange: (value: string) => void;
  categories: CourseCategory[];
  tags: CourseTag[];
  onReset: () => void;
  onCreateCourse: () => void;
};

export const CoursesFilter = ({
  searchInput,
  onSearchInputChange,
  onSearch,
  status,
  onStatusChange,
  mode,
  modeFilter,
  onModeChange,
  onTargetLevelChange,
  targetLevel,
  categoryId,
  onCategoryIdChange,
  tagIds,
  onTagIdsChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  categories,
  tags,
  onReset,
  onCreateCourse,
}: CoursesFilterProps) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = React.useState(false);

  const activeFiltersCount = React.useMemo(() => {
    let count = 0;
    if (status !== "all" && status !== "") count++;
    if (mode !== "all" && mode !== "") count++;
    if (targetLevel !== "all" && targetLevel !== "") count++;
    if (categoryId !== "all" && categoryId !== "") count++;
    if (tagIds.length > 0) count++;
    if (minPrice !== "") count++;
    if (maxPrice !== "") count++;
    return count;
  }, [status, mode, targetLevel, categoryId, tagIds, minPrice, maxPrice]);

  return (
    <div className="w-full space-y-3.5 py-5 relative">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-2 max-w-2xl">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchInput}
              onChange={(event) => onSearchInputChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") onSearch();
              }}
              placeholder="Tìm tên khóa học, mã lớp hoặc danh mục..."
              className="h-10 pl-10 pr-4 rounded-xl border-slate-200 bg-white shadow-sm placeholder:text-slate-400 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 transition-all"
            />
          </div>

          <Button
            variant={isAdvancedOpen ? "secondary" : "outline"}
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className="h-10 gap-2 rounded-xl border-slate-200 shadow-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-all"
          >
            <SlidersHorizontal className={`h-4 w-4 text-slate-500 transition-transform ${isAdvancedOpen ? "rotate-180" : ""}`} />
            <span>Bộ lọc</span>
            {activeFiltersCount > 0 && (
              <Badge className="ml-0.5 bg-emerald-600 hover:bg-emerald-600 text-white rounded-full px-1.5 h-5 min-w-5 flex items-center justify-center text-[11px] font-bold">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </div>

        <Button
          onClick={onCreateCourse}
          className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl shadow-sm shadow-emerald-600/10 gap-2 transition-all"
        >
          <Plus className="h-4 w-4" />
          Thêm khóa học mới
        </Button>
      </div>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isAdvancedOpen ? "grid-rows-[1fr] opacity-100 overflow-visible" : "grid-rows-[0fr] opacity-0 pointer-events-none overflow-hidden"
        }`}
      >
        <div className={isAdvancedOpen ? "overflow-visible" : "overflow-hidden"}>
          <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm space-y-4 mt-1">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-slate-500 tracking-wide uppercase">Trạng thái</label>
                <Select
                  value={{ key: status === "active" ? "Đang mở" : status === "inactive" ? "Tạm ẩn" : status === "archived" ? "Lưu trữ" : "Tất cả trạng thái", value: status }}
                  onChange={(option) => onStatusChange(option?.value ?? "all")}
                  options={[
                    { key: "Tất cả trạng thái", value: "all" },
                    { key: "Đang mở", value: "active" },
                    { key: "Tạm ẩn", value: "inactive" },
                    { key: "Lưu trữ", value: "archived" },
                  ]}
                  placeholder="Chọn trạng thái"
                />
              </div>

              {!modeFilter && (
                <div className="space-y-1.5">
                  <label className="text-[12px] font-semibold text-slate-500 tracking-wide uppercase">Hình thức</label>
                  <Select
                    value={{ key: mode === "center" ? "Khóa trung tâm" : mode === "template" ? "Khóa template" : "Tất cả hình thức", value: mode }}
                    onChange={(option) => onModeChange(option?.value ?? "all")}
                    options={[
                      { key: "Tất cả hình thức", value: "all" },
                      { key: "Khóa trung tâm", value: "center" },
                      { key: "Khóa template", value: "template" },
                    ]}
                    placeholder="Chọn hình thức"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-slate-500 tracking-wide uppercase">Trình độ chuẩn</label>
                <Select
                  value={targetLevel === "all" ? { key: "Tất cả trình độ", value: "all" } : { key: targetLevel, value: targetLevel }}
                  onChange={(option) => onTargetLevelChange(option?.value ?? "all")}
                  options={[
                    { key: "Tất cả trình độ", value: "all" },
                    ...["A0", "A1", "A2", "B1", "B2", "C1", "C2"].map((level) => ({ key: level, value: level })),
                  ]}
                  placeholder="Chọn trình độ"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-slate-500 tracking-wide uppercase">Danh mục chính</label>
                <Select
                  value={categoryId === "all" ? { key: "Tất cả danh mục", value: "all" } : { key: categories.find((c) => c.id === categoryId)?.name ?? categoryId, value: categoryId }}
                  onChange={(option) => onCategoryIdChange(option?.value ?? "all")}
                  options={[
                    { key: "Tất cả danh mục", value: "all" },
                    ...categories.map((category) => ({ key: category.name, value: category.id })),
                  ]}
                  placeholder="Chọn danh mục"
                  is_search
                  searchPlaceholder="Tìm danh mục..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-slate-500 tracking-wide uppercase">Nhãn đi kèm (Tags)</label>
                <MutilSelect
                  value={tagIds.map((tagId) => {
                    const tag = tags.find((item) => item.id === tagId);
                    return { key: tag?.name ?? tagId, value: tagId };
                  })}
                  onChange={(items) => onTagIdsChange(items.map((item) => item.value))}
                  options={tags.map((tag) => ({ key: tag.name, value: tag.id }))}
                  placeholder="Chọn tags"
                  searchPlaceholder="Tìm kiếm tag..."
                  emptyText="Không tìm thấy tag"
                  is_search
                />
              </div>
            </div>

            <div className="h-px bg-slate-100 w-full" />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-slate-500 tracking-wide uppercase block">Khoảng học phí (VNĐ)</label>
                <div className="flex items-center gap-2 bg-slate-50/60 p-1 rounded-xl border border-slate-200/80 w-fit">
                  <Input
                    type="number"
                    min={0}
                    value={minPrice}
                    onChange={(event) => onMinPriceChange(event.target.value)}
                    placeholder="Từ"
                    className="h-8 w-[100px] border-none bg-transparent shadow-none text-sm focus-visible:ring-0"
                  />
                  <span className="text-slate-300 font-light text-xs">—</span>
                  <Input
                    type="number"
                    min={0}
                    value={maxPrice}
                    onChange={(event) => onMaxPriceChange(event.target.value)}
                    placeholder="Đến"
                    className="h-8 w-[100px] border-none bg-transparent shadow-none text-sm focus-visible:ring-0"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 self-end sm:self-center">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-400 whitespace-nowrap">Sắp xếp:</span>
                  <div className="w-[140px]">
                    <Select
                      value={{
                        key: sortBy === "created_at" ? "Ngày tạo" : sortBy === "updated_at" ? "Ngày cập nhật" : sortBy === "name" ? "Tên khóa" : sortBy === "price" ? "Học phí" : "Mã khóa",
                        value: sortBy,
                      } satisfies SelectOption}
                      onChange={(option) => onSortByChange(option?.value ?? "created_at")}
                      options={[
                        { key: "Ngày tạo", value: "created_at" },
                        { key: "Ngày cập nhật", value: "updated_at" },
                        { key: "Tên khóa", value: "name" },
                        { key: "Học phí", value: "price" },
                        { key: "Mã khóa", value: "code" },
                      ]}
                      placeholder="Sắp xếp theo"
                    />
                  </div>
                </div>

                <div className="w-[120px]">
                  <Select
                    value={sortOrder === "asc" ? { key: "Tăng dần", value: "asc" } : { key: "Giảm dần", value: "desc" }}
                    onChange={(option) => onSortOrderChange((option?.value as "asc" | "desc") ?? "desc")}
                    options={[
                      { key: "Giảm dần", value: "desc" },
                      { key: "Tăng dần", value: "asc" },
                    ]}
                    placeholder="Thứ tự"
                  />
                </div>

                {(activeFiltersCount > 0 || searchInput !== "") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onReset}
                    className="h-9 px-3 text-rose-600 hover:text-rose-700 hover:bg-rose-50/60 rounded-xl font-medium transition-all gap-1.5"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Xóa bộ lọc
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesFilter;
