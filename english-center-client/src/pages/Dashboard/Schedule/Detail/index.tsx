import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FileText, Plus } from "lucide-react";
import { toast } from "sonner";

import { DashboardListPageHeader, SectionCard } from "@/components/Dashboard/Comon";
import { labelOf, sessionModeOptions, sessionStatusOptions } from "@/components/Dashboard/Classes/classOptions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAssignmentsStore } from "@/services/assignments/assignments.store";
import { useAssignmentTypesStore } from "@/services/assignmentTypes/assignmentTypes.store";
import { useAuthStore } from "@/services/auth/auth.store";
import { useClassSessionsStore } from "@/services/classSessions/classSessions.store";
import type { AssignmentCreateRequest } from "@/services/assignments/assignments.type";
import type { SessionAssignment } from "@/services/classSessions/classSessions.type";
import { hasRole } from "@/shared/auth/rbac";
import { PRIVATE_ROUTES } from "@/shared/routes";

const formatDate = (value: string) => new Date(value).toLocaleDateString("vi-VN");
const formatTime = (value?: string | null) => value?.slice(0, 5) || "--:--";
const formatDueDate = (value: string | null) => value ? new Date(value).toLocaleString("vi-VN") : "Không giới hạn";

function AssignmentDetailDialog({ assignment, open, onOpenChange }: { assignment: SessionAssignment | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  if (!assignment) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{assignment.title}</DialogTitle>
          <DialogDescription>{assignment.description || "Không có mô tả"}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2 text-sm md:grid-cols-3">
            <div className="rounded-xl bg-gray-50 px-3 py-2"><span className="font-medium">Loại: </span>{assignment.assignment_type?.name ?? "-"}</div>
            <div className="rounded-xl bg-gray-50 px-3 py-2"><span className="font-medium">Điểm: </span>{assignment.max_score}</div>
            <div className="rounded-xl bg-gray-50 px-3 py-2"><span className="font-medium">Hạn: </span>{formatDueDate(assignment.due_at)}</div>
          </div>
          <div className="grid gap-2 text-sm md:grid-cols-2">
            {assignment.duration_time && <div className="rounded-xl bg-gray-50 px-3 py-2"><span className="font-medium">Thời gian làm: </span>{assignment.duration_time} phút</div>}
            <div className="rounded-xl bg-gray-50 px-3 py-2"><span className="font-medium">Số lần nộp: </span>{assignment.total_attempt}</div>
          </div>
          {assignment.instruction && (
            <div>
              <p className="mb-1 text-sm font-medium">Hướng dẫn</p>
              <p className="rounded-xl bg-gray-50 px-3 py-2 text-sm text-gray-700">{assignment.instruction}</p>
            </div>
          )}
          {assignment.attachments.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium">Tệp đính kèm ({assignment.attachments.length})</p>
              <div className="space-y-2">
                {assignment.attachments.map((att) => (
                  <div key={att.id} className="flex items-center justify-between gap-2 rounded-xl bg-gray-50 px-3 py-2 text-sm">
                    <span>{att.title}</span>
                    {att.presigned_url ? <a href={att.presigned_url} target="_blank" rel="noopener noreferrer" className="text-brand-600 underline">Tải xuống</a> : null}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
    <div className="mt-1 text-sm font-semibold text-gray-900">{value ?? "-"}</div>
  </div>
);

const emptyForm: AssignmentCreateRequest = {
  title: "",
  description: "",
  instruction: "",
  assignment_type_id: "",
  status: "draft",
  max_score: 10,
  duration_time: null,
  total_attempt: 1,
  due_at: null,
  allow_late_submission: true,
};

export default function DashboardScheduleDetailPage() {
  const { sessionId = "" } = useParams();
  const navigate = useNavigate();
  const me = useAuthStore((state) => state.me);
  const { selectedSession, isLoading, getMySessionDetail, getSession, clearSelectedSession } = useClassSessionsStore();
  const { createSessionAssignment } = useAssignmentsStore();
  const { assignmentTypes, listAssignmentTypes } = useAssignmentTypesStore();
  const session = selectedSession;
  const isTeacher = hasRole(me, "teacher") || hasRole(me, "admin") || hasRole(me, "staff");
  const [detailAssignment, setDetailAssignment] = useState<SessionAssignment | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<AssignmentCreateRequest>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!sessionId) return;
    (isTeacher ? getSession(sessionId) : getMySessionDetail(sessionId)).catch((error) =>
      toast.error(error instanceof Error ? error.message : "Không thể tải buổi học")
    );
    return () => clearSelectedSession();
  }, [clearSelectedSession, getMySessionDetail, getSession, isTeacher, sessionId]);

  useEffect(() => {
    if (!isTeacher) return;
    listAssignmentTypes({ page: 1, page_size: 100, status: "active" }).catch(() => {});
  }, [isTeacher, listAssignmentTypes]);

  useEffect(() => {
    if (!form.assignment_type_id && assignmentTypes[0]) {
      setForm((current) => ({ ...current, assignment_type_id: assignmentTypes[0].id }));
    }
  }, [assignmentTypes, form.assignment_type_id]);

  const resetForm = () => setForm({ ...emptyForm, assignment_type_id: assignmentTypes[0]?.id ?? "" });

  const handleCreateAssignment = async () => {
    if (!sessionId || !form.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề bài tập");
      return;
    }
    if (!form.assignment_type_id) {
      toast.error("Vui lòng chọn loại bài tập");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        title: form.title.trim(),
        description: form.description?.trim() || null,
        instruction: form.instruction?.trim() || null,
      };
      await createSessionAssignment(sessionId, payload);
      toast.success("Đã tạo bài tập cho buổi học");
      setCreateOpen(false);
      resetForm();
      await getSession(sessionId);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Tạo bài tập thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const statusBadge = useMemo(() => {
    if (!session) return null;
    const map: Record<string, string> = {
      scheduled: "border-sky-100 bg-sky-50 text-sky-700",
      completed: "border-emerald-100 bg-emerald-50 text-emerald-700",
      cancelled: "border-rose-100 bg-rose-50 text-rose-700",
    };
    return (
      <Badge variant="outline" className={map[session.status] ?? ""}>
        {labelOf(sessionStatusOptions, session.status)}
      </Badge>
    );
  }, [session]);

  if (!session) {
    return (
      <section>
        <DashboardListPageHeader title="Chi tiết buổi học" description="Đang tải dữ liệu..." />
      </section>
    );
  }

  return (
    <section>
      <DashboardListPageHeader
        title={session.title}
        description={`${session.class?.name ?? "Lớp học"} · ${formatDate(session.session_date)} · ${formatTime(session.start_time)} - ${formatTime(session.end_time)}`}
        actions={
          <Button type="button" variant="outline" onClick={() => navigate(PRIVATE_ROUTES.DASHBOARD_SCHEDULE)}>
            Quay lại
          </Button>
        }
      />

      {/* Info section */}
      <SectionCard title="Thông tin buổi học">
        {isLoading ? (
          <p className="text-sm text-gray-500">Đang tải...</p>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <InfoRow label="Trạng thái" value={statusBadge} />
              <InfoRow label="Hình thức" value={labelOf(sessionModeOptions, session.mode)} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <InfoRow label="Lớp học" value={session.class?.name} />
              <InfoRow label="Khóa học" value={session.course?.name} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <InfoRow label="Ngày học" value={formatDate(session.session_date)} />
              <InfoRow label="Thời gian" value={`${formatTime(session.start_time)} - ${formatTime(session.end_time)}`} />
            </div>
            {session.room && (
              <InfoRow label="Phòng học" value={session.room.name} />
            )}
            {session.meeting_url && (
              <InfoRow
                label="Link học online"
                value={
                  <a href={session.meeting_url} target="_blank" rel="noopener noreferrer" className="text-brand-600 underline">
                    {session.meeting_url}
                  </a>
                }
              />
            )}
            {session.description && <InfoRow label="Mô tả" value={session.description} />}
            {session.note && <InfoRow label="Ghi chú" value={session.note} />}
          </div>
        )}
      </SectionCard>

      {/* Teachers */}
      {session.teachers && session.teachers.length > 0 && (
        <SectionCard title="Giáo viên">
          <div className="space-y-3">
            {session.teachers.map((teacher) => (
              <div key={teacher.id} className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                <p className="font-semibold text-gray-900">{teacher.full_name}</p>
                <p className="text-sm text-gray-500">{teacher.email}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Reference materials */}
      <SectionCard title="Tài liệu tham khảo">
        {!session.media || session.media.length === 0 ? (
          <p className="text-sm text-gray-500">Chưa có tài liệu tham khảo cho buổi học này.</p>
        ) : (
          <div className="space-y-3">
            {session.media.map((item) => (
              <div key={item.id} className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-start gap-3">
                  <FileText className="mt-0.5 h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-semibold text-gray-900">{item.title || item.media?.original_filename || "Tài liệu"}</p>
                    {item.description && <p className="mt-1 text-sm text-gray-500">{item.description}</p>}
                  </div>
                </div>
                {item.media?.url && (
                  <Button type="button" variant="outline" onClick={() => window.open(item.media!.url, "_blank")}>
                    Mở tài liệu
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Assignments */}
      <SectionCard title="Bài tập">
        {isTeacher && (
          <div className="mb-4 flex justify-end">
            <Button type="button" onClick={() => setCreateOpen(true)}>
              <Plus className="mr-1 h-4 w-4" /> Thêm bài tập
            </Button>
          </div>
        )}
        {!session.assignments || session.assignments.length === 0 ? (
          <p className="text-sm text-gray-500">Chưa có bài tập nào cho buổi học này.</p>
        ) : (
          <div className="space-y-3">
            {session.assignments.map((assignment) => (
              <div key={assignment.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">{assignment.title}</p>
                    <p className="mt-1 text-sm text-gray-500">{assignment.description || assignment.instruction || "Không có mô tả"}</p>
                  </div>
                  <Button type="button" variant="outline" onClick={() => { setDetailAssignment(assignment); setDetailOpen(true); }}>
                    Xem chi tiết
                  </Button>
                </div>
                <div className="mt-3 grid gap-2 text-sm text-gray-500 md:grid-cols-3">
                  <span>Loại: {assignment.assignment_type?.name ?? "-"}</span>
                  <span>Điểm tối đa: {assignment.max_score}</span>
                  <span>Hạn nộp: {formatDueDate(assignment.due_at)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <AssignmentDetailDialog assignment={detailAssignment} open={detailOpen} onOpenChange={setDetailOpen} />

      {/* Create Assignment Dialog (teacher only) */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Tạo bài tập cho buổi học</DialogTitle>
            <DialogDescription>Điền thông tin bài tập mới</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <label className="space-y-2 text-sm font-medium text-gray-700">Tiêu đề<Input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} /></label>
            <label className="space-y-2 text-sm font-medium text-gray-700">Loại bài tập<Select value={form.assignment_type_id || undefined} onValueChange={(assignment_type_id) => setForm((current) => ({ ...current, assignment_type_id }))}><SelectTrigger><SelectValue placeholder="Chọn loại" /></SelectTrigger><SelectContent>{assignmentTypes.map((type) => <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>)}</SelectContent></Select></label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-gray-700">Điểm tối đa<Input type="number" min={1} value={form.max_score ?? 10} onChange={(event) => setForm((current) => ({ ...current, max_score: Number(event.target.value || 10) }))} /></label>
              <label className="space-y-2 text-sm font-medium text-gray-700">Thời gian (phút)<Input type="number" min={0} value={form.duration_time ?? ""} onChange={(event) => setForm((current) => ({ ...current, duration_time: event.target.value ? Number(event.target.value) : null }))} /></label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-gray-700">Số lần nộp<Input type="number" min={1} value={form.total_attempt ?? 1} onChange={(event) => setForm((current) => ({ ...current, total_attempt: Number(event.target.value || 1) }))} /></label>
              <label className="space-y-2 text-sm font-medium text-gray-700">Hạn nộp<Input type="datetime-local" value={form.due_at ? form.due_at.slice(0, 16) : ""} onChange={(event) => setForm((current) => ({ ...current, due_at: event.target.value ? new Date(event.target.value).toISOString() : null }))} /></label>
            </div>
            <label className="space-y-2 text-sm font-medium text-gray-700">Mô tả<Textarea value={form.description ?? ""} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} /></label>
            <label className="space-y-2 text-sm font-medium text-gray-700">Hướng dẫn<Textarea value={form.instruction ?? ""} onChange={(event) => setForm((current) => ({ ...current, instruction: event.target.value }))} /></label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => { setCreateOpen(false); resetForm(); }}>Hủy</Button>
            <Button type="button" disabled={submitting} onClick={() => void handleCreateAssignment()}>Tạo bài tập</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
