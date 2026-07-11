import { useEffect, useMemo, useState } from "react";

import { SearchableSelect, type SearchableOption } from "@/components/Dashboard/Classes/SearchableSelect";
import { sessionModeOptions } from "@/components/Dashboard/Classes/classOptions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { BulkCreateClassSessionsRequest } from "@/services/classSessions/classSessions.type";
import type { ClassItem } from "@/services/classes/classes.type";

type AutoFormState = {
  startDate: string;
  classScheduleIds: string[];
  weeks: number;
  mode: string;
  meetingUrl: string;
  roomId: string | null;
  teacherId: string | null;
  lessonId: string | null;
  description: string;
  note: string;
};

const today = () => new Date().toISOString().slice(0, 10);
const timeValue = (value?: string | null) => value?.slice(0, 5) ?? "";

type ClassSessionAutoCreateDialogProps = {
  open: boolean;
  classItem: ClassItem;
  teacherOptions: SearchableOption[];
  lessonOptions: SearchableOption[];
  roomOptions: SearchableOption[];
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: BulkCreateClassSessionsRequest) => Promise<void>;
};

export function ClassSessionAutoCreateDialog({
  open,
  classItem,
  teacherOptions,
  lessonOptions,
  roomOptions,
  onOpenChange,
  onSubmit,
}: ClassSessionAutoCreateDialogProps) {
  const [form, setForm] = useState<AutoFormState>({
    startDate: classItem.start_date || today(),
    classScheduleIds: [],
    weeks: 1,
    mode: classItem.class_type === "online" ? "online" : "offline",
    meetingUrl: "",
    roomId: classItem.room_id,
    teacherId: classItem.teacher_id,
    lessonId: null,
    description: "",
    note: "",
  });

  useEffect(() => {
    if (!open) return;
    setForm((current) => ({
      ...current,
      startDate: classItem.start_date || today(),
      classScheduleIds: classItem.schedules?.map((item) => item.id) ?? [],
      mode: classItem.class_type === "online" ? "online" : "offline",
      roomId: classItem.room_id,
      teacherId: classItem.teacher_id,
    }));
  }, [classItem, open]);

  const generatedCount = useMemo(() => form.classScheduleIds.length * form.weeks, [form.classScheduleIds.length, form.weeks]);
  const update = (patch: Partial<AutoFormState>) => setForm((current) => ({ ...current, ...patch }));

  const toggleSchedule = (scheduleId: string) => {
    update({
      classScheduleIds: form.classScheduleIds.includes(scheduleId)
        ? form.classScheduleIds.filter((item) => item !== scheduleId)
        : [...form.classScheduleIds, scheduleId],
    });
  };

  const handleSubmit = async () => {
    await onSubmit({
      start_date: form.startDate,
      class_schedule_ids: form.classScheduleIds,
      weeks: Math.max(1, form.weeks),
      mode: form.mode,
      meeting_url: form.mode === "online" ? form.meetingUrl.trim() || null : null,
      room_id: form.mode === "offline" ? form.roomId : null,
      teacher_id: form.teacherId,
      lesson_id: form.lessonId,
      title_prefix: "Buổi",
      description: form.description.trim() || null,
      note: form.note.trim() || null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader><DialogTitle>Tạo lịch học tự động</DialogTitle></DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/*<label className="space-y-2 text-sm font-medium text-gray-700">
              Bắt đầu từ ngày<DashboardDateInput value={form.startDate} onChange={(startDate) => update({ startDate })} />
            </label>*/}
            <label className="space-y-2 text-sm font-medium text-gray-700">Số tuần tạo<Input type="number" min={1} value={form.weeks} onChange={(event) => update({ weeks: Math.max(1, Number(event.target.value || 1)) })} /></label>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">Lịch học trong tuần</p>
            {classItem.schedules?.length ? (
              <div className="flex flex-wrap gap-2">
                {classItem.schedules.map((schedule) => {
                  const selected = form.classScheduleIds.includes(schedule.id);
                  return (
                    <button key={schedule.id} type="button" onClick={() => toggleSchedule(schedule.id)} className={`rounded-2xl border px-3 py-2 text-sm font-semibold ${selected ? "border-brand-500 bg-brand-50 text-brand-700" : "border-gray-200 bg-white text-gray-500"}`}>
                      {schedule.schedule_name} · {timeValue(schedule.start_time)} - {timeValue(schedule.end_time)}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 p-4 text-sm text-gray-500">Lớp chưa có thời gian lịch học trong tuần.</div>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-gray-700">Hình thức buổi học<Select value={form.mode} onValueChange={(mode) => update({ mode })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{sessionModeOptions.map((item) => <SelectItem key={item.value} value={item.value}>{item.value}</SelectItem>)}</SelectContent></Select></label>
            {form.mode === "offline" ? (
              <label className="space-y-2 text-sm font-medium text-gray-700">Phòng học<SearchableSelect value={form.roomId} options={roomOptions} placeholder="Chọn phòng học" onChange={(roomId) => update({ roomId })} /></label>
            ) : (
              <label className="space-y-2 text-sm font-medium text-gray-700">Link học online<Input value={form.meetingUrl} onChange={(event) => update({ meetingUrl: event.target.value })} placeholder="Có thể để trống" /></label>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-gray-700">Giáo viên<SearchableSelect value={form.teacherId} options={teacherOptions} placeholder="Chọn giáo viên" onChange={(teacherId) => update({ teacherId })} /></label>
            <label className="space-y-2 text-sm font-medium text-gray-700">Bài học<SearchableSelect value={form.lessonId} options={lessonOptions} placeholder="Chọn bài học" onChange={(lessonId) => update({ lessonId })} /></label>
          </div>
          <div className="rounded-2xl bg-gray-50 p-3 text-sm text-gray-600">
            Sẽ tạo khoảng {generatedCount} buổi, đặt tên theo mẫu Buổi 1, Buổi 2...
          </div>
          <label className="space-y-2 text-sm font-medium text-gray-700">Mô tả<Textarea value={form.description} onChange={(event) => update({ description: event.target.value })} /></label>
          <label className="space-y-2 text-sm font-medium text-gray-700">Ghi chú<Textarea value={form.note} onChange={(event) => update({ note: event.target.value })} /></label>
        </div>
        <DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button><Button onClick={() => void handleSubmit()} disabled={!form.classScheduleIds.length}>Tạo tự động</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
