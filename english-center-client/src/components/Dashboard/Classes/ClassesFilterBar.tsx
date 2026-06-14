import { DashboardDateInput } from "@/components/Dashboard/Comon";
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
  const update = (patch: Partial<ListClassesQuery>) => onChange({ ...value, ...patch });

  return (
    <div className="mb-4 grid grid-cols-1 gap-3 rounded-2xl border border-gray-100 bg-white p-4 md:grid-cols-3 xl:grid-cols-5">
      <Input value={value.search ?? ""} onChange={(event) => update({ search: event.target.value || undefined })} placeholder="Tìm theo tên hoặc mã lớp" />
      <SearchableSelect value={value.course_id ?? null} options={courseOptions} placeholder="Lọc theo khóa học" onChange={(course_id) => update({ course_id: course_id ?? undefined })} />
      <SearchableSelect value={value.teacher_id ?? null} options={teacherOptions} placeholder="Lọc theo giáo viên" onChange={(teacher_id) => update({ teacher_id: teacher_id ?? undefined })} />
      <Select value={value.status ?? "all"} onValueChange={(status) => update({ status: status === "all" ? undefined : status })}>
        <SelectTrigger><SelectValue placeholder="Trạng thái" /></SelectTrigger>
        <SelectContent><SelectItem value="all">Tất cả trạng thái</SelectItem>{classStatusOptions.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent>
      </Select>
      <Select value={value.class_type ?? "all"} onValueChange={(class_type) => update({ class_type: class_type === "all" ? undefined : class_type })}>
        <SelectTrigger><SelectValue placeholder="Loại lớp" /></SelectTrigger>
        <SelectContent><SelectItem value="all">Tất cả loại lớp</SelectItem>{classTypeOptions.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent>
      </Select>
      <DashboardDateInput value={value.start_date_from ?? ""} onChange={(start_date_from) => update({ start_date_from: start_date_from || undefined })} />
      <DashboardDateInput value={value.start_date_to ?? ""} onChange={(start_date_to) => update({ start_date_to: start_date_to || undefined })} />
      <Select value={value.sort_by ?? "created_at"} onValueChange={(sort_by) => update({ sort_by })}>
        <SelectTrigger><SelectValue placeholder="Sắp xếp theo" /></SelectTrigger>
        <SelectContent><SelectItem value="created_at">Ngày tạo</SelectItem><SelectItem value="name">Tên lớp</SelectItem><SelectItem value="start_date">Ngày bắt đầu</SelectItem></SelectContent>
      </Select>
      <Select value={value.sort_order ?? "desc"} onValueChange={(sort_order) => update({ sort_order: sort_order as "asc" | "desc" })}>
        <SelectTrigger><SelectValue placeholder="Thứ tự" /></SelectTrigger>
        <SelectContent><SelectItem value="desc">Giảm dần</SelectItem><SelectItem value="asc">Tăng dần</SelectItem></SelectContent>
      </Select>
      <Button type="button" variant="outline" onClick={onCreate}>Thêm lớp học</Button>
    </div>
  );
}
