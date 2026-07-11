import { ArrowRight, CalendarDays } from "lucide-react";

export const DashboardHero = () => {
  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-gray-950 p-6 text-white shadow-xl shadow-gray-950/10 sm:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.55),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.35),transparent_30%)]" />
      <div className="relative z-10 grid gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-center">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white/80">
            <CalendarDays className="h-4 w-4 text-accent-400" />
            Lịch học hôm nay: 18:30 - IELTS Speaking
          </div>
          <h1 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Tiếp tục lộ trình IELTS band 7.0 của bạn
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">
            Bạn đã hoàn thành 72% chương trình. Hoàn tất bài luyện nói hôm nay
            để giữ chuỗi học tập 14 ngày liên tiếp.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-gray-950 transition-colors hover:bg-gray-100"
            >
              Vào lớp học
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/15"
            >
              Xem bài tập
            </a>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-white/60">Tiến độ mục tiêu</p>
              <div className="mt-2 text-4xl font-bold">72%</div>
            </div>
            <div className="text-right text-sm text-accent-300">+8% tuần này</div>
          </div>
          <div className="mt-6 h-3 rounded-full bg-white/10">
            <div className="h-full w-[72%] rounded-full bg-accent-400" />
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            {[
              ["42", "Buổi học"],
              ["18", "Bài tập"],
              ["7.0", "Mục tiêu"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl bg-white/10 p-3">
                <div className="font-bold">{value}</div>
                <div className="mt-1 text-xs text-white/50">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
