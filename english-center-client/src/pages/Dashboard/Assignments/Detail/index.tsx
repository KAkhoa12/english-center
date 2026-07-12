import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { DashboardListPageHeader, SectionCard } from "@/components/Dashboard/Comon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAssignmentsStore } from "@/services/assignments/assignments.store";
import { useAssignmentQuestionsStore } from "@/services/assignmentQuestions/assignmentQuestions.store";
import { useSubmissionAnswersStore } from "@/services/submissionAnswers/submissionAnswers.store";
import { PRIVATE_ROUTES } from "@/shared/routes";

const formatDueDate = (value: string | null) => value ? new Date(value).toLocaleString("vi-VN") : "Không giới hạn";

export default function DashboardAssignmentDetailPage() {
  const { assignmentId = "" } = useParams();
  const navigate = useNavigate();
  const { selectedAssignment, getAssignment, submitAssignment } = useAssignmentsStore();
  const { questionsByAssignmentId, listQuestions } = useAssignmentQuestionsStore();
  const { createAnswer } = useSubmissionAnswersStore();
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!assignmentId) return;
    void getAssignment(assignmentId).catch((error) => toast.error(error instanceof Error ? error.message : "Không thể tải bài tập"));
    void listQuestions(assignmentId).catch((error) => toast.error(error instanceof Error ? error.message : "Không thể tải câu hỏi"));
  }, [assignmentId, getAssignment, listQuestions]);

  const assignment = selectedAssignment;
  const questions = questionsByAssignmentId[assignmentId] ?? [];
  const mySubmission = assignment?.my_submission;
  const isGraded = mySubmission?.status === "graded";
  const submissionCount = mySubmission ? 1 : 0;

  if (!assignment) return <section><DashboardListPageHeader title="Bài tập" description="Đang tải..." /></section>;

  const handleSubmit = async () => {
    if (!assignmentId) return;
    setSubmitting(true);
    try {
      const submission = await submitAssignment(assignmentId, { status: "submitted" });
      for (const question of questions) {
        const answer = answers[question.id];
        if (!answer || (Array.isArray(answer) && answer.length === 0)) continue;
        if (question.question_type === "single_choice") {
          await createAnswer(submission.id, { question_id: question.id, selected_option_ids: [answer as string] });
        } else if (question.question_type === "multiple_choice") {
          await createAnswer(submission.id, { question_id: question.id, selected_option_ids: answer as string[] });
        } else {
          await createAnswer(submission.id, { question_id: question.id, answer_text: answer as string });
        }
      }
      toast.success("Đã nộp bài");
      navigate(PRIVATE_ROUTES.DASHBOARD_ASSIGNMENTS);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Nộp bài thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section>
      <DashboardListPageHeader
        title={assignment.title}
        description={assignment.class?.name ?? "Lớp học"}
        actions={<Button type="button" variant="outline" onClick={() => navigate(PRIVATE_ROUTES.DASHBOARD_ASSIGNMENTS)}>Quay lại</Button>}
      />

      {assignment.description || assignment.instruction ? (
        <SectionCard title="Hướng dẫn">
          {assignment.description ? <p className="mb-2 text-sm text-gray-700">{assignment.description}</p> : null}
          {assignment.instruction ? <p className="text-sm italic text-gray-600">{assignment.instruction}</p> : null}
        </SectionCard>
      ) : null}

      <SectionCard title="Thông tin">
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <span>Điểm tối đa: <strong>{assignment.max_score}</strong></span>
          <span>Thời gian: <strong>{assignment.duration_time ? `${assignment.duration_time} phút` : "Không giới hạn"}</strong></span>
          <span>Hạn nộp: <strong>{formatDueDate(assignment.due_at)}</strong></span>
          <span>Số lần nộp: <strong>{submissionCount}/{assignment.total_attempt}</strong></span>
        </div>
      </SectionCard>

      {assignment.attachments?.length ? (
        <SectionCard title="Tệp đính kèm">
          <div className="space-y-2">
            {assignment.attachments.map((att) => {
              const url = (att as Record<string, unknown>).media ? ((att as Record<string, unknown>).media as Record<string, unknown>).url as string : att.presigned_url;
              return (
                <div key={att.id} className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2 text-sm">
                  <span>{att.title || att.original_filename || "Tệp"}</span>
                  {url ? <a href={url} target="_blank" rel="noopener noreferrer" className="text-brand-600 underline">Xem</a> : null}
                </div>
              );
            })}
          </div>
        </SectionCard>
      ) : null}

      {mySubmission?.grade ? (
        <SectionCard title="Kết quả">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm">
            <p className="text-lg font-bold text-emerald-800">Điểm: {mySubmission.grade.score} / {mySubmission.grade.max_score}</p>
            {mySubmission.grade.feedback ? <p className="mt-2 text-emerald-700">{mySubmission.grade.feedback}</p> : null}
          </div>
        </SectionCard>
      ) : null}

      {mySubmission && !isGraded ? (
        <SectionCard title="Bài đã nộp">
          <Badge>{mySubmission.status === "late" ? "Nộp muộn" : "Đã nộp"}</Badge>
          {mySubmission.content ? <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">{mySubmission.content}</p> : null}
        </SectionCard>
      ) : null}

      {questions.length > 0 ? (
        <SectionCard title="Câu hỏi">
          <div className="space-y-6">
            {questions.map((q) => (
              <div key={q.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <p className="font-semibold text-gray-900">{q.question_text}</p>
                  <Badge variant="outline">{q.score} điểm</Badge>
                </div>
                {q.question_type === "single_choice" ? (
                  <div className="space-y-2">
                    {q.options.map((opt) => (
                      <label key={opt.id} className="flex cursor-pointer items-center gap-3 rounded-xl bg-white px-3 py-2 text-sm hover:bg-brand-50">
                        <input type="radio" name={q.id} checked={(answers[q.id] as string) === opt.id} onChange={() => setAnswers((a) => ({ ...a, [q.id]: opt.id }))} />
                        {opt.option_text}
                      </label>
                    ))}
                  </div>
                ) : q.question_type === "multiple_choice" ? (
                  <div className="space-y-2">
                    {q.options.map((opt) => {
                      const selected = (answers[q.id] as string[]) ?? [];
                      return (
                        <label key={opt.id} className="flex cursor-pointer items-center gap-3 rounded-xl bg-white px-3 py-2 text-sm hover:bg-brand-50">
                          <input type="checkbox" checked={selected.includes(opt.id)} onChange={() => setAnswers((a) => {
                            const current = (a[q.id] as string[]) ?? [];
                            return { ...a, [q.id]: current.includes(opt.id) ? current.filter((id) => id !== opt.id) : [...current, opt.id] };
                          })} />
                          {opt.option_text}
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <Textarea value={(answers[q.id] as string) ?? ""} onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))} rows={4} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => navigate(PRIVATE_ROUTES.DASHBOARD_ASSIGNMENTS)}>Hủy</Button>
            <Button type="button" disabled={submitting} onClick={() => void handleSubmit()}>{submitting ? "Đang nộp..." : "Nộp bài"}</Button>
          </div>
        </SectionCard>
      ) : null}
    </section>
  );
}
