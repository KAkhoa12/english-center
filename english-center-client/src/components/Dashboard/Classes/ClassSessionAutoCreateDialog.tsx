import { useEffect, useMemo, useState } from "react";

import { DashboardDateInput } from "@/components/Dashboard/Comon";
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
  weekdays: number[];
  weeks: number;
  startTime: string;
  endTime: string;
  mode: string;
  meetingUrl: string;
  roomId: string | null;
  teacherId: string | null;
  lessonId: string | null;
  description: string;
  note: string;
};

const weekdayOptions = [
  { value: 0, label: "T2" },
  { value: 1, label: "T3" },
  { value: 2, label: "T4" },
  { value: 3, label: "T5" },
  { value: 4, label: "T6" },
  { value: 5, label: "T7" },
  { value: 6, label: "CN" },
];

const today = () => new Date().toISOString().slice(0, 10);

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
  const maxWeeks = Math.max(1, classItem.course?.duration_weeks ?? 1);
  const [form, setForm] = useState<AutoFormState>({
    startDate: classItem.start_date || today(),
    weekdays: [],
    weeks: 1,
    startTime: "08:00",
    endTime: "10:00",
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
      mode: classItem.class_type === "online" ? "online" : "offline",
      roomId: classItem.room_id,
      teacherId: classItem.teacher_id,
      weeks: Math.min(current.weeks || 1, maxWeeks),
    }));
  }, [classItem, maxWeeks, open]);

  const generatedCount = useMemo(() => form.weekdays.length * form.weeks, [form.weekdays.length, form.weeks]);
  const update = (patch: Partial<AutoFormState>) => setForm((current) => ({ ...current, ...patch }));

  const toggleWeekday = (weekday: number) => {
    update({
      weekdays: form.weekdays.includes(weekday)
        ? form.weekdays.filter((item) => item !== weekday)
        : [...form.weekdays, weekday].sort((a, b) => a - b),
    });
  };

  const handleSubmit = async () => {
    await onSubmit({
      start_date: form.startDate,
      weekdays: form.weekdays,
      weeks: Math.min(Math.max(1, form.weeks), maxWeeks),
      start_time: form.startTime,
      end_time: form.endTime,
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
          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2 text-sm font-medium text-gray-700">Bắt đầu từ ngày<DashboardDateInput value={form.startDate} onChange={(startDate) => update({ startDate })} /></label>
            <label className="space-y-2 text-sm font-medium text-gray-700">Giờ bắt đầu<Input type="time" value={form.startTime} onChange={(event) => update({ startTime: event.target.value })} /></label>
            <label className="space-y-2 text-sm font-medium text-gray-700">Giờ kết thúc<Input type="time" value={form.endTime} onChange={(event) => update({ endTime: event.target.value })} /></label>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">Ngày học trong tuần</p>
            <div className="flex flex-wrap gap-2">
              {weekdayOptions.map((item) => {
                const selected = form.weekdays.includes(item.value);
                return (
                  <button key={item.value} type="button" onClick={() => toggleWeekday(item.value)} className={`h-11 w-11 rounded-2xl border text-sm font-semibold ${selected ? "border-brand-500 bg-brand-50 text-brand-700" : "border-gray-200 bg-white text-gray-500"}`}>
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2 text-sm font-medium text-gray-700">Số tuần tạo<Input type="number" min={1} max={maxWeeks} value={form.weeks} onChange={(event) => update({ weeks: Math.min(Number(event.target.value || 1), maxWeeks) })} /></label>
            <label className="space-y-2 text-sm font-medium text-gray-700">Hình thức buổi học<Select value={form.mode} onValueChange={(mode) => update({ mode })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{sessionModeOptions.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent></Select></label>
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
        <DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button><Button onClick={() => void handleSubmit()}>Tạo tự động</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
