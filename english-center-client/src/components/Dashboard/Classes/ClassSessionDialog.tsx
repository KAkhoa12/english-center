import { useEffect, useState } from "react";

import { DashboardDateInput } from "@/components/Dashboard/Comon";
import { SearchableSelect, type SearchableOption } from "@/components/Dashboard/Classes/SearchableSelect";
import { sessionModeOptions, sessionStatusOptions } from "@/components/Dashboard/Classes/classOptions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ClassSession, CreateClassSessionRequest, UpdateClassSessionRequest } from "@/services/classSessions/classSessions.type";

type SessionFormState = {
  teacherId: string | null;
  lessonId: string | null;
  roomId: string | null;
  title: string;
  description: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  mode: string;
  meetingUrl: string;
  status: string;
  note: string;
};

const initialForm: SessionFormState = {
  teacherId: null,
  lessonId: null,
  roomId: null,
  title: "",
  description: "",
  sessionDate: "",
  startTime: "08:00",
  endTime: "10:00",
  mode: "offline",
  meetingUrl: "",
  status: "scheduled",
  note: "",
};

const timeValue = (value?: string | null) => value?.slice(0, 5) ?? "";

type ClassSessionDialogProps = {
  open: boolean;
  session?: ClassSession | null;
  teacherOptions: SearchableOption[];
  lessonOptions: SearchableOption[];
  roomOptions: SearchableOption[];
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateClassSessionRequest | UpdateClassSessionRequest) => Promise<void>;
};

export function ClassSessionDialog({ open, session, teacherOptions, lessonOptions, roomOptions, onOpenChange, onSubmit }: ClassSessionDialogProps) {
  const [form, setForm] = useState<SessionFormState>(initialForm);
  const isEdit = Boolean(session);

  useEffect(() => {
    if (!open) return;
    setForm(session ? {
      teacherId: session.teacher_id,
      lessonId: session.lesson_id,
      roomId: session.room_id,
      title: session.title,
      description: session.description ?? "",
      sessionDate: session.session_date,
      startTime: timeValue(session.start_time),
      endTime: timeValue(session.end_time),
      mode: session.mode,
      meetingUrl: session.meeting_url ?? "",
      status: session.status,
      note: session.note ?? "",
    } : initialForm);
  }, [open, session]);

  const update = (patch: Partial<SessionFormState>) => setForm((current) => ({ ...current, ...patch }));

  const handleSubmit = async () => {
    await onSubmit({
      teacher_id: form.teacherId,
      lesson_id: form.lessonId,
      room_id: form.mode === "offline" ? form.roomId : null,
      title: form.title.trim(),
      description: form.description || null,
      session_date: form.sessionDate,
      start_time: form.startTime,
      end_time: form.endTime,
      mode: form.mode,
      meeting_url: form.mode === "online" ? form.meetingUrl || null : null,
      status: isEdit ? form.status : undefined,
      note: form.note || null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader><DialogTitle>{isEdit ? "Cập nhật lịch học" : "Thêm lịch học mới"}</DialogTitle></DialogHeader>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-gray-700">Tiêu đề<Input value={form.title} onChange={(event) => update({ title: event.target.value })} /></label>
          <label className="space-y-2 text-sm font-medium text-gray-700">Giáo viên<SearchableSelect value={form.teacherId} options={teacherOptions} placeholder="Chọn giáo viên" onChange={(teacherId) => update({ teacherId })} /></label>
          <label className="space-y-2 text-sm font-medium text-gray-700">Bài học<SearchableSelect value={form.lessonId} options={lessonOptions} placeholder="Chọn bài học" onChange={(lessonId) => update({ lessonId })} /></label>
          {form.mode === "offline" ? <label className="space-y-2 text-sm font-medium text-gray-700">Phòng học<SearchableSelect value={form.roomId} options={roomOptions} placeholder="Chọn phòng học" onChange={(roomId) => update({ roomId })} /></label> : null}
          <label className="space-y-2 text-sm font-medium text-gray-700">Ngày học<DashboardDateInput value={form.sessionDate} onChange={(sessionDate) => update({ sessionDate })} /></label>
          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-2 text-sm font-medium text-gray-700">Bắt đầu<Input type="time" value={form.startTime} onChange={(event) => update({ startTime: event.target.value })} /></label>
            <label className="space-y-2 text-sm font-medium text-gray-700">Kết thúc<Input type="time" value={form.endTime} onChange={(event) => update({ endTime: event.target.value })} /></label>
          </div>
          <label className="space-y-2 text-sm font-medium text-gray-700">Hình thức<Select value={form.mode} onValueChange={(mode) => update({ mode })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{sessionModeOptions.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent></Select></label>
          {form.mode === "online" ? <label className="space-y-2 text-sm font-medium text-gray-700">Link học online<Input value={form.meetingUrl} onChange={(event) => update({ meetingUrl: event.target.value })} placeholder="Có thể để trống" /></label> : null}
          {isEdit && <label className="space-y-2 text-sm font-medium text-gray-700">Trạng thái<Select value={form.status} onValueChange={(status) => update({ status })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{sessionStatusOptions.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent></Select></label>}
          <label className="space-y-2 text-sm font-medium text-gray-700 md:col-span-2">Mô tả<Textarea value={form.description} onChange={(event) => update({ description: event.target.value })} /></label>
          <label className="space-y-2 text-sm font-medium text-gray-700 md:col-span-2">Ghi chú<Textarea value={form.note} onChange={(event) => update({ note: event.target.value })} /></label>
        </div>
        <DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button><Button onClick={() => void handleSubmit()}>{isEdit ? "Lưu cập nhật" : "Thêm lịch học"}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
