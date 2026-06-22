import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { DashboardListPageHeader, SectionCard } from "@/components/Dashboard/Comon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAssignmentQuestionOptionsStore } from "@/services/assignmentQuestionOptions/assignmentQuestionOptions.store";
import type { AssignmentQuestionOption } from "@/services/assignmentQuestionOptions/assignmentQuestionOptions.type";
import { useAssignmentQuestionsStore } from "@/services/assignmentQuestions/assignmentQuestions.store";
import type { AssignmentQuestion } from "@/services/assignmentQuestions/assignmentQuestions.type";
import { useAssignmentTypesStore } from "@/services/assignmentTypes/assignmentTypes.store";
import { useAuthStore } from "@/services/auth/auth.store";
import { useAssignmentsStore } from "@/services/assignments/assignments.store";
import type { Assignment, AssignmentCreateRequest } from "@/services/assignments/assignments.type";
import { hasRole } from "@/shared/auth/rbac";

const emptyForm: AssignmentCreateRequest = {
  title: "",
  description: "",
  instruction: "",
  assignment_type_id: "",
  status: "draft",
  max_score: 10,
  due_at: null,
  allow_late_submission: true,
};

const questionTypes = [
  { value: "text_answer", label: "Tự luận" },
  { value: "single_choice", label: "Một đáp án" },
  { value: "multiple_choice", label: "Nhiều đáp án" },
  { value: "file_upload", label: "Nộp file" },
];

const emptyQuestionForm = { question_type: "text_answer", question_text: "", score: 0, order_index: 0, is_required: true };
const emptyOptionForm = { option_text: "", is_correct: false, order_index: 0 };

type QuestionForm = typeof emptyQuestionForm;
type OptionForm = typeof emptyOptionForm & { questionId: string | null; optionId: string | null };

const formatDueDate = (value: string | null) => value ? new Date(value).toLocaleString("vi-VN") : "Không giới hạn";
const toDatetimeLocal = (value: string | null) => value ? value.slice(0, 16) : "";
const fromDatetimeLocal = (value: string) => value ? new Date(value).toISOString() : null;
const isChoiceQuestion = (type: string) => type === "single_choice" || type === "multiple_choice";

