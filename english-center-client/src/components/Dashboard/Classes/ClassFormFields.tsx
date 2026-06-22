import { DashboardDateInput } from "@/components/Dashboard/Comon";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchableSelect, type SearchableOption } from "./SearchableSelect";
import { classStatusOptions, classTypeOptions } from "./classOptions";

export type ClassFormState = {
  courseId: string | null;
  teacherId: string | null;
  roomId: string | null;
  name: string;
  code: string;
  classType: string;
  maxStudents: number;
  startDate: string;
  status: string;
};

type ClassFormFieldsProps = {
  value: ClassFormState;
  courseOptions: SearchableOption[];
  teacherOptions: SearchableOption[];
  roomOptions: SearchableOption[];
  disableCourse?: boolean;
  onChange: (value: ClassFormState) => void;
};

export function ClassFormFields({ value, courseOptions, teacherOptions, roomOptions, disableCourse = false, onChange }: ClassFormFieldsProps) {
  const update = (patch: Partial<ClassFormState>) => onChange({ ...value, ...patch });

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <label className="space-y-2 text-sm font-medium text-gray-700">
        Khóa học
        <SearchableSelect value={value.courseId} options={courseOptions} placeholder="Chọn khóa học" allowClear={!disableCourse} disabled={disableCourse} onChange={(courseId) => update({ courseId })} />
      </label>
      <label className="space-y-2 text-sm font-medium text-gray-700">
        Giáo viên phụ trách
        <SearchableSelect value={value.teacherId} options={teacherOptions} placeholder="Chọn giáo viên" onChange={(teacherId) => update({ teacherId })} />
      </label>
      <label className="space-y-2 text-sm font-medium text-gray-700">
        Phòng học
        <SearchableSelect value={value.roomId} options={roomOptions} placeholder="Chọn phòng học" onChange={(roomId) => update({ roomId })} />
      </label>
      <label className="space-y-2 text-sm font-medium text-gray-700">
        Tên lớp
        <Input value={value.name} onChange={(event) => update({ name: event.target.value })} placeholder="Nhập tên lớp" />
      </label>
      <label className="space-y-2 text-sm font-medium text-gray-700">
        Mã lớp
        <Input value={value.code} onChange={(event) => update({ code: event.target.value })} placeholder="Để trống để tự sinh" />
      </label>
      <label className="space-y-2 text-sm font-medium text-gray-700">
        Loại lớp
        <Select value={value.classType} onValueChange={(classType) => update({ classType })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>{classTypeOptions.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent>
        </Select>
      </label>
      <label className="space-y-2 text-sm font-medium text-gray-700">
        Sĩ số tối đa
        <Input type="number" min={1} value={value.maxStudents} onChange={(event) => update({ maxStudents: Number(event.target.value || 1) })} />
      </label>
      <label className="space-y-2 text-sm font-medium text-gray-700">
        Ngày khai giảng
        <DashboardDateInput value={value.startDate} onChange={(startDate) => update({ startDate })} />
      </label>
      <label className="space-y-2 text-sm font-medium text-gray-700">
        Trạng thái
        <Select value={value.status} onValueChange={(status) => update({ status })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>{classStatusOptions.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent>
        </Select>
      </label>
    </div>
  );
}
