import {
  ArrowRight,
  Award,
  Bell,
  BookMarked,
  BookOpen,
  CirclePlay,
  Flame,
  Layers,
  LayoutDashboard,
  Mic,
  Play,
  Route,
  Settings,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import type { RefObject } from "react";

type HeroSectionProps = {
  heroMockupRef: RefObject<HTMLDivElement | null>;
};

export default function HeroSection({ heroMockupRef }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-hero pb-24 pt-32">
      <div className="pointer-events-none absolute -left-20 -top-32 h-[400px] w-[400px] rounded-full bg-white/60 blur-[70px]" />
      <div className="pointer-events-none absolute right-0 top-20 h-[300px] w-[300px] rounded-full bg-white/40 blur-[70px]" />
      <div className="pointer-events-none absolute -bottom-40 left-1/3 h-[500px] w-[500px] rounded-full bg-white/30 blur-[70px]" />

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/70 px-3.5 py-1.5 text-xs font-medium text-body backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-mint" />
            LỘ TRÌNH CÁ NHÂN HÓA · GIÁO VIÊN ĐỒNG HÀNH
          </div>

          <h1 className="mb-6 text-hero font-semibold leading-[1.05] tracking-[-0.025em] text-ink">
            Tiếng Anh không khó.
            <br />
            Bạn chỉ cần đúng lộ trình.
          </h1>

          <p className="mx-auto mb-8 max-w-[620px] text-[17px] leading-relaxed text-body/80 md:text-[18px]">
            Đánh giá đúng trình độ, học cùng giáo viên giàu kinh nghiệm và luyện tập mỗi ngày với lộ trình được thiết kế riêng cho mục tiêu của bạn.
          </p>

          <div className="mb-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="#placement-test" className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-mint px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-mint-deep sm:w-auto">
              Kiểm tra trình độ miễn phí
              <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#courses" className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-line bg-transparent px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-hover-line hover:bg-surface-soft sm:w-auto">
              Khám phá khóa học
            </a>
          </div>

          <p className="text-sm text-muted">Miễn phí · Chỉ mất 15 phút · Nhận kết quả ngay</p>
        </div>

        <div ref={heroMockupRef} className="mt-16 transition-transform duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)]">
          <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-mockup">
            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_260px]">
              <aside className="hidden border-r border-line-soft bg-surface-soft p-4 lg:block">
                <div className="mb-6 flex items-center gap-2 px-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-ink">
                    <span className="text-[10px] font-bold leading-none text-mint">F</span>
                  </div>
                  <span className="text-[13px] font-semibold">FluentUp</span>
                </div>
                <div className="space-y-1">
                  <a className="flex items-center gap-2.5 rounded-lg bg-ink px-3 py-2 text-[13px] font-medium text-white">
                    <LayoutDashboard className="h-4 w-4" />
                    Tổng quan
                  </a>
                  <a className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-muted transition-colors hover:bg-white hover:text-ink">
                    <BookOpen className="h-4 w-4" />
                    Bài học hôm nay
                  </a>
                  <a className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-muted transition-colors hover:bg-white hover:text-ink">
                    <Mic className="h-4 w-4" />
                    Luyện Speaking
                  </a>
                  <a className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-muted transition-colors hover:bg-white hover:text-ink">
                    <Layers className="h-4 w-4" />
                    Từ vựng
                  </a>
                  <a className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-muted transition-colors hover:bg-white hover:text-ink">
                    <TrendingUp className="h-4 w-4" />
                    Tiến độ của tôi
                  </a>
                </div>
              </aside>

              <main className="p-6">
                <div className="mb-1 flex items-start justify-between">
                  <div>
                    <h3 className="text-[22px] font-semibold text-ink">Chào buổi sáng, Minh 👋</h3>
                    <p className="mt-1 text-[13px] text-muted">Bạn đã hoàn thành 68% mục tiêu tuần này.</p>
                  </div>
                  <div className="hidden items-center gap-2 md:flex">
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-muted">
                      <Bell className="h-4 w-4" />
                    </button>
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-muted">
                      <Settings className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mb-5 mt-4 flex items-center gap-3">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line-soft">
                    <div className="js-progress h-full w-0 rounded-full bg-linear-to-r from-mint to-mint-deep transition-[width] duration-[1400ms] ease-[cubic-bezier(0.4,0,0.2,1)]" data-w="68%" />
                  </div>
                  <span className="text-[12px] font-semibold text-ink">68%</span>
                </div>
                <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
                  {[
                    { icon: Flame, label: "Streak", value: "12", suffix: "ngày" },
                    { icon: BookMarked, label: "Từ vựng", value: "240", suffix: "từ" },
                    { icon: Mic, label: "Speaking", value: "186", suffix: "phút" },
                    { icon: Award, label: "Trình độ", value: "B1", suffix: "" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-card border border-line bg-white p-3">
                      <div className="mb-1 flex items-center gap-1.5 text-[11px] text-caption">
                        <item.icon className="h-3 w-3" /> {item.label}
                      </div>
                      <div className="text-[18px] font-semibold text-ink">
                        {item.value} {item.suffix ? <span className="text-[11px] font-normal text-caption">{item.suffix}</span> : null}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="overflow-hidden rounded-xl border border-line">
                  <div className="grid gap-0 md:grid-cols-2">
                    <div className="relative h-44 bg-teal-start md:h-auto">
                      <img src="https://picsum.photos/seed/lesson-video-thumb/600/400.jpg" alt="" className="h-full w-full object-cover opacity-90" />
                      <div className="absolute inset-0 bg-linear-to-t from-ink/60 to-transparent" />
                      <button className="absolute inset-0 m-auto flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg">
                        <Play className="ml-0.5 h-5 w-5 text-ink" />
                      </button>
                      <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-line-soft bg-surface px-2.5 py-1 text-xs font-medium text-body backdrop-blur">
                        <CirclePlay className="h-3 w-3" />
                        Video bài học
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full border border-line-soft bg-surface px-2.5 py-1 text-xs font-medium text-body">
                          B1 Intermediate
                        </span>
                        <span className="text-[11px] text-caption">· 25 phút</span>
                      </div>
                      <h4 className="mb-2 text-[17px] font-semibold text-ink">Describe your daily routine</h4>
                      <p className="mb-3 text-[13px] text-muted">
                        Học cách mô tả thói quen hàng ngày bằng thì hiện tại đơn và các cụm từ chỉ tần suất.
                      </p>
                      <div className="mb-4 flex flex-wrap gap-1.5">
                        {["routine", "frequency", "present simple"].map((tag) => (
                          <span key={tag} className="inline-flex items-center gap-1 rounded-full border border-line-soft bg-surface px-2.5 py-1 text-xs font-medium text-body">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[12px] text-muted">
                          <div className="h-1 w-20 overflow-hidden rounded-full bg-line-soft">
                            <div className="h-full w-3/5 rounded-full bg-mint" />
                          </div>
                          60% hoàn thành
                        </div>
                        <button className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-body">
                          Bắt đầu
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </main>

              <aside className="border-line-soft bg-surface-soft border-t p-5 lg:border-l lg:border-t-0">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-[13px] font-semibold text-ink">Lộ trình của bạn</h4>
                  <Route className="h-4 w-4 text-caption" />
                </div>
                <div className="mb-6 space-y-4">
                  {[
                    { label: "Đã hoàn thành", title: "Foundation", active: false },
                    { label: "Đang học", title: "Communication", active: true, meta: "68% hoàn thành" },
                    { label: "Sắp tới", title: "IELTS Preparation", active: false },
                    { label: "Mục tiêu", title: "IELTS 6.5+", active: false },
                  ].map((item, index) => (
                    <div key={item.title} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={`size-2.5 shrink-0 rounded-full border-2 ${
                            item.active ? "border-mint bg-mint shadow-status-ring" : index === 0 ? "border-ink bg-ink" : "border-line bg-white"
                          }`}
                        />
                        {index < 3 ? <div className="mt-1 w-px flex-1 bg-line" /> : null}
                      </div>
                      <div className="pb-3">
                        <div className={`text-[11px] ${item.active ? "font-medium text-mint-deep" : "text-caption"}`}>{item.label}</div>
                        <div className={`text-[13px] font-semibold ${item.label === "Sắp tới" ? "text-muted" : "text-ink"}`}>{item.title}</div>
                        {item.meta ? <div className="mt-0.5 text-[11px] text-caption">{item.meta}</div> : null}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-line bg-white p-3">
                  <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-caption">
                    <Sparkles className="h-3 w-3" /> Ưu tiên tuần này
                  </div>
                  <div className="mb-1 text-[13px] font-semibold text-ink">Speaking Fluency</div>
                  <p className="text-[11px] leading-relaxed text-muted">
                    Bạn cần thêm 45 phút luyện nói để đạt mục tiêu tuần.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
