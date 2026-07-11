import { Select,type SelectOption} from "@/components/Comon/Select";
import { Input } from "@/components/ui/input";
import { classStatusOptions, classTypeOptions } from "./classOptions";

export type ClassFormState = {
  courseId: string | null;
  teacherId: string | null;
  roomId: string | null;
  name: string;
  code: string;
  classType: string;
  maxStudents: number;
  startDate: Date;
  status: string;
};

type ClassFormFieldsProps = {
  value: ClassFormState;
  courseOptions: SelectOption[];
  teacherOptions: SelectOption[];
  roomOptions: SelectOption[];
  hideCourse?: boolean;
  hideCode?: boolean;
  disableCourse?: boolean;
  disabled?: boolean;
  onChange: (value: ClassFormState) => void;
};

export function ClassFormFields({
  value,
  courseOptions,
  teacherOptions,
  roomOptions,
  hideCourse = false,
  hideCode = false,
  disabled = false,
  onChange,
}: ClassFormFieldsProps) {
  const update = (patch: Partial<ClassFormState>) => onChange({ ...value, ...patch });

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {!hideCourse ? (
        <label className="space-y-2 text-sm font-medium text-gray-700">
          Khóa học
          <Select
            disabled={disabled}
            value={courseOptions.find((item) => item.key === value.courseId) ?? null}
            onChange={(option) => update({ courseId: option?.value ?? "" })}
            options={courseOptions.map((item) => ({ key: item.key, value: item.value }))}
            placeholder="Chọn khóa học"
          />
        </label>
      ) : null}
      <label className="space-y-2 text-sm font-medium text-gray-700">
        Giáo viên phụ trách
        <Select
          disabled={disabled}
          value={teacherOptions.find((item) => item.value === value.teacherId) ?? null}
          onChange={(option) => update({ teacherId: option?.value ?? "" })}
          options={teacherOptions.map((item) => ({ key: item.key, value: item.value }))}
          placeholder="Chọn giáo viên"
        />
      </label>
      <label className="space-y-2 text-sm font-medium text-gray-700">
        Phòng học
        <Select
          disabled={disabled}
          value={roomOptions.find((item) => item.value === value.roomId) ?? null}
          onChange={(option) => update({ roomId: option?.value ?? "" })}
          options={roomOptions.map((item) => ({ key: item.key, value: item.value }))}
          placeholder="Chọn phòng học"
        />
      </label>
      <label className="space-y-2 text-sm font-medium text-gray-700">
        Tên lớp
        <Input disabled={disabled} value={value.name} onChange={(event) => update({ name: event.target.value })} placeholder="Nhập tên lớp" />
      </label>
      {!hideCode ? (
        <label className="space-y-2 text-sm font-medium text-gray-700">
          Mã lớp
          <Input disabled={disabled} value={value.code} onChange={(event) => update({ code: event.target.value })} placeholder="Để trống để tự sinh" />
        </label>
      ) : null}
      <label className="space-y-2 text-sm font-medium text-gray-700">
        Loại lớp
        <Select
          disabled={disabled}
          value={classTypeOptions.find((item) => item.value === value.classType) ?? null}
          onChange={(option) => update({ classType: option?.value ?? "" })}
          options={classTypeOptions.map((item) => ({ key: item.key, value: item.value }))}
          placeholder="Chọn loại lớp"
        />
      </label>
      <label className="space-y-2 text-sm font-medium text-gray-700">
        Sĩ số tối đa
        <Input disabled={disabled} type="number" min={1} value={value.maxStudents} onChange={(event) => update({ maxStudents: Number(event.target.value || 1) })} />
      </label>
      {/*<label className="space-y-2 text-sm font-medium text-gray-700">
        Ngày khai giảng
        <DashboardDateInput disabled={disabled} value={value.startDate} onChange={(startDate) => update({ startDate })} />
      </label>*/}
      <label className="space-y-2 text-sm font-medium text-gray-700">
        Trạng thái
        <Select
          disabled={disabled}
          value={classStatusOptions.find((item) => item.value === value.status) ?? null}
          onChange={(option) => update({ status: option?.value ?? "" })}
          options={classStatusOptions.map((item) => ({ key: item.key, value: item.value }))}
          placeholder="Chọn trạng thái"
        />
      </label>
    </div>
  );
}
