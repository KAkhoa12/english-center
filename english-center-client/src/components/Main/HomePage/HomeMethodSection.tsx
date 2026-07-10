import { ArrowRight, Sparkles } from "lucide-react";

export default function HomeMethodSection() {
  const progressBars = [
    ["Listening", "72%"],
    ["Speaking", "58%"],
    ["Reading", "81%"],
    ["Writing", "64%"],
  ];

  return (
    <section id="method" className="relative overflow-hidden bg-dark-teal py-24">
      <div className="absolute inset-0 bg-grid-pattern opacity-50" />
      <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-mint/10 blur-[70px]" />
      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="js-reveal translate-y-4 opacity-0 transition-[opacity,transform] duration-[600ms]">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-mint-soft">Học đúng thứ bạn cần</p>
            <h2 className="mb-5 text-section font-semibold leading-[1.1] tracking-[-0.02em] text-white">
              Không còn học lan man.
              <br />
              Mỗi ngày đều có mục tiêu rõ ràng.
            </h2>
            <p className="mb-8 text-[16px] leading-relaxed text-white/70">
              Dựa trên trình độ, mục tiêu và tiến độ thực tế, lộ trình học liên tục được điều chỉnh để bạn tập trung vào những kỹ năng cần cải thiện nhất.
            </p>
            <a href="#" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-white-soft">
              Xem cách lộ trình hoạt động
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="js-reveal translate-y-4 opacity-0 transition-[opacity,transform] duration-[600ms]">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <div className="mb-1 text-xs text-white/50">Trình độ hiện tại</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[28px] font-semibold text-white">B1</span>
                    <span className="text-sm text-white/60">Intermediate</span>
                  </div>
                </div>
                <div className="h-12 w-px bg-white/10" />
                <div className="text-right">
                  <div className="mb-1 text-xs text-white/50">Mục tiêu</div>
                  <div className="flex items-baseline justify-end gap-2">
                    <span className="text-[28px] font-semibold text-mint">6.5+</span>
                    <span className="text-sm text-white/60">IELTS</span>
                  </div>
                </div>
              </div>
              <div className="mb-6 space-y-4">
                {progressBars.map(([name, value]) => (
                  <div key={name}>
                    <div className="mb-1.5 flex justify-between text-[13px]">
                      <span className="text-white/80">{name}</span>
                      <span className="font-medium text-white">{value}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div className="js-progress h-full w-0 rounded-full bg-linear-to-r from-mint to-mint-soft transition-[width] duration-[1400ms] ease-[cubic-bezier(0.4,0,0.2,1)]" data-w={value} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-mint/30 bg-mint/10 p-4">
                <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-mint-soft">
                  <Sparkles className="h-3 w-3" /> Ưu tiên tuần này
                </div>
                <div className="mb-1 text-[15px] font-semibold text-white">Speaking Fluency</div>
                <p className="text-[13px] leading-relaxed text-white/70">Bạn cần thêm 45 phút luyện nói để đạt mục tiêu tuần.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
