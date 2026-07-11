import { FileText } from "lucide-react";
import { SectionCard } from "@/components/Dashboard/Comon";

const assignments = [
  ["Writing Task 2", "Hạn nộp: Hôm nay, 22:00", "Ưu tiên"],
  ["Listening Cambridge 17", "Hạn nộp: Thứ 5", "Đang làm"],
  ["Speaking Record #08", "Hạn nộp: Thứ 6", "Mới"],
];

export const AssignmentsPanel = () => {
  return (
    <SectionCard title="Bài tập cần xử lý">
      <div className="space-y-3">
        {assignments.map(([title, due, status]) => (
          <a
            key={title}
            href="#"
            className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 transition-colors hover:bg-gray-50"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold text-gray-950">
                {title}
              </h3>
              <p className="mt-1 text-xs text-gray-400">{due}</p>
            </div>
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500">
              {status}
            </span>
          </a>
        ))}
      </div>
    </SectionCard>
  );
};
