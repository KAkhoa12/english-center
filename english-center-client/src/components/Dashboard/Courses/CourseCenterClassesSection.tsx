import { ChevronDown, FileText, Link as LinkIcon, Plus, Trash2, Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { DashboardDateInput } from "@/components/Dashboard/Comon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useClassSessionMediaStore } from "@/services/classSessionMedia/classSessionMedia.store";
import type { ClassSessionMedia } from "@/services/classSessionMedia/classSessionMedia.type";
import { useClassSessionsStore } from "@/services/classSessions/classSessions.store";
import type { ClassSession, CreateClassSessionRequest } from "@/services/classSessions/classSessions.type";
import type { ClassCreateRequest, ClassItem } from "@/services/classes/classes.type";
import { generateCode } from "@/shared/helpers/code-format";
import { PRIVATE_ROUTES } from "@/shared/routes";

const emptyClassForm = {
  name: "",
  code: "",
  class_type: "offline",
  max_students: "20",
  start_date: "",
  end_date: "",
  status: "planned",
};

const emptySessionForm = {
  title: "",
  description: "",
  session_date: "",
  start_time: "08:00",
  end_time: "10:00",
  mode: "online",
  meeting_url: "",
  note: "",
};

const classStatusOptions = [
  { value: "planned", label: "Dự kiến" },
  { value: "ongoing", label: "Đang học" },
  { value: "completed", label: "Hoàn thành" },
  { value: "cancelled", label: "Đã hủy" },
  { value: "archived", label: "Lưu trữ" },
];

const classStatusLabel = (status: string) => classStatusOptions.find((item) => item.value === status)?.label ?? status;

type CourseCenterClassesSectionProps = {
  courseId: string;
  classes: ClassItem[];
  onCreateClass: (payload: ClassCreateRequest) => Promise<void>;
  onDeleteClass: (classId: string) => Promise<void>;
};

const FieldLabel = ({ children }: { children: string }) => (
  <label className="text-sm font-medium text-gray-700">{children}</label>
);

const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="space-y-1.5">
    <FieldLabel>{label}</FieldLabel>
    {children}
  </div>
);

const formatDate = (value?: string | null) => {
  if (!value) return "Chưa có ngày";
  return new Date(value).toLocaleDateString("vi-VN");
};

