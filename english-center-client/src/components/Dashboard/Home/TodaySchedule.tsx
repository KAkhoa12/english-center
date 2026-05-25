import { CheckCircle2, Clock, Video } from "lucide-react";
import { SectionCard } from "@/components/Dashboard/Comon";

const schedules = [
  {
    time: "18:30",
    title: "IELTS Speaking - Part 2",
    teacher: "Sarah Johnson",
    status: "Sắp diễn ra",
    active: true,
  },
  {
    time: "20:00",
    title: "Chấm chữa Writing Task 1",
    teacher: "David Lee",
    status: "Online",
    active: false,
  },
  {
    time: "21:15",
    title: "Vocabulary Review",
    teacher: "AI Practice Room",
    status: "Tự học",
    active: false,
  },
];

export const TodaySchedule = () => {
  return (
    <SectionCard
      title="Lịch học hôm nay"
      action={
        <a href="#" className="text-sm font-semibold text-brand-600">
          Xem tất cả
        </a>
      }
    >
      <div className="space-y-4">
        {schedules.map((item) => (
          <div
            key={item.title}
            className={`flex items-center gap-4 rounded-2xl border p-4 ${
              item.active
                ? "border-brand-100 bg-brand-50"
                : "border-gray-100 bg-gray-50"
            }`}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-sm">
              {item.active ? (
                <Video className="h-5 w-5" />
              ) : (
                <Clock className="h-5 w-5" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-gray-950">
                  {item.time}
                </span>
                <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-500">
                  {item.status}
                </span>
              </div>
              <h3 className="mt-1 truncate font-semibold text-gray-900">
                {item.title}
              </h3>
              <p className="text-sm text-gray-400">{item.teacher}</p>
            </div>
            {item.active ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-accent-500" />
            ) : null}
          </div>
        ))}
      </div>
    </SectionCard>
  );
};
