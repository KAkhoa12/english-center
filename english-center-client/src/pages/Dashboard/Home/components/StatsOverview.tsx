import { Award, BookOpen, Clock, Target } from "lucide-react";
import { StatCard } from "@/components/Dashboard/Comon";

const stats = [
  {
    title: "Giờ học tháng này",
    value: "38.5h",
    change: "+12.4% so với tháng trước",
    Icon: Clock,
    tone: "brand" as const,
  },
  {
    title: "Bài tập hoàn thành",
    value: "24/28",
    change: "Còn 4 bài cần nộp",
    Icon: BookOpen,
    tone: "accent" as const,
  },
  {
    title: "Điểm trung bình",
    value: "8.6",
    change: "+0.4 trong 30 ngày",
    Icon: Award,
    tone: "sun" as const,
  },
  {
    title: "Mục tiêu IELTS",
    value: "7.0",
    change: "Đang đúng tiến độ",
    Icon: Target,
    tone: "coral" as const,
  },
];

export const StatsOverview = () => {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </section>
  );
};
