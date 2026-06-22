import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useClassSchedulesStore } from "@/services/classSchedules/classSchedules.store";
import type { ClassSchedule, ClassScheduleName } from "@/services/classSchedules/classSchedules.type";
import type { ClassItem } from "@/services/classes/classes.type";

const scheduleOptions: { value: ClassScheduleName; label: string }[] = [
  { value: "T2", label: "Thứ 2" },
  { value: "T3", label: "Thứ 3" },
  { value: "T4", label: "Thứ 4" },
  { value: "T5", label: "Thứ 5" },
  { value: "T6", label: "Thứ 6" },
  { value: "T7", label: "Thứ 7" },
  { value: "CN", label: "Chủ nhật" },
];

const emptyForm = {
  schedule_name: "T2" as ClassScheduleName,
  start_time: "08:00",
  end_time: "10:00",
};

const formatTime = (value?: string | null) => value?.slice(0, 5) || "--:--";

export const CourseClassSchedulesSection = ({ classes }: { classes: ClassItem[] }) => {
  const { schedules, isLoading, listClassSchedules, createClassSchedule, updateClassSchedule, deleteClassSchedule } = useClassSchedulesStore();
  const [selectedClassId, setSelectedClassId] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const selectedClass = useMemo(() => classes.find((item) => item.id === selectedClassId) ?? null, [classes, selectedClassId]);

  useEffect(() => {
    if (!selectedClassId && classes[0]) setSelectedClassId(classes[0].id);
  }, [classes, selectedClassId]);

  useEffect(() => {
    if (!selectedClassId) return;
    void listClassSchedules(selectedClassId).catch(() => toast.error("Không thể tải thời gian lịch học"));
  }, [listClassSchedules, selectedClassId]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const startEdit = (schedule: ClassSchedule) => {
    setEditingId(schedule.id);
    setForm({
      schedule_name: schedule.schedule_name,
      start_time: formatTime(schedule.start_time),
      end_time: formatTime(schedule.end_time),
    });
  };

  const handleSubmit = async () => {
    if (!selectedClassId) {
      toast.error("Vui lòng chọn lớp học");
      return;
    }
    if (form.end_time <= form.start_time) {
      toast.error("Giờ kết thúc phải sau giờ bắt đầu");
      return;
    }

    try {
      if (editingId) {
        await updateClassSchedule(editingId, form);
        toast.success("Cập nhật lịch học thành công");
      } else {
        await createClassSchedule(selectedClassId, form);
        toast.success("Thêm lịch học thành công");
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

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Thời gian lịch học trong tuần</h3>
          <p className="mt-1 text-sm text-gray-500">Chọn lớp rồi khai báo các khung giờ học cố định từ T2 đến CN.</p>
        </div>
        <Badge className="bg-emerald-50 text-emerald-700">{schedules.length} lịch</Badge>
      </div>

      {classes.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
          Cần tạo lớp trước khi thêm thời gian lịch học.
        </div>
      ) : (
        <>
          <div className="mt-5 grid gap-3 rounded-2xl bg-gray-50 p-4 md:grid-cols-2 xl:grid-cols-5">
            <label className="space-y-1.5 text-sm font-medium text-gray-700 xl:col-span-2">
              Lớp học
              <Select value={selectedClassId} onValueChange={(value) => { setSelectedClassId(value); resetForm(); }}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Chọn lớp" /></SelectTrigger>
                <SelectContent>
                  {classes.map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </label>
            <label className="space-y-1.5 text-sm font-medium text-gray-700">
              Ngày học
              <Select value={form.schedule_name} onValueChange={(value: ClassScheduleName) => setForm((prev) => ({ ...prev, schedule_name: value }))}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {scheduleOptions.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </label>
            <label className="space-y-1.5 text-sm font-medium text-gray-700">
              Giờ bắt đầu
              <Input type="time" value={form.start_time} onChange={(event) => setForm((prev) => ({ ...prev, start_time: event.target.value }))} />
            </label>
            <label className="space-y-1.5 text-sm font-medium text-gray-700">
              Giờ kết thúc
              <Input type="time" value={form.end_time} onChange={(event) => setForm((prev) => ({ ...prev, end_time: event.target.value }))} />
            </label>
            <div className="flex items-end gap-2 md:col-span-2 xl:col-span-5">
              <Button type="button" onClick={() => void handleSubmit()} disabled={isLoading}>
                <Plus className="h-4 w-4" />
                {editingId ? "Lưu lịch" : "Thêm lịch"}
              </Button>
              {editingId ? <Button type="button" variant="outline" onClick={resetForm}>Hủy sửa</Button> : null}
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-gray-100">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lớp</TableHead>
                  <TableHead>Ngày học</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-8 text-center text-sm text-gray-500">Chưa có lịch học trong tuần cho lớp này.</TableCell>
                  </TableRow>
                ) : schedules.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell>{selectedClass?.name || "-"}</TableCell>
                    <TableCell>{scheduleOptions.find((item) => item.value === schedule.schedule_name)?.label ?? schedule.schedule_name}</TableCell>
                    <TableCell>{formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => startEdit(schedule)}>
                          <Pencil className="h-4 w-4" />
                          Sửa
                        </Button>
                        <Button type="button" variant="destructive" size="sm" onClick={() => void handleDelete(schedule.id)}>
                          <Trash2 className="h-4 w-4" />
                          Xóa
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
};
