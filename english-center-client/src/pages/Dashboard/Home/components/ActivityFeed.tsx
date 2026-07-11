import { MessageCircle, Star, Trophy } from "lucide-react";
import { SectionCard } from "@/components/Dashboard/Comon";

const activities = [
  {
    title: "Sarah đã nhận xét bài Speaking của bạn",
    time: "15 phút trước",
    Icon: MessageCircle,
  },
  {
    title: "Bạn đạt 92/100 điểm Listening Practice",
    time: "2 giờ trước",
    Icon: Trophy,
  },
  {
    title: "Chuỗi học tập đã đạt 14 ngày",
    time: "Hôm qua",
    Icon: Star,
  },
];

export const ActivityFeed = () => {
  return (
    <SectionCard title="Hoạt động gần đây">
      <div className="space-y-4">
        {activities.map(({ title, time, Icon }) => (
          <div key={title} className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-relaxed text-gray-900">
                {title}
              </p>
              <p className="mt-1 text-xs text-gray-400">{time}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
};
