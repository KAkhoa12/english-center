import { Bot, Check, Lightbulb, Mic } from "lucide-react";

export default function HomePracticeSection() {
  return (
    <section className="bg-surface py-24">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="js-reveal translate-y-4 opacity-0 transition-[opacity,transform] duration-[600ms]">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-muted">Học qua thực hành</p>
            <h2 className="mb-5 text-section font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
              Học tiếng Anh bằng cách sử dụng tiếng Anh.
            </h2>
            <p className="mb-8 text-[16px] leading-relaxed text-muted">
              Thay vì chỉ ghi nhớ lý thuyết, bạn luyện tập với các tình huống giao tiếp thực tế mỗi ngày.
            </p>
            <ul className="space-y-3.5">
              {[
                "Luyện nói theo tình huống thực tế",
                "Nhận phản hồi phát âm chi tiết",
                "Ôn từ vựng theo spaced repetition",
                "Thực hành cùng giáo viên",
                "Theo dõi tiến bộ từng kỹ năng",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-mint/10">
                    <Check className="h-3 w-3 text-mint-deep" />
                  </div>
                  <span className="text-[15px] text-body">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="js-reveal translate-y-4 opacity-0 transition-[opacity,transform] duration-[600ms]">
            <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-mockup">
              <div className="flex items-center justify-between border-b border-line-soft px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-mint to-mint-deep">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-ink">AI Tutor · Sarah</div>
                    <div className="text-[11px] text-mint-deep">● Đang hoạt động</div>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border border-line-soft bg-surface px-2.5 py-1 text-xs font-medium text-body">
                  Topic: Travel
                </span>
              </div>
              <div className="space-y-4 bg-surface-soft p-5">
                <div className="flex gap-2.5">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-linear-to-br from-mint to-mint-deep">
                    <Bot className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div className="relative max-w-[80%] rounded-2xl rounded-tl-sm border border-line bg-white px-4 py-3 before:absolute before:-bottom-1.5 before:left-[18px] before:size-3 before:rotate-45 before:border-r before:border-b before:border-line before:bg-surface before:content-['']">
                    <p className="text-[14px] text-body">Tell me about a place you would love to visit.</p>
                  </div>
                </div>
                <div className="flex flex-row-reverse gap-2.5">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-ink">
                    <span className="text-[11px] font-semibold text-white">M</span>
                  </div>
                  <div className="relative max-w-[80%] rounded-2xl rounded-tr-sm bg-ink px-4 py-3 before:absolute before:-bottom-1.5 before:right-[18px] before:size-3 before:rotate-45 before:bg-ink before:content-['']">
                    <p className="text-[14px] text-white">I really want to visit Japan because the culture is fascinating and the food is amazing.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-2">
                  <div className="flex h-8 items-center gap-1">
                    {["h-3", "h-6", "h-4", "h-8", "h-5", "h-7", "h-3", "h-6", "h-4", "h-5", "h-7", "h-3"].map((height, index) => (
                      <div key={index} className={`${height} w-[3px] origin-center rounded-full bg-mint animate-wave`} style={{ animationDelay: `${index * 0.1}s` }} />
                    ))}
                  </div>
                  <span className="text-[11px] text-caption">0:08</span>
                  <button className="ml-auto flex h-9 w-9 items-center justify-center rounded-full bg-coral">
                    <Mic className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>
              <div className="border-t border-line-soft px-5 py-4">
                <div className="mb-4 grid grid-cols-3 gap-3">
                  {[
                    ["Pronunciation", "86%"],
                    ["Fluency", "78%"],
                    ["Vocabulary", "82%"],
                  ].map(([label, value]) => (
                    <div key={label} className="text-center">
                      <div className="mb-1 text-[11px] text-caption">{label}</div>
                      <div className="text-[20px] font-semibold text-ink">{value.replace("%", "")}</div>
                      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-line-soft">
                        <div className="js-progress h-full w-0 rounded-full bg-mint transition-[width] duration-[1400ms] ease-[cubic-bezier(0.4,0,0.2,1)]" data-w={value} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2.5 rounded-lg border border-line-soft bg-surface p-3">
                  <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-mint-deep" />
                  <p className="text-[13px] leading-relaxed text-body">
                    <span className="font-semibold">Great answer!</span> Try using more linking words to make your response smoother.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