const formatFileSize = (size?: number | null) => {
  if (!size) return "";
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

export const CourseCenterClassesSection = ({ courseId, classes, onCreateClass, onDeleteClass }: CourseCenterClassesSectionProps) => {
  const navigate = useNavigate();
  const { createSession, listSessions, deleteSession } = useClassSessionsStore();
  const [classForm, setClassForm] = useState(emptyClassForm);
  const [classCodeTouched, setClassCodeTouched] = useState(false);
  const [sessionsByClassId, setSessionsByClassId] = useState<Record<string, ClassSession[]>>({});
  const [sessionDialogOpen, setSessionDialogOpen] = useState(false);
  const [activeClass, setActiveClass] = useState<ClassItem | null>(null);
  const [sessionForm, setSessionForm] = useState(emptySessionForm);

  const handleCreateClass = async () => {
    if (!classForm.name.trim()) {
      toast.error("Vui lòng nhập tên lớp");
      return;
    }

    try {
      await onCreateClass({
        course_id: courseId,
        name: classForm.name.trim(),
        code: classForm.code.trim() || null,
        class_type: classForm.class_type,
        max_students: Number(classForm.max_students || 1),
        start_date: classForm.start_date || null,
        end_date: classForm.end_date || null,
        status: classForm.status,
      });
      setClassForm(emptyClassForm);
      setClassCodeTouched(false);
      toast.success("Thêm lớp học thành công");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Thêm lớp học thất bại");
    }
  };

  const loadSessions = async (classId: string) => {
    const sessions = await listSessions(classId, { page: 1, page_size: 100, sort_by: "session_date", sort_order: "asc" });
    setSessionsByClassId((prev) => ({ ...prev, [classId]: sessions }));
  };

  const openCreateSession = (classItem: ClassItem) => {
    setActiveClass(classItem);
    setSessionForm(emptySessionForm);
    setSessionDialogOpen(true);
  };

  const handleCreateSession = async () => {
    if (!activeClass || !sessionForm.title.trim() || !sessionForm.session_date) {
      toast.error("Vui lòng nhập tên buổi học và ngày học");
      return;
    }

    const payload: CreateClassSessionRequest = {
      title: sessionForm.title.trim(),
      description: sessionForm.description.trim() || null,
      session_date: sessionForm.session_date,
      start_time: sessionForm.start_time,
      end_time: sessionForm.end_time,
      mode: sessionForm.mode,
      meeting_url: sessionForm.meeting_url.trim() || null,
      note: sessionForm.note.trim() || null,
    };

    try {
      await createSession(activeClass.id, payload);
      await loadSessions(activeClass.id);
      setSessionDialogOpen(false);
      toast.success("Thêm lịch học thành công");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Thêm lịch học thất bại");
    }
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Lớp học của khóa center</h3>
          <p className="mt-1 text-sm text-gray-500">Tạo lớp, mở collapse từng lớp để quản lý lịch học và tài liệu tham khảo.</p>
        </div>
        <Badge className="bg-blue-50 text-blue-700">{classes.length} lớp</Badge>
      </div>

      <div className="mt-5 rounded-2xl bg-gray-50 p-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Field label="Tên lớp">
            <Input
              value={classForm.name}
              onChange={(event) => {
                const name = event.target.value;
                setClassForm((prev) => ({ ...prev, name, code: classCodeTouched ? prev.code : generateCode(name) }));
              }}
              placeholder="VD: IELTS Foundation 01"
            />
          </Field>
          <Field label="Mã lớp">
            <Input value={classForm.code} onChange={(event) => { setClassCodeTouched(true); setClassForm((prev) => ({ ...prev, code: generateCode(event.target.value) })); }} placeholder="VD: IELTS_F01" />
          </Field>
          <Field label="Hình thức lớp">
            <Select value={classForm.class_type} onValueChange={(value) => setClassForm((prev) => ({ ...prev, class_type: value }))}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Sĩ số tối đa">
            <Input type="number" min={1} value={classForm.max_students} onChange={(event) => setClassForm((prev) => ({ ...prev, max_students: event.target.value }))} />
          </Field>
          <Field label="Ngày bắt đầu">
            <DashboardDateInput value={classForm.start_date} onChange={(start_date) => setClassForm((prev) => ({ ...prev, start_date }))} />
          </Field>
          <Field label="Ngày kết thúc">
            <DashboardDateInput value={classForm.end_date} onChange={(end_date) => setClassForm((prev) => ({ ...prev, end_date }))} />
          </Field>
          <Field label="Trạng thái lớp">
            <Select value={classForm.status} onValueChange={(value) => setClassForm((prev) => ({ ...prev, status: value }))}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {classStatusOptions.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <div className="flex items-end">
            <Button type="button" className="w-full" onClick={() => void handleCreateClass()}>
              <Plus className="h-4 w-4" />
              Thêm lớp
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {classes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">Chưa có lớp nào cho khóa center này.</div>
        ) : (
          classes.map((item) => (
            <details
              key={item.id}
              className="group rounded-2xl border border-gray-100 bg-white p-4"
              onToggle={(event) => {
                if (event.currentTarget.open && !sessionsByClassId[item.id]) {
                  void loadSessions(item.id).catch(() => toast.error("Không thể tải lịch học của lớp"));
                }
              }}
            >
              <summary className="flex cursor-pointer list-none flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                    <Badge className="bg-blue-50 text-blue-700">{classStatusLabel(item.status)}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{item.code || "Chưa có mã lớp"} · {item.class_type}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    {item.current_students_count}/{item.max_students} học viên · Bắt đầu {formatDate(item.start_date)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={(event) => { event.preventDefault(); openCreateSession(item); }}>
                    <Plus className="h-4 w-4" />
                    Lịch học
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={(event) => { event.preventDefault(); navigate(PRIVATE_ROUTES.DASHBOARD_CLASSES_EDIT.replace(":classId", item.id)); }}>
                    Sửa
                  </Button>
                  <Button type="button" variant="destructive" size="sm" onClick={async (event) => { event.preventDefault(); try { await onDeleteClass(item.id); toast.success("Xóa lớp thành công"); } catch { toast.error("Xóa lớp thất bại"); } }}>
                    Xóa
                  </Button>
                  <ChevronDown className="h-4 w-4 text-gray-400 transition-transform group-open:rotate-180" />
                </div>
              </summary>

              <ClassSessionsList
                classId={item.id}
                sessions={sessionsByClassId[item.id] ?? []}
                onDeleted={async (sessionId) => {
                  try {
                    await deleteSession(sessionId);
                    await loadSessions(item.id);
                    toast.success("Xóa lịch học thành công");
                  } catch {
                    toast.error("Xóa lịch học thất bại");
                  }
                }}
              />
            </details>
          ))
        )}
      </div>

      <Dialog open={sessionDialogOpen} onOpenChange={setSessionDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Thêm lịch học</DialogTitle>
            <DialogDescription>{activeClass ? `Tạo buổi học cho lớp ${activeClass.name}.` : "Tạo buổi học cho lớp."}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5 md:col-span-2">
              <FieldLabel>Tên buổi học</FieldLabel>
              <Input value={sessionForm.title} onChange={(event) => setSessionForm((prev) => ({ ...prev, title: event.target.value }))} placeholder="VD: Buổi 1 - Placement review" />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <FieldLabel>Mô tả</FieldLabel>
              <Textarea rows={3} value={sessionForm.description} onChange={(event) => setSessionForm((prev) => ({ ...prev, description: event.target.value }))} />
            </div>
            <Field label="Ngày học">
              <DashboardDateInput value={sessionForm.session_date} onChange={(session_date) => setSessionForm((prev) => ({ ...prev, session_date }))} />
            </Field>
            <Field label="Hình thức buổi học">
              <Select value={sessionForm.mode} onValueChange={(value) => setSessionForm((prev) => ({ ...prev, mode: value }))}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Giờ bắt đầu">
              <Input type="time" value={sessionForm.start_time} onChange={(event) => setSessionForm((prev) => ({ ...prev, start_time: event.target.value }))} />
            </Field>
            <Field label="Giờ kết thúc">
              <Input type="time" value={sessionForm.end_time} onChange={(event) => setSessionForm((prev) => ({ ...prev, end_time: event.target.value }))} />
            </Field>
            <div className="space-y-1.5 md:col-span-2">
              <FieldLabel>Link học online</FieldLabel>
              <Input value={sessionForm.meeting_url} onChange={(event) => setSessionForm((prev) => ({ ...prev, meeting_url: event.target.value }))} placeholder="https://..." />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <FieldLabel>Ghi chú</FieldLabel>
              <Textarea rows={3} value={sessionForm.note} onChange={(event) => setSessionForm((prev) => ({ ...prev, note: event.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setSessionDialogOpen(false)}>Hủy</Button>
            <Button type="button" onClick={() => void handleCreateSession()}>Lưu lịch học</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const ClassSessionsList = ({ classId, sessions, onDeleted }: { classId: string; sessions: ClassSession[]; onDeleted: (sessionId: string) => Promise<void> }) => {
  const sortedSessions = useMemo(() => [...sessions].sort((a, b) => `${a.session_date}${a.start_time}`.localeCompare(`${b.session_date}${b.start_time}`)), [sessions]);

  return (
    <div className="mt-4 border-t border-gray-100 pt-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-gray-900">Lịch học của lớp</p>
          <p className="text-xs text-gray-500">Mở từng buổi học để thêm tài liệu tham khảo.</p>
        </div>
        <Badge variant="outline">{sortedSessions.length} buổi</Badge>
      </div>

      {sortedSessions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 p-5 text-center text-sm text-gray-500">Lớp này chưa có lịch học.</div>
      ) : (
        <div className="space-y-3">
          {sortedSessions.map((session) => (
            <SessionDetailsItem key={session.id} classId={classId} session={session} onDeleted={onDeleted} />
          ))}
        </div>
      )}
    </div>
  );
};

const SessionDetailsItem = ({ classId, session, onDeleted }: { classId: string; session: ClassSession; onDeleted: (sessionId: string) => Promise<void> }) => {
  const [open, setOpen] = useState(false);

  return (
    <details className="group rounded-xl border border-gray-100 p-3" onToggle={(event) => setOpen(event.currentTarget.open)}>
      <summary className="flex cursor-pointer list-none flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium text-gray-900">{session.title}</p>
            <Badge className={session.status === "scheduled" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"}>{session.status}</Badge>
          </div>
          <p className="mt-1 text-sm text-gray-500">{formatDate(session.session_date)} · {session.start_time.slice(0, 5)} - {session.end_time.slice(0, 5)} · {session.mode}</p>
          {session.meeting_url ? <p className="mt-1 text-xs text-blue-600">{session.meeting_url}</p> : null}
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="destructive" size="sm" onClick={(event) => { event.preventDefault(); void onDeleted(session.id); }}>
            <Trash2 className="h-4 w-4" />
          </Button>
          <ChevronDown className="h-4 w-4 text-gray-400 transition-transform group-open:rotate-180" />
        </div>
      </summary>
      {open ? (
        <div className="mt-3 border-t border-gray-100 pt-3">
          <SessionMediaManager classId={classId} session={session} />
        </div>
      ) : null}
    </details>
  );
};

const SessionMediaManager = ({ classId, session }: { classId: string; session: ClassSession }) => {
  const { mediaBySessionId, listMedia, uploadMedia, deleteMedia } = useClassSessionMediaStore();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const items = mediaBySessionId[session.id] ?? [];

  useEffect(() => {
    if (!mediaBySessionId[session.id]) {
      void listMedia(session.id).catch(() => toast.error("Không thể tải tài liệu buổi học"));
    }
  }, [listMedia, mediaBySessionId, session.id]);

  const handleUpload = async () => {
    if (!file) {
      toast.error("Vui lòng chọn tài liệu");
      return;
    }

    try {
      await uploadMedia(session.id, {
        file,
        title: title.trim() || file.name,
        description: description.trim() || null,
        order_index: items.length,
      });
      setFile(null);
      setTitle("");
      setDescription("");
      toast.success("Thêm tài liệu tham khảo thành công");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Thêm tài liệu tham khảo thất bại");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900">Tài liệu tham khảo</p>
          <p className="text-xs text-gray-500">Lưu file cho buổi học này, lớp ID {classId}.</p>
        </div>
        <Badge variant="outline">{items.length} tài liệu</Badge>
      </div>

      <div className="grid gap-3 rounded-xl bg-gray-50 p-3 md:grid-cols-2">
        <Field label="Tên tài liệu">
          <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Mặc định dùng tên file" />
        </Field>
        <Field label="Chọn file">
          <label className="flex h-8 cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 hover:bg-gray-50">
            <Upload className="h-4 w-4" />
            <span className="truncate">{file ? file.name : "PDF, Word, PowerPoint, Excel, TXT"}</span>
            <input type="file" className="hidden" accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
          </label>
        </Field>
        <div className="space-y-1.5 md:col-span-2">
          <FieldLabel>Mô tả tài liệu</FieldLabel>
          <Textarea rows={2} value={description} onChange={(event) => setDescription(event.target.value)} />
        </div>
        <div className="md:col-span-2">
          <Button type="button" onClick={() => void handleUpload()}>
            <Upload className="h-4 w-4" />
            Upload tài liệu
          </Button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 p-4 text-sm text-gray-500">Chưa có tài liệu tham khảo.</div>
      ) : (
        <div className="grid gap-2 md:grid-cols-2">
          {items.map((item) => <MediaItem key={item.id} item={item} onDelete={() => deleteMedia(session.id, item.id)} />)}
        </div>
      )}
    </div>
  );
};

const MediaItem = ({ item, onDelete }: { item: ClassSessionMedia; onDelete: () => Promise<void> }) => (
  <div className="flex items-start justify-between gap-3 rounded-xl border border-gray-100 bg-white p-3">
    <div className="flex min-w-0 gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
        <FileText className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-gray-900">{item.title || item.media?.original_filename || "Tài liệu"}</p>
        <p className="mt-1 text-xs text-gray-500">{item.media?.original_filename || "File"} {formatFileSize(item.media?.size)}</p>
        {item.description ? <p className="mt-1 line-clamp-2 text-xs text-gray-400">{item.description}</p> : null}
        {item.media?.url ? (
          <a href={item.media.url} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline">
            <LinkIcon className="h-3 w-3" />
            Mở tài liệu
          </a>
        ) : null}
      </div>
    </div>
    <Button type="button" variant="destructive" size="sm" onClick={async () => {
      try {
        await onDelete();
        toast.success("Xóa tài liệu thành công");
      } catch {
        toast.error("Xóa tài liệu thất bại");
      }
    }}>
      Xóa
    </Button>
  </div>
);
