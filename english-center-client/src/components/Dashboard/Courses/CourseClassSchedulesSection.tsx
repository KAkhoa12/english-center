import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import MutilSelect, { type MutilSelectOption } from "@/components/Comon/MutilSelect";
import { Select, type SelectOption } from "@/components/Comon/Select";
import TableList from "@/components/Comon/TableList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useClassSchedulesStore } from "@/services/classSchedules/classSchedules.store";
import type { ClassSchedule, ClassScheduleName } from "@/services/classSchedules/classSchedules.type";
import type { ClassItem } from "@/services/classes/classes.type";

const scheduleOptions: SelectOption[] = [
  { key: "Thứ 2", value: "T2" },
  { key: "Thứ 3", value: "T3" },
  { key: "Thứ 4", value: "T4" },
  { key: "Thứ 5", value: "T5" },
  { key: "Thứ 6", value: "T6" },
  { key: "Thứ 7", value: "T7" },
  { key: "Chủ nhật", value: "CN" },
];

const emptyForm = {
  schedule_name: "T2" as ClassScheduleName,
  start_time: "08:00",
  end_time: "10:00",
};

const formatTime = (value?: string | null) => value?.slice(0, 5) || "--:--";

type CourseClassSchedulesSectionProps = {
  classes: ClassItem[];
  selectedClassId?: string;
  hideClassSelect?: boolean;
};

