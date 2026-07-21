import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { DashboardListPageHeader, SectionCard } from "@/components/Dashboard/Comon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import AssignmentQuestionsDialog from "@/components/AssignmentQuestionsDialog";
import { useAssignmentQuestionsStore } from "@/services/assignmentQuestions/assignmentQuestions.store";
import { useAssignmentTypesStore } from "@/services/assignmentTypes/assignmentTypes.store";
import { useAuthStore } from "@/services/auth/auth.store";
import { useAssignmentsStore } from "@/services/assignments/assignments.store";
import type { Assignment, AssignmentCreateRequest } from "@/services/assignments/assignments.type";
import { hasRole } from "@/shared/auth/rbac";
import { PRIVATE_ROUTES } from "@/shared/routes";

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

const formatDueDate = (value: string | null) => value ? new Date(value).toLocaleString("vi-VN") : "Không giới hạn";
const toDatetimeLocal = (value: string | null) => value ? value.slice(0, 16) : "";
const fromDatetimeLocal = (value: string) => value ? new Date(value).toISOString() : null;

export default function DashboardAssignmentsPage() {
  const me = useAuthStore((state) => state.me);
  const navigate = useNavigate();
  const { assignments, availableAssignments, attachments, isLoading, myAssignments, listAvailableAssignments, createAvailableAssignment, updateAvailableAssignment, deleteAvailableAssignment, uploadAttachment, deleteAttachment } = useAssignmentsStore();
  const { questionsByAssignmentId, listQuestions: listAssignmentQuestions } = useAssignmentQuestionsStore();
  const { assignmentTypes, listAssignmentTypes } = useAssignmentTypesStore();
  const [form, setForm] = useState<AssignmentCreateRequest>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [questionAssignment, setQuestionAssignment] = useState<Assignment | null>(null);
  const [questionsOpen, setQuestionsOpen] = useState(false);
  const isStudent = hasRole(me, "student");
  const firstTypeId = useMemo(() => assignmentTypes[0]?.id ?? "", [assignmentTypes]);

  useEffect(() => {
    if (isStudent) {
      void myAssignments({ page: 1, page_size: 20 });
      return;
    }
    void listAssignmentTypes({ page: 1, page_size: 100, status: "active" }).catch(() => toast.error("Không thể tải loại bài tập"));
    void listAvailableAssignments({ page: 1, page_size: 100 }).catch((error) => toast.error(error instanceof Error ? error.message : "Không thể tải bài tập có sẵn"));
  }, [isStudent, listAssignmentTypes, listAvailableAssignments, myAssignments]);

  useEffect(() => {
    if (!isStudent && !form.assignment_type_id && firstTypeId) setForm((current) => ({ ...current, assignment_type_id: firstTypeId }));
  }, [firstTypeId, form.assignment_type_id, isStudent]);

  useEffect(() => {
    if (isStudent || availableAssignments.length === 0) return;
    void Promise.allSettled(availableAssignments.map((assignment) => listAssignmentQuestions(assignment.id))).then((results) => {
      if (results.some((result) => result.status === "rejected")) toast.error("Không thể tải một số câu hỏi của bài tập");
    });
  }, [availableAssignments, isStudent, listAssignmentQuestions]);

  const patchForm = (patch: Partial<AssignmentCreateRequest>) => setForm((current) => ({ ...current, ...patch }));

  const resetForm = () => {
    setEditingId(null);
    setForm({ ...emptyForm, assignment_type_id: firstTypeId });
  };

  const handleEdit = (assignment: Assignment) => {
    setEditingId(assignment.id);
    setForm({
      title: assignment.title,
      description: assignment.description ?? "",
      instruction: assignment.instruction ?? "",
      assignment_type_id: assignment.assignment_type_id,
      status: assignment.status,
      max_score: assignment.max_score,
      duration_time: assignment.duration_time,
      total_attempt: assignment.total_attempt,
      due_at: assignment.due_at,
      allow_late_submission: assignment.allow_late_submission,
    });
  };

  const openQuestions = (assignment: Assignment) => {
    setQuestionAssignment(assignment);
    setQuestionsOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề bài tập");
      return;
    }
    if (!form.assignment_type_id) {
      toast.error("Vui lòng chọn loại bài tập");
      return;
    }
    const payload: AssignmentCreateRequest = {
      ...form,
      title: form.title.trim(),
      description: form.description?.trim() || null,
      instruction: form.instruction?.trim() || null,
    };
    try {
      if (editingId) {
        await updateAvailableAssignment(editingId, payload);
        toast.success("Đã cập nhật bài tập có sẵn");
      } else {
        await createAvailableAssignment(payload);
        toast.success("Đã tạo bài tập có sẵn");
      }
      resetForm();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Lưu bài tập có sẵn thất bại");
    }
  };

  const handleDelete = async (assignmentId: string) => {
    try {
      await deleteAvailableAssignment(assignmentId);
      toast.success("Đã xóa bài tập có sẵn");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Xóa bài tập có sẵn thất bại");
    }
  };

  return (
    <section>
      <DashboardListPageHeader title="Bài tập" description={isStudent ? "Theo dõi bài tập được giao và trạng thái nộp bài" : "Quản lý thư viện bài tập có sẵn để tái sử dụng cho lớp, buổi học và bài học"} />
      {isStudent ? (
        <SectionCard title="Bài tập của tôi">
          {isLoading ? <p className="text-sm text-gray-500">Đang tải bài tập...</p> : assignments.length === 0 ? <p className="text-sm text-gray-500">Chưa có bài tập nào.</p> : (
            <div className="space-y-3">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="cursor-pointer rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 transition hover:border-brand-200 hover:bg-brand-50/50" onClick={() => navigate(PRIVATE_ROUTES.DASHBOARD_ASSIGNMENTS_DETAIL.replace(":assignmentId", assignment.id))}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-900">{assignment.title}</p>
                      <p className="mt-1 text-sm text-gray-500">{assignment.class?.name ?? "Lớp học"} · Hạn nộp: {formatDueDate(assignment.due_at)}</p>
                    </div>
                    <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">{assignment.my_submission?.status === "submitted" ? "Đã nộp" : assignment.my_submission?.status === "graded" ? "Đã chấm" : assignment.my_submission?.status === "late" ? "Nộp muộn" : "Chưa nộp"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <SectionCard title={editingId ? "Cập nhật bài tập có sẵn" : "Tạo bài tập có sẵn"}>
            <div className="grid gap-4">
              <label className="space-y-2 text-sm font-medium text-gray-700">Tiêu đề<Input value={form.title} onChange={(event) => patchForm({ title: event.target.value })} /></label>
              <label className="space-y-2 text-sm font-medium text-gray-700">Loại bài tập<Select value={form.assignment_type_id || undefined} onValueChange={(assignment_type_id) => patchForm({ assignment_type_id })}><SelectTrigger><SelectValue placeholder="Chọn loại bài tập" /></SelectTrigger><SelectContent>{assignmentTypes.map((type) => <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>)}</SelectContent></Select></label>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-gray-700">Trạng thái<Select value={form.status} onValueChange={(status) => patchForm({ status })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="draft">Nháp</SelectItem><SelectItem value="published">Xuất bản</SelectItem><SelectItem value="closed">Đóng</SelectItem></SelectContent></Select></label>
                <label className="space-y-2 text-sm font-medium text-gray-700">Điểm tối đa<Input type="number" min={1} value={form.max_score ?? 10} onChange={(event) => patchForm({ max_score: Number(event.target.value || 10) })} /></label>
                <label className="space-y-2 text-sm font-medium text-gray-700">Thời gian làm (phút)<Input type="number" min={0} value={form.duration_time ?? ""} onChange={(event) => patchForm({ duration_time: event.target.value ? Number(event.target.value) : null })} /></label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-gray-700">Số lần nộp tối đa<Input type="number" min={1} value={form.total_attempt ?? 1} onChange={(event) => patchForm({ total_attempt: Number(event.target.value || 1) })} /></label>
                <label className="space-y-2 text-sm font-medium text-gray-700">Hạn nộp mẫu<Input type="datetime-local" value={toDatetimeLocal(form.due_at ?? null)} onChange={(event) => patchForm({ due_at: fromDatetimeLocal(event.target.value) })} /></label>
              </div>
              <label className="space-y-2 text-sm font-medium text-gray-700">Mô tả<Textarea value={form.description ?? ""} onChange={(event) => patchForm({ description: event.target.value })} /></label>
              <label className="space-y-2 text-sm font-medium text-gray-700">Hướng dẫn<Textarea value={form.instruction ?? ""} onChange={(event) => patchForm({ instruction: event.target.value })} /></label>
              <div className="flex justify-end gap-2">
                {editingId ? <Button type="button" variant="outline" onClick={resetForm}>Hủy</Button> : null}
                <Button type="button" disabled={isLoading} onClick={() => void handleSubmit()}>{editingId ? "Lưu thay đổi" : "Tạo bài tập"}</Button>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Danh sách bài tập có sẵn">
            {availableAssignments.length === 0 ? <p className="text-sm text-gray-500">Chưa có bài tập có sẵn.</p> : (
              <div className="space-y-3">
                {availableAssignments.map((assignment) => {
                  const assignmentQuestions = questionsByAssignmentId[assignment.id] ?? [];
                  return (
                    <div key={assignment.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-gray-900">{assignment.title}</p>
                          <p className="mt-1 text-sm text-gray-500">{assignment.assignment_type?.name ?? "-"} · {assignment.status} · Điểm: {assignment.max_score}</p>
                          <p className="mt-1 text-sm text-gray-500">{assignment.description || assignment.instruction || "Không có mô tả"}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button type="button" variant="outline" onClick={() => openQuestions(assignment)}>Câu hỏi</Button>
                          <Button type="button" variant="outline" onClick={() => handleEdit(assignment)}>Sửa</Button>
                          <Button type="button" variant="destructive" onClick={() => void handleDelete(assignment.id)}>Xóa</Button>
                        </div>
                      </div>

                      <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-3">
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-gray-800">Câu hỏi trong bài tập ({assignmentQuestions.length})</p>
                          <Button type="button" variant="outline" size="sm" onClick={() => openQuestions(assignment)}>Quản lý câu hỏi</Button>
                        </div>
                        {assignmentQuestions.length ? (
                          <div className="space-y-2">
                            {assignmentQuestions.map((question, index) => (
                              <div key={question.id} className="rounded-xl bg-gray-50 px-3 py-2">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-sm font-semibold text-gray-900">{index + 1}. {question.question_text}</span>
                                  <Badge variant="outline">{question.question_type}</Badge>
                                  <Badge className="bg-brand-50 text-brand-700">{question.score} điểm</Badge>
                                </div>
                                {question.options?.length ? (
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {question.options.map((option) => (
                                      <span key={option.id} className={`rounded-full px-2 py-1 text-xs ${option.is_correct ? "bg-emerald-50 text-emerald-700" : "bg-white text-gray-500"}`}>{option.option_text}</span>
                                    ))}
                                  </div>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        ) : <p className="text-sm text-gray-500">Chưa có câu hỏi nào trong bài tập này.</p>}
                      </div>

                      <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-3">
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-gray-800">Tệp đính kèm</p>
                          <label className="cursor-pointer">
                            <span className="rounded-md bg-brand-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-700">Tải lên</span>
                            <input type="file" className="hidden" onChange={async (event) => {
                              const file = event.target.files?.[0];
                              if (!file) return;
                              const fd = new FormData();
                              fd.append("file", file);
                              fd.append("title", file.name);
                              try {
                                await uploadAttachment(assignment.id, fd);
                                toast.success("Đã tải lên tệp đính kèm");
                              } catch (error) {
                                toast.error(error instanceof Error ? error.message : "Tải lên thất bại");
                              }
                              event.target.value = "";
                            }} />
                          </label>
                        </div>
                        {attachments.length ? (
                          <div className="space-y-2">
                            {attachments.filter((att) => att.assignment_id === assignment.id).map((att) => (
                              <div key={att.id} className="flex items-center justify-between gap-2 rounded-xl bg-gray-50 px-3 py-2 text-sm">
                                <span className="text-gray-700">{att.title}</span>
                                <div className="flex items-center gap-2">
                                  {att.presigned_url ? <a href={att.presigned_url} target="_blank" rel="noopener noreferrer" className="text-brand-600 underline">Xem</a> : null}
                                  <button type="button" onClick={async () => { try { await deleteAttachment(att.id); toast.success("Đã xóa tệp"); } catch (error) { toast.error(error instanceof Error ? error.message : "Xóa thất bại"); } }} className="text-rose-600 hover:underline">Xóa</button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : <p className="text-sm text-gray-500">Chưa có tệp đính kèm.</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </SectionCard>
        </div>
      )}

      <AssignmentQuestionsDialog assignment={questionAssignment} open={questionsOpen} onOpenChange={setQuestionsOpen} />
    </section>
  );
}
