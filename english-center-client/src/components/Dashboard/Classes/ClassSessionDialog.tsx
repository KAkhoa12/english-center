import { useEffect, useState } from "react";

import {
  SearchableSelect,
  type SearchableOption,
} from "@/components/Dashboard/Classes/SearchableSelect";
import {
  sessionModeOptions,
  sessionStatusOptions,
} from "@/components/Dashboard/Classes/classOptions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type {
  ClassSession,
  CreateClassSessionRequest,
  UpdateClassSessionRequest,
} from "@/services/classSessions/classSessions.type";
import type { ClassSchedule } from "@/services/classes/classes.type";

type SessionFormState = {
  classScheduleId: string;
  teacherId: string | null;
  lessonId: string | null;
  roomId: string | null;
  title: string;
  description: string;
  sessionDate: string;
  overrideStartTime: string;
  overrideEndTime: string;
  mode: string;
  meetingUrl: string;
  status: string;
  note: string;
};

const initialForm: SessionFormState = {
  classScheduleId: "",
  teacherId: null,
  lessonId: null,
  roomId: null,
  title: "",
  description: "",
  sessionDate: "",
  overrideStartTime: "",
  overrideEndTime: "",
  mode: "offline",
  meetingUrl: "",
  status: "scheduled",
  note: "",
};

const timeValue = (value?: string | null) => value?.slice(0, 5) ?? "";

type ClassSessionDialogProps = {
  open: boolean;
  session?: ClassSession | null;
  schedules: ClassSchedule[];
  teacherOptions: SearchableOption[];
  lessonOptions: SearchableOption[];
  roomOptions: SearchableOption[];
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    data: CreateClassSessionRequest | UpdateClassSessionRequest,
  ) => Promise<void>;
};

export function ClassSessionDialog({
  open,
  session,
  schedules,
  teacherOptions,
  lessonOptions,
  roomOptions,
  onOpenChange,
  onSubmit,
}: ClassSessionDialogProps) {
  const [form, setForm] = useState<SessionFormState>(initialForm);
  const isEdit = Boolean(session);

  useEffect(() => {
    if (!open) return;
    setForm(
      session
        ? {
            classScheduleId: session.class_schedule_id,
            teacherId: session.teacher_id,
            lessonId: session.lesson_id,
            roomId: session.room_id,
            title: session.title,
            description: session.description ?? "",
            sessionDate: session.session_date,
            overrideStartTime: timeValue(session.override_start_time),
            overrideEndTime: timeValue(session.override_end_time),
            mode: session.mode,
            meetingUrl: session.meeting_url ?? "",
            status: session.status,
            note: session.note ?? "",
          }
        : { ...initialForm, classScheduleId: schedules[0]?.id ?? "" },
    );
  }, [open, schedules, session]);

  const update = (patch: Partial<SessionFormState>) =>
    setForm((current) => ({ ...current, ...patch }));

  const handleSubmit = async () => {
    const overridePayload =
      form.overrideStartTime && form.overrideEndTime
        ? {
            override_start_time: form.overrideStartTime,
            override_end_time: form.overrideEndTime,
          }
        : { override_start_time: null, override_end_time: null };

    await onSubmit({
      class_schedule_id: form.classScheduleId,
      teacher_id: form.teacherId,
      lesson_id: form.lessonId,
      room_id: form.mode === "offline" ? form.roomId : null,
      title: form.title.trim(),
      description: form.description || null,
      session_date: form.sessionDate,
      ...overridePayload,
      mode: form.mode,
      meeting_url: form.mode === "online" ? form.meetingUrl || null : null,
      status: isEdit ? form.status : undefined,
      note: form.note || null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Cập nhật lịch học" : "Thêm lịch học mới"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-gray-700">
            Tiêu đề
            <Input
              value={form.title}
              onChange={(event) => update({ title: event.target.value })}
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-gray-700">
            Lịch học trong tuần
            <Select
              value={form.classScheduleId}
              onValueChange={(classScheduleId) => update({ classScheduleId })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn lịch học" />
              </SelectTrigger>
              <SelectContent>
                {schedules.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.schedule_name} · {timeValue(item.start_time)} -{" "}
                    {timeValue(item.end_time)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
          <label className="space-y-2 text-sm font-medium text-gray-700">
            Giáo viên
            <SearchableSelect
              value={form.teacherId}
              options={teacherOptions}
              placeholder="Chọn giáo viên"
              onChange={(teacherId) => update({ teacherId })}
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-gray-700">
            Bài học
            <SearchableSelect
              value={form.lessonId}
              options={lessonOptions}
              placeholder="Chọn bài học"
              onChange={(lessonId) => update({ lessonId })}
            />
          </label>
          {form.mode === "offline" ? (
            <label className="space-y-2 text-sm font-medium text-gray-700">
              Phòng học
              <SearchableSelect
                value={form.roomId}
                options={roomOptions}
                placeholder="Chọn phòng học"
                onChange={(roomId) => update({ roomId })}
              />
            </label>
          ) : null}
          {/*<label className="space-y-2 text-sm font-medium text-gray-700">Ngày học<DashboardDateInput value={form.sessionDate} onChange={(sessionDate) => update({ sessionDate })} /></label>*/}
          <div className="grid grid-cols-2 gap-3 md:col-span-2">
            <label className="space-y-2 text-sm font-medium text-gray-700">
              Override bắt đầu
              <Input
                type="time"
                value={form.overrideStartTime}
                onChange={(event) =>
                  update({ overrideStartTime: event.target.value })
                }
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-gray-700">
              Override kết thúc
              <Input
                type="time"
                value={form.overrideEndTime}
                onChange={(event) =>
                  update({ overrideEndTime: event.target.value })
                }
              />
            </label>
          </div>
          <label className="space-y-2 text-sm font-medium text-gray-700">
            Hình thức
            <Select
              value={form.mode}
              onValueChange={(mode) => update({ mode })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sessionModeOptions.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
          {form.mode === "online" ? (
            <label className="space-y-2 text-sm font-medium text-gray-700">
              Link học online
              <Input
                value={form.meetingUrl}
                onChange={(event) => update({ meetingUrl: event.target.value })}
                placeholder="Có thể để trống"
              />
            </label>
          ) : null}
          {isEdit && (
            <label className="space-y-2 text-sm font-medium text-gray-700">
              Trạng thái
              <Select
                value={form.status}
                onValueChange={(status) => update({ status })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sessionStatusOptions.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
          )}
          <label className="space-y-2 text-sm font-medium text-gray-700 md:col-span-2">
            Mô tả
            <Textarea
              value={form.description}
              onChange={(event) => update({ description: event.target.value })}
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-gray-700 md:col-span-2">
            Ghi chú
            <Textarea
              value={form.note}
              onChange={(event) => update({ note: event.target.value })}
            />
          </label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            onClick={() => void handleSubmit()}
            disabled={!form.classScheduleId}
          >
            {isEdit ? "Lưu cập nhật" : "Thêm lịch học"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
