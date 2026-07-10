import { BookMarked, Check, Flag, Flame, Mic, TrendingUp } from "lucide-react";
import type { ElementType } from "react";

type Milestone = {
  week: string;
  level: string;
  completed: boolean;
};

export default function HomeResultsSection() {
  const milestones: Milestone[] = [
    { week: "Tuần 1", level: "A2", completed: true },
    { week: "Tuần 4", level: "A2+", completed: true },
    { week: "Tuần 8", level: "B1", completed: true },
    { week: "Tuần 16 · Hiện tại", level: "B1+", completed: false },
  ];

  const metrics: Array<[string, string, ElementType]> = [
    ["Speaking confidence", "+38%", TrendingUp],
    ["Từ vựng mới", "+850", BookMarked],
    ["Speaking practice", "42 giờ", Mic],
    ["Learning streak", "18 tuần", Flame],
  ];

  return (
    <section className="bg-surface py-24">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="mb-14 max-w-2xl js-reveal translate-y-4 opacity-0 transition-[opacity,transform] duration-[600ms]">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-muted">Kết quả học tập</p>
          <h2 className="text-section font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
            Tiến bộ không cần phải đoán.
            <br />
            Bạn có thể nhìn thấy nó.
          </h2>
        </div>
        <div className="js-reveal mb-6 translate-y-4 rounded-2xl border border-line bg-white p-8 opacity-0 transition-[opacity,transform] duration-[600ms] md:p-10">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <div className="mb-1 text-xs text-caption">Hành trình 18 tuần</div>
              <div className="text-[18px] font-semibold text-ink">Từ A2 đến B1+</div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted">
              <span className="h-2 w-2 rounded-full bg-mint" />
              Tiến bộ thực tế
            </div>
          </div>
          <div className="relative">
            <div className="absolute left-0 right-0 top-5 h-0.5 bg-line-soft" />
            <div className="absolute left-0 top-5 h-0.5 w-full bg-linear-to-r from-mint to-mint-deep" />
            <div className="relative grid grid-cols-4 gap-4">
              {milestones.map((milestone) => (
                <div key={milestone.week} className="text-center">
                  <div
                    className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                      milestone.completed ? "border-mint bg-white" : "border-mint bg-mint shadow-status-ring-lg"
                    }`}
                  >
                    {milestone.completed ? <Check className="h-4 w-4 text-mint-deep" /> : <Flag className="h-4 w-4 text-white" />}
                  </div>
                  <div className={`mt-3 text-[11px] ${milestone.completed ? "text-caption" : "font-medium text-mint-deep"}`}>{milestone.week}</div>
                  <div className="text-[16px] font-semibold text-ink">{milestone.level}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {metrics.map(([label, value, Icon]) => (
            <div key={label} className="js-reveal translate-y-4 rounded-card border border-line bg-white p-6 opacity-0 transition-[opacity,transform] duration-[600ms]">
              <div className="mb-3 flex items-center gap-2">
                <Icon className="h-4 w-4 text-mint-deep" />
                <span className="text-xs text-caption">{label}</span>
              </div>
              <div className="text-[32px] font-semibold leading-[1.05] tracking-[-0.025em] text-ink">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
