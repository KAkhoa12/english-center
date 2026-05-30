import { useEffect } from "react";

import { DashboardListPageHeader, SectionCard } from "@/components/Dashboard/Comon";
import { useAssignmentsStore } from "@/services/assignments/assignments.store";

export default function DashboardResultsPage() {
  const { submissions, isLoading, mySubmissions } = useAssignmentsStore();

  useEffect(() => {
    void mySubmissions({ page: 1, page_size: 20 });
  }, [mySubmissions]);

  return (
    <section>
      <DashboardListPageHeader
        title="Kết quả"
        description="Xem điểm và phản hồi từ các bài đã nộp"
      />
      <SectionCard title="Kết quả bài tập">
        {isLoading ? (
          <p className="text-sm text-gray-500">Đang tải kết quả...</p>
        ) : submissions.length === 0 ? (
          <p className="text-sm text-gray-500">Chưa có kết quả nào.</p>
        ) : (
          <div className="space-y-3">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="grid gap-2 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm sm:grid-cols-[1fr_auto]"
              >
                <div>
                  <p className="font-semibold text-gray-900">{submission.assignment.title}</p>
                  <p className="mt-1 text-gray-500">
                    {submission.grade?.feedback ?? "Chưa có phản hồi"}
                  </p>
                </div>
                <div className="font-semibold text-brand-600">
                  {submission.grade?.score ?? "-"} / {submission.assignment.max_score}
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </section>
  );
}
