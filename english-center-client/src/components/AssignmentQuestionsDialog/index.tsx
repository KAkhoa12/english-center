import { useEffect, useState } from "react";
import { toast } from "sonner";

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
import type { Assignment } from "@/services/assignments/assignments.type";

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
const isChoiceQuestion = (type: string) => type === "single_choice" || type === "multiple_choice";

export default function AssignmentQuestionsDialog({ assignment, open, onOpenChange }: { assignment: Assignment | null; open: boolean; onOpenChange: (open: boolean) => void }) {
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
