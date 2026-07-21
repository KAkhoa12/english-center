import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ListClassesQuery } from "@/services/classes/classes.type";
import { SearchableSelect, type SearchableOption } from "./SearchableSelect";
import { classStatusOptions, classTypeOptions } from "./classOptions";

type ClassesFilterBarProps = {
  value: ListClassesQuery;
  courseOptions: SearchableOption[];
  teacherOptions: SearchableOption[];
  onChange: (query: ListClassesQuery) => void;
  onCreate: () => void;
};

export function ClassesFilterBar({ value, courseOptions, teacherOptions, onChange, onCreate }: ClassesFilterBarProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const update = (patch: Partial<ListClassesQuery>) => onChange({ ...value, ...patch });
  const activeFiltersCount =
    Number(Boolean(value.course_id)) +
    Number(Boolean(value.teacher_id)) +
    Number(Boolean(value.status)) +
    Number(Boolean(value.class_type)) +
    Number(Boolean(value.start_date_from)) +
    Number(Boolean(value.start_date_to));

  return (
    <div className="mb-4 w-full space-y-3.5 py-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-2 max-w-2xl">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={value.search ?? ""}
              onChange={(event) => update({ search: event.target.value || undefined })}
              placeholder="Tìm theo tên hoặc mã lớp..."
              className="h-10 rounded-xl border-slate-200 bg-white pl-10 pr-4 shadow-sm placeholder:text-slate-400 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20"
            />
          </div>

          <Button
            type="button"
            variant={isAdvancedOpen ? "secondary" : "outline"}
            onClick={() => setIsAdvancedOpen((current) => !current)}
            className="h-10 gap-2 rounded-xl border-slate-200 bg-white text-slate-700 shadow-sm"
          >
            <SlidersHorizontal className="h-4 w-4 text-slate-500" />
            Bộ lọc
            {activeFiltersCount > 0 ? (
              <Badge className="ml-0.5 h-5 min-w-5 rounded-full bg-emerald-600 px-1.5 text-[11px] font-bold text-white hover:bg-emerald-600">
                {activeFiltersCount}
              </Badge>
            ) : null}
          </Button>
        </div>

        <Button
          type="button"
          onClick={onCreate}
          className="h-10 gap-2 rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-600/10 hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Thêm lớp học
        </Button>
      </div>

      <div className={`grid transition-all duration-300 ease-in-out ${isAdvancedOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"}`}>
        <div className={isAdvancedOpen ? "overflow-visible" : "overflow-hidden"}>
          <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">Khóa học</label>
            <SearchableSelect
              value={value.course_id ?? null}
              options={courseOptions}
              placeholder="Lọc theo khóa học"
              onChange={(course_id) => update({ course_id: course_id ?? undefined })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">Giáo viên</label>
            <SearchableSelect
              value={value.teacher_id ?? null}
              options={teacherOptions}
              placeholder="Lọc theo giáo viên"
              onChange={(teacher_id) => update({ teacher_id: teacher_id ?? undefined })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">Trạng thái</label>
            <Select value={value.status ?? "all"} onValueChange={(status) => update({ status: status === "all" ? undefined : status })}>
              <SelectTrigger>
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                {classStatusOptions.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">Loại lớp</label>
            <Select value={value.class_type ?? "all"} onValueChange={(class_type) => update({ class_type: class_type === "all" ? undefined : class_type })}>
              <SelectTrigger>
                <SelectValue placeholder="Loại lớp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại lớp</SelectItem>
                {classTypeOptions.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">Sắp xếp</label>
            <Select value={value.sort_by ?? "created_at"} onValueChange={(sort_by) => update({ sort_by })}>
              <SelectTrigger>
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Ngày tạo</SelectItem>
                <SelectItem value="name">Tên lớp</SelectItem>
                <SelectItem value="start_date">Ngày bắt đầu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
            {/*<Input type="date" value={value.start_date_from ?? ""} onChange={(start_date_from) => update({ start_date_from: start_date_from || undefined })} />
            <Input type="date" value={value.start_date_to ?? ""} onChange={(start_date_to) => update({ start_date_to: start_date_to || undefined })} />*/}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
