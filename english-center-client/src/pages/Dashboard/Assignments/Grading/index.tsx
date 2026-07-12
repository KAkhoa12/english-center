import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { DashboardListPageHeader, SectionCard } from "@/components/Dashboard/Comon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { classesApi } from "@/services/classes/classes.api";
import { submissionAnswersApi } from "@/services/submissionAnswers/submissionAnswers.api";
import type { SubmissionAnswer } from "@/services/submissionAnswers/submissionAnswers.type";
import { useAssignmentsStore } from "@/services/assignments/assignments.store";
import { useAssignmentQuestionsStore } from "@/services/assignmentQuestions/assignmentQuestions.store";
import type { ClassStudentItem } from "@/services/classes/classes.type";

function getOptionText(optionId: string, questions: { id: string; options: { id: string; option_text: string }[] }[]): string {
  for (const q of questions) {
    const opt = q.options.find((o) => o.id === optionId);
    if (opt) return opt.option_text;
  }
  return optionId;
}

export default function DashboardAssignmentGradingPage() {
  const { assignmentId = "" } = useParams();
  const navigate = useNavigate();
  const { selectedAssignment, getAssignment, submissions, listSubmissions, gradeSubmission, updateGrade } = useAssignmentsStore();
  const { questionsByAssignmentId, listQuestions } = useAssignmentQuestionsStore();
  const [answersBySub, setAnswersBySub] = useState<Record<string, SubmissionAnswer[]>>({});
  const [scoreInputs, setScoreInputs] = useState<Record<string, string>>({});
  const [feedbackInputs, setFeedbackInputs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [classStudents, setClassStudents] = useState<ClassStudentItem[]>([]);
  const [subsLoaded, setSubsLoaded] = useState(false);

  useEffect(() => {
    if (!assignmentId) return;
    setLoading(true);
    Promise.all([
      getAssignment(assignmentId),
      listQuestions(assignmentId),
      listSubmissions(assignmentId),
    ]).then(() => setSubsLoaded(true))
      .catch((error) => toast.error(error instanceof Error ? error.message : "Tải dữ liệu thất bại"))
      .finally(() => setLoading(false));
  }, [assignmentId, getAssignment, listQuestions, listSubmissions]);

  useEffect(() => {
    if (!selectedAssignment?.class_id) return;
    classesApi.listClassStudents(selectedAssignment.class_id).then((res) => {
      if (res.success) setClassStudents(res.payload);
    }).catch(() => {});
  }, [selectedAssignment?.class_id]);

  useEffect(() => {
    if (!subsLoaded || submissions.length === 0) return;
    let cancelled = false;
    (async () => {
      const result: Record<string, SubmissionAnswer[]> = {};
      for (const sub of submissions) {
        try {
          const res = await submissionAnswersApi.listAnswers(sub.id);
          if (res.success) result[sub.id] = res.payload;
        } catch { /* skip */ }
      }
      if (!cancelled) setAnswersBySub(result);
    })();
    return () => { cancelled = true; };
  }, [subsLoaded, submissions]);

  const handleGradeSave = useCallback(async (submissionId: string) => {
    const submission = submissions.find((s) => s.id === submissionId);
    if (!submission) return;
    const score = scoreInputs[submissionId] !== undefined && scoreInputs[submissionId] !== "" ? Number(scoreInputs[submissionId]) : null;
    const feedback = feedbackInputs[submissionId] ?? "";
    setSaving((prev) => ({ ...prev, [submissionId]: true }));
    try {
      if (submission.grade?.id) {
        await updateGrade(submission.grade.id, { score, feedback: feedback || null });
        toast.success("Đã cập nhật điểm");
      } else {
        await gradeSubmission(submissionId, { score, feedback: feedback || null });
        toast.success("Đã chấm điểm");
      }
      const updatedSubs = await listSubmissions(assignmentId);
      const newAnswers: Record<string, SubmissionAnswer[]> = {};
      for (const sub of updatedSubs) {
        try {
          const res = await submissionAnswersApi.listAnswers(sub.id);
          if (res.success) newAnswers[sub.id] = res.payload;
        } catch { /* skip */ }
      }
      setAnswersBySub(newAnswers);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Lưu điểm thất bại");
    } finally {
      setSaving((prev) => ({ ...prev, [submissionId]: false }));
    }
  }, [submissions, scoreInputs, feedbackInputs, gradeSubmission, updateGrade, listSubmissions, assignmentId]);

  if (loading) return <section><DashboardListPageHeader title="Chấm điểm" description="Đang tải..." /></section>;
  if (!selectedAssignment) return <section><DashboardListPageHeader title="Chấm điểm" description="Không tìm thấy bài tập" /></section>;

  const assignment = selectedAssignment;
  const questions = questionsByAssignmentId[assignmentId] ?? [];

  return (
    <section>
      <DashboardListPageHeader
        title={`Chấm điểm: ${assignment.title}`}
        description={`Điểm tối đa: ${assignment.max_score} · ${assignment.class?.name ?? ""}`}
        actions={<Button type="button" variant="outline" onClick={() => navigate(-1)}>Quay lại</Button>}
      />

      {classStudents.length > 0 ? (
        <SectionCard title="Học viên trong lớp">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-2 pr-4">Học viên</th>
                  <th className="pb-2 pr-4">Trạng thái</th>
                  <th className="pb-2 pr-4">Điểm</th>
                  <th className="pb-2">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {classStudents.map((cs) => {
                  const sub = submissions.find((s) => s.student_id === cs.student_id);
                  return (
                    <tr key={cs.student_id} className="border-b last:border-0">
                      <td className="py-2 pr-4 font-medium text-gray-900">{cs.student.name}</td>
                      <td className="py-2 pr-4">
                        {sub ? (
                          <Badge variant={sub.status === "late" ? "destructive" : "default"}>
                            {sub.status === "late" ? "Nộp muộn" : "Đã nộp"}
                          </Badge>
                        ) : (
                          <Badge variant="outline">Chưa nộp</Badge>
                        )}
                      </td>
                      <td className="py-2 pr-4">{sub?.grade ? `${sub.grade.score}/${sub.grade.max_score}` : "-"}</td>
                      <td className="py-2">
                        {sub ? (
                          <a href={`#submission-${sub.id}`} className="text-brand-600 underline text-xs">Chấm điểm</a>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SectionCard>
      ) : null}

      {submissions.length === 0 ? (
        <SectionCard title="Bài nộp">
          <p className="text-sm text-gray-500">Chưa có học viên nào nộp bài.</p>
        </SectionCard>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => {
            const subAnswers = answersBySub[submission.id] ?? [];
            const hasGrade = !!submission.grade;
            const isSaving = saving[submission.id] ?? false;

            return (
              <SectionCard key={submission.id} title={submission.student.name} id={`submission-${submission.id}`}>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge variant={submission.status === "late" ? "destructive" : "default"}>
                    {submission.status === "late" ? "Nộp muộn" : submission.status === "submitted" ? "Đã nộp" : submission.status}
                  </Badge>
                  {submission.submitted_at ? (
                    <span className="text-xs text-gray-400">{new Date(submission.submitted_at).toLocaleString("vi-VN")}</span>
                  ) : null}
                </div>

                {submission.content ? (
                  <div className="mb-3 whitespace-pre-wrap rounded-xl bg-white p-3 text-sm text-gray-700">
                    <p className="mb-1 text-xs font-semibold text-gray-500">Nội dung bài nộp:</p>
                    {submission.content}
                  </div>
                ) : null}

                {questions.map((q) => {
                  const answer = subAnswers.find((a) => a.question_id === q.id);
                  const selectedText = answer?.selected_option_ids
                    ?.map((optId) => getOptionText(optId, questions))
                    .filter(Boolean)
                    .join(", ");
                  return (
                    <div key={q.id} className="mb-2 rounded-xl border border-gray-100 bg-white p-3">
                      <p className="mb-1 text-sm font-medium text-gray-900">
                        {q.question_text}
                        <span className="ml-2 text-xs text-gray-400">({q.score} điểm)</span>
                      </p>
                      {q.question_type === "text_answer" ? (
                        <p className="whitespace-pre-wrap text-sm text-gray-600">
                          {answer?.answer_text ?? <span className="italic text-gray-400">Chưa trả lời</span>}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-600">
                          {selectedText ?? <span className="italic text-gray-400">Chưa chọn</span>}
                        </p>
                      )}
                      {answer?.score !== null && answer?.score !== undefined ? (
                        <p className="mt-1 text-xs text-gray-500">Điểm: {answer.score}</p>
                      ) : null}
                    </div>
                  );
                })}

                <div className="mt-3 space-y-3 rounded-xl border border-brand-100 bg-brand-50 p-4">
                  <p className="text-sm font-semibold text-brand-800">Chấm điểm</p>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={0}
                      max={assignment.max_score}
                      placeholder="Điểm"
                      className="w-24"
                      value={scoreInputs[submission.id] ?? submission.grade?.score ?? ""}
                      onChange={(e) => setScoreInputs((prev) => ({ ...prev, [submission.id]: e.target.value }))}
                    />
                    <span className="text-sm text-gray-500">/ {assignment.max_score}</span>
                  </div>
                  <Textarea
                    placeholder="Nhận xét (tuỳ chọn)"
                    rows={3}
                    value={feedbackInputs[submission.id] ?? submission.grade?.feedback ?? ""}
                    onChange={(e) => setFeedbackInputs((prev) => ({ ...prev, [submission.id]: e.target.value }))}
                  />
                  <Button type="button" size="sm" disabled={isSaving} onClick={() => void handleGradeSave(submission.id)}>
                    {isSaving ? "Đang lưu..." : hasGrade ? "Cập nhật điểm" : "Lưu điểm"}
                  </Button>
                </div>
              </SectionCard>
            );
          })}
        </div>
      )}
    </section>
  );
}
