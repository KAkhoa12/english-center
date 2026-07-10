import { Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import type { CourseCategory } from "@/services/coursesCategory/coursesCategory.type";
import type { CourseTag } from "@/services/coursesTag/coursesTag.type";
import { MutilSelect } from "@/components/Comon/MutilSelect";
import { Select } from "@/components/Comon/Select";

interface FilterCourseProps {
  search: string;
  categoryId: string;
  tagIds: string[];
  categories: CourseCategory[];
  tags: CourseTag[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onTagIdsChange: (value: string[]) => void;
  onSearchSubmit?: () => void;
}

export default function FilterCourse({
  search,
  categoryId,
  tagIds,
  categories,
  tags,
  onSearchChange,
  onCategoryChange,
  onTagIdsChange,
  onSearchSubmit,
}: FilterCourseProps) {
  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const categoryValue = categoryId
    ? {
        key: categories.find((c) => c.id === categoryId)?.name ?? categoryId,
        value: categoryId,
      }
    : null;

  const selectedTags = tagIds
    .map((id) => {
      const tag = tags.find((t) => t.id === id);
      return tag ? { key: tag.name, value: tag.id } : null;
    })
    .filter((item): item is { key: string; value: string } => item !== null);

  const activeCount = useMemo(
    () => (search.trim() ? 1 : 0) + (categoryId ? 1 : 0) + tagIds.length,
    [search, categoryId, tagIds],
  );

  const handleClear = () => {
    setLocalSearch("");
    onSearchChange("");
    onCategoryChange("");
    onTagIdsChange([]);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localSearch);
    onSearchSubmit?.();
  };

  return (
    <section className="bg-surface-soft py-10 md:py-14">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        {/* ─── Filter Header ─── */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-mint/15">
              <SlidersHorizontal className="h-4 w-4 text-mint-deep" />
            </div>
            <span className="text-sm font-semibold text-ink">Bộ lọc</span>

            {activeCount > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-mint px-1.5 text-[11px] font-bold text-ink">
                {activeCount}
              </span>
            )}
          </div>

          {activeCount > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[13px] font-medium text-muted transition-all hover:border-hover-line hover:bg-surface hover:text-ink"
            >
              <X className="h-3.5 w-3.5" />
              Xóa bộ lọc
            </button>
          )}
        </div>

        {/* ─── Filter Card ─── */}
        <div className="rounded-md border border-line-soft bg-white p-4 shadow-sm lg:p-5">
          <div className="grid gap-3 lg:grid-cols-[1.4fr_0.8fr_1fr]">
            {/* ── Search Input + Button ── */}
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="pointer-events-none absolute left-4 h-4 w-4 text-faint" />

              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Tìm theo tên khóa học, mã hoặc mô tả"
                className="h-11 w-full rounded-md border border-line bg-white pl-10 pr-[120px] text-sm font-medium text-body outline-none transition-all placeholder:text-faint focus:border-mint focus:ring-4 focus:ring-mint/15"
              />

              <button
                type="submit"
                className="absolute right-1.5 flex h-8 items-center gap-1.5 rounded-md bg-ink px-4 text-[13px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-mint-deep"
              >
                <Search className="h-3.5 w-3.5" />
                Tìm kiếm
              </button>
            </form>

            {/* ── Category Select ── */}
            <Select
              value={categoryValue}
              onChange={(v) => onCategoryChange(v?.value ?? "")}
              options={categories.map((c) => ({ key: c.name, value: c.id }))}
              placeholder="Tất cả danh mục"
              searchPlaceholder="Tìm danh mục"
              emptyText="Không có danh mục"
              is_search
            />

            {/* ── Tag MultiSelect ── */}
            <MutilSelect
              value={selectedTags}
              onChange={(v) => onTagIdsChange(v.map((t) => t.value))}
              options={tags.map((t) => ({ key: t.name, value: t.id }))}
              placeholder="Tất cả tag"
              searchPlaceholder="Tìm tag"
              emptyText="Không có tag"
              is_search
            />
          </div>
        </div>
      </div>
    </section>
  );
}