export const CourseClassSchedulesSection = ({
  classes,
  selectedClassId,
  hideClassSelect = false,
}: CourseClassSchedulesSectionProps) => {
  const { schedules, isLoading, listClassSchedules, createClassSchedule, updateClassSchedule, deleteClassSchedule } = useClassSchedulesStore();
  const [internalSelectedClassId, setInternalSelectedClassId] = useState(selectedClassId ?? "");
  const [form, setForm] = useState(emptyForm);
  const [selectedDays, setSelectedDays] = useState<MutilSelectOption[]>([{ key: "Thứ 2", value: "T2" }]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const activeClassId = selectedClassId ?? internalSelectedClassId;
  const selectedClass = useMemo(() => classes.find((item) => item.id === activeClassId) ?? null, [activeClassId, classes]);
  const classOptions = useMemo(
    () => classes.map((item) => ({ key: item.name, value: item.id })),
    [classes],
  );

  useEffect(() => {
    if (selectedClassId !== undefined) {
      setInternalSelectedClassId(selectedClassId);
      return;
    }
    if (!internalSelectedClassId && classes[0]) setInternalSelectedClassId(classes[0].id);
  }, [classes, internalSelectedClassId, selectedClassId]);

  useEffect(() => {
    if (!activeClassId) return;
    void listClassSchedules(activeClassId).catch(() => toast.error("Không thể tải thời gian lịch học"));
  }, [activeClassId, listClassSchedules]);

  const resetForm = () => {
    setForm(emptyForm);
    setSelectedDays([{ key: "Thứ 2", value: "T2" }]);
    setEditingId(null);
  };

  const startEdit = (schedule: ClassSchedule) => {
    setEditingId(schedule.id);
    setForm({
      schedule_name: schedule.schedule_name,
      start_time: formatTime(schedule.start_time),
      end_time: formatTime(schedule.end_time),
    });
    setSelectedDays([{ key: scheduleOptions.find((item) => item.value === schedule.schedule_name)?.key ?? schedule.schedule_name, value: schedule.schedule_name }]);
  };

  const handleSubmit = async () => {
    if (!activeClassId) {
      toast.error("Vui lòng chọn lớp học");
      return;
    }
    if (form.end_time <= form.start_time) {
      toast.error("Giờ kết thúc phải sau giờ bắt đầu");
      return;
    }

    const days = selectedDays.length > 0 ? selectedDays : [scheduleOptions.find((item) => item.value === form.schedule_name) ?? { key: "Thứ 2", value: "T2" }];

    try {
      if (editingId) {
        await updateClassSchedule(editingId, form);
        toast.success("Cập nhật lịch học thành công");
      } else {
        for (const day of days) {
          await createClassSchedule(activeClassId, { ...form, schedule_name: day.value as ClassScheduleName });
        }
        toast.success(days.length > 1 ? `Đã thêm ${days.length} lịch học` : "Thêm lịch học thành công");
      }
      resetForm();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Lưu lịch học thất bại");
    }
  };

  const handleDelete = async (scheduleId: string) => {
    try {
      await deleteClassSchedule(scheduleId);
      toast.success("Xóa lịch học thành công");
      if (editingId === scheduleId) resetForm();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Xóa lịch học thất bại");
    }
  };

  const columns = [
    {
      key: "schedule_name",
      header: "Ngày học",
      render: (row: ClassSchedule) => scheduleOptions.find((item) => item.value === row.schedule_name)?.key ?? row.schedule_name,
    },
    {
      key: "time",
      header: "Thời gian",
      render: (row: ClassSchedule) => `${formatTime(row.start_time)} - ${formatTime(row.end_time)}`,
    },
    {
      key: "actions",
      header: "Thao tác",
      className: "text-right",
      render: (row: ClassSchedule) => (
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => startEdit(row)}>
            <Pencil className="h-4 w-4" />
            Sửa
          </Button>
          <Button type="button" variant="destructive" size="sm" onClick={() => void handleDelete(row.id)}>
            <Trash2 className="h-4 w-4" />
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Thời gian lịch học trong tuần</h3>
          <p className="mt-1 text-sm text-gray-500">Chọn lớp rồi khai báo các khung giờ học cố định từ T2 đến CN.</p>
        </div>
        <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
          {schedules.length} lịch
        </span>
      </div>

      {classes.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
          Cần tạo lớp trước khi thêm thời gian lịch học.
        </div>
      ) : (
        <>
          <div className="mt-5 grid gap-3 rounded-2xl bg-gray-50 p-4 xl:grid-cols-2">
            {!hideClassSelect ? (
              <label className="space-y-1.5 text-sm font-medium text-gray-700">
                Lớp học
                <Select
                  value={classOptions.find((item) => item.value === activeClassId) ?? null}
                  onChange={(option) => {
                    setInternalSelectedClassId(option?.value ?? "");
                    resetForm();
                  }}
                  options={classOptions}
                  placeholder="Chọn lớp"
                  is_search
                  searchPlaceholder="Tìm lớp học..."
                  emptyText="Không có lớp học"
                />
              </label>
            ) : (
              <div>
                <p className="text-sm font-medium text-gray-700">Lớp học</p>
                <p className="mt-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900">
                  {selectedClass?.name || "Chưa chọn lớp"}
                </p>
              </div>
            )}

            <label className="space-y-1.5 text-sm font-medium text-gray-700">
              Ngày học
              <MutilSelect
                value={selectedDays}
                onChange={setSelectedDays}
                options={scheduleOptions}
                placeholder="Chọn ngày học"
                searchPlaceholder="Tìm thứ trong tuần..."
                emptyText="Không có ngày học"
                is_search
              />
            </label>

            <label className="space-y-1.5 text-sm font-medium text-gray-700">
              Giờ bắt đầu
              <Input type="time" value={form.start_time} onChange={(event) => setForm((prev) => ({ ...prev, start_time: event.target.value }))} />
            </label>

            <label className="space-y-1.5 text-sm font-medium text-gray-700">
              Giờ kết thúc
              <Input type="time" value={form.end_time} onChange={(event) => setForm((prev) => ({ ...prev, end_time: event.target.value }))} />
            </label>

            <div className="flex items-end gap-2 xl:col-span-2">
              <Button type="button" onClick={() => void handleSubmit()} disabled={isLoading || !activeClassId}>
                <Plus className="h-4 w-4" />
                {editingId ? "Lưu lịch" : "Thêm lịch"}
              </Button>
              {editingId ? (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Hủy sửa
                </Button>
              ) : null}
            </div>
          </div>

          <div className="mt-5">
            <TableList
              columns={columns}
              data={schedules}
              getRowId={(row) => row.id}
              loading={isLoading}
              emptyText="Chưa có lịch học trong tuần cho lớp này."
            />
          </div>
        </>
      )}
    </div>
  );
};