function AssignmentQuestionsDialog({ assignment, open, onOpenChange }: { assignment: Assignment | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  const { questions, isLoading, listQuestions, createQuestion, updateQuestion, deleteQuestion } = useAssignmentQuestionsStore();
  const { createOption, updateOption, deleteOption } = useAssignmentQuestionOptionsStore();
  const [questionForm, setQuestionForm] = useState<QuestionForm>(emptyQuestionForm);
  const [editingQuestion, setEditingQuestion] = useState<AssignmentQuestion | null>(null);
  const [optionForm, setOptionForm] = useState<OptionForm>({ ...emptyOptionForm, questionId: null, optionId: null });

  useEffect(() => {
    if (!open || !assignment?.id) return;
    void listQuestions(assignment.id).catch((error) => toast.error(error instanceof Error ? error.message : "Không thể tải câu hỏi"));
  }, [assignment?.id, listQuestions, open]);

  const refreshQuestions = async () => {
    if (assignment?.id) await listQuestions(assignment.id);
  };

  const resetQuestionForm = () => {
    setEditingQuestion(null);
    setQuestionForm(emptyQuestionForm);
  };

  const startEditQuestion = (question: AssignmentQuestion) => {
    setEditingQuestion(question);
    setQuestionForm({
      question_type: question.question_type,
      question_text: question.question_text,
      score: question.score,
      order_index: question.order_index,
      is_required: question.is_required,
    });
  };

  const handleSaveQuestion = async () => {
    if (!assignment?.id) return;
    if (!questionForm.question_text.trim()) {
      toast.error("Vui lòng nhập nội dung câu hỏi");
      return;
    }
    try {
      const payload = { ...questionForm, question_text: questionForm.question_text.trim() };
      if (editingQuestion) {
        await updateQuestion(editingQuestion.id, payload);
        toast.success("Đã cập nhật câu hỏi");
      } else {
        await createQuestion(assignment.id, payload);
        toast.success("Đã tạo câu hỏi");
      }
      resetQuestionForm();
      await refreshQuestions();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Lưu câu hỏi thất bại");
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      await deleteQuestion(questionId);
      toast.success("Đã xóa câu hỏi");
      await refreshQuestions();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Xóa câu hỏi thất bại");
    }
  };

  const startOption = (questionId: string, option?: AssignmentQuestionOption) => {
    setOptionForm({
      questionId,
      optionId: option?.id ?? null,
      option_text: option?.option_text ?? "",
      is_correct: option?.is_correct ?? false,
      order_index: option?.order_index ?? 0,
    });
  };

  const resetOptionForm = () => setOptionForm({ ...emptyOptionForm, questionId: null, optionId: null });

  const handleSaveOption = async () => {
    if (!optionForm.questionId) return;
    if (!optionForm.option_text.trim()) {
      toast.error("Vui lòng nhập nội dung lựa chọn");
      return;
    }
    try {
      const payload = { option_text: optionForm.option_text.trim(), is_correct: optionForm.is_correct, order_index: optionForm.order_index };
      if (optionForm.optionId) {
        await updateOption(optionForm.optionId, payload);
        toast.success("Đã cập nhật lựa chọn");
      } else {
        await createOption(optionForm.questionId, payload);
        toast.success("Đã thêm lựa chọn");
      }
      resetOptionForm();
      await refreshQuestions();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Lưu lựa chọn thất bại");
    }
  };

  const handleDeleteOption = async (optionId: string) => {
    try {
      await deleteOption(optionId);
      toast.success("Đã xóa lựa chọn");
      await refreshQuestions();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Xóa lựa chọn thất bại");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Quản lý câu hỏi</DialogTitle>
          <DialogDescription>{assignment?.title ?? "Bài tập"}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <h3 className="font-semibold text-gray-950">{editingQuestion ? "Cập nhật câu hỏi" : "Thêm câu hỏi"}</h3>
            <div className="mt-4 grid gap-3">
              <label className="space-y-2 text-sm font-medium text-gray-700">Loại câu hỏi<Select value={questionForm.question_type} onValueChange={(question_type) => setQuestionForm((current) => ({ ...current, question_type }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{questionTypes.map((type) => <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>)}</SelectContent></Select></label>
              <label className="space-y-2 text-sm font-medium text-gray-700">Nội dung<Textarea value={questionForm.question_text} onChange={(event) => setQuestionForm((current) => ({ ...current, question_text: event.target.value }))} /></label>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-gray-700">Điểm<Input type="number" min={0} value={questionForm.score} onChange={(event) => setQuestionForm((current) => ({ ...current, score: Number(event.target.value || 0) }))} /></label>
                <label className="space-y-2 text-sm font-medium text-gray-700">Thứ tự<Input type="number" min={0} value={questionForm.order_index} onChange={(event) => setQuestionForm((current) => ({ ...current, order_index: Number(event.target.value || 0) }))} /></label>
              </div>
              <label className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-sm text-gray-700">Bắt buộc trả lời<input type="checkbox" checked={questionForm.is_required} onChange={(event) => setQuestionForm((current) => ({ ...current, is_required: event.target.checked }))} className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" /></label>
              <div className="flex justify-end gap-2">
                {editingQuestion ? <Button type="button" variant="outline" onClick={resetQuestionForm}>Hủy</Button> : null}
                <Button type="button" onClick={() => void handleSaveQuestion()}>{editingQuestion ? "Lưu câu hỏi" : "Thêm câu hỏi"}</Button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {isLoading ? <p className="text-sm text-gray-500">Đang tải câu hỏi...</p> : questions.length === 0 ? <p className="text-sm text-gray-500">Chưa có câu hỏi nào.</p> : questions.map((question) => (
              <div key={question.id} className="rounded-2xl border border-gray-100 bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{question.question_type}</Badge>
                      <Badge className="bg-brand-50 text-brand-700">{question.score} điểm</Badge>
                      {question.is_required ? <Badge className="bg-rose-50 text-rose-600">bắt buộc</Badge> : null}
                    </div>
                    <p className="mt-2 font-semibold text-gray-900">{question.question_text}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => startEditQuestion(question)}>Sửa</Button>
                    <Button type="button" variant="destructive" size="sm" onClick={() => void handleDeleteQuestion(question.id)}>Xóa</Button>
                  </div>
                </div>

                {isChoiceQuestion(question.question_type) ? (
                  <div className="mt-4 space-y-2 rounded-2xl bg-gray-50 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-gray-700">Lựa chọn đáp án</p>
                      <Button type="button" variant="outline" size="sm" onClick={() => startOption(question.id)}>Thêm lựa chọn</Button>
                    </div>
                    {question.options?.length ? question.options.map((option) => (
                      <div key={option.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white px-3 py-2 text-sm">
                        <span className="text-gray-700">{option.order_index}. {option.option_text}</span>
                        <div className="flex items-center gap-2">
                          {option.is_correct ? <Badge className="bg-emerald-50 text-emerald-600">đúng</Badge> : null}
                          <Button type="button" variant="outline" size="sm" onClick={() => startOption(question.id, option)}>Sửa</Button>
                          <Button type="button" variant="destructive" size="sm" onClick={() => void handleDeleteOption(option.id)}>Xóa</Button>
                        </div>
                      </div>
                    )) : <p className="text-sm text-gray-500">Chưa có lựa chọn.</p>}

                    {optionForm.questionId === question.id ? (
                      <div className="grid gap-2 rounded-xl border border-gray-100 bg-white p-3 md:grid-cols-[1fr_90px_auto_auto]">
                        <Input value={optionForm.option_text} onChange={(event) => setOptionForm((current) => ({ ...current, option_text: event.target.value }))} placeholder="Nội dung lựa chọn" />
                        <Input type="number" min={0} value={optionForm.order_index} onChange={(event) => setOptionForm((current) => ({ ...current, order_index: Number(event.target.value || 0) }))} />
                        <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={optionForm.is_correct} onChange={(event) => setOptionForm((current) => ({ ...current, is_correct: event.target.checked }))} />Đúng</label>
                        <div className="flex gap-2">
                          <Button type="button" size="sm" onClick={() => void handleSaveOption()}>{optionForm.optionId ? "Lưu" : "Thêm"}</Button>
                          <Button type="button" variant="outline" size="sm" onClick={resetOptionForm}>Hủy</Button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function DashboardAssignmentsPage() {
  const me = useAuthStore((state) => state.me);
  const { assignments, availableAssignments, isLoading, myAssignments, listAvailableAssignments, createAvailableAssignment, updateAvailableAssignment, deleteAvailableAssignment } = useAssignmentsStore();
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
                <div key={assignment.id} className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-900">{assignment.title}</p>
                      <p className="mt-1 text-sm text-gray-500">{assignment.class?.name ?? "Lớp học"} · Hạn nộp: {formatDueDate(assignment.due_at)}</p>
                    </div>
                    <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">{assignment.my_submission?.status ?? assignment.status}</span>
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
              </div>
              <label className="space-y-2 text-sm font-medium text-gray-700">Hạn nộp mẫu<Input type="datetime-local" value={toDatetimeLocal(form.due_at ?? null)} onChange={(event) => patchForm({ due_at: fromDatetimeLocal(event.target.value) })} /></label>
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
