import { Check, Star } from "lucide-react";

export default function HomeCategoryCoursesSection() {
  const cards = [
    {
      eyebrow: "Tự học",
      title: "Khóa học có sẵn",
      desc: "Tự học các khóa học có sẵn.",
      bullets: ["Phát âm chuẩn từ đầu", "1000+ từ vựng cơ bản", "Ngữ pháp ứng dụng"],
      tags: ["Người mới bắt đầu", "Người mất gốc"],
      cta: "Xem chương trình",
    },
    {
      eyebrow: "Giảng dạy",
      title: "Các khóa học tại trung tâm",
      desc: "Tự tin giao tiếp trong công việc và cuộc sống hàng ngày.",
      bullets: ["Luyện nói tình huống thực tế", "Phản hồi phát âm AI", "Chủ đề công việc & đời sống"],
      tags: ["Sinh viên", "Người đi làm","tất cả đối tượng"],
      cta: "Bắt đầu học",
      featured: true,
    },
  ];

  return (
    <section id="courses" className="bg-surface py-24">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="mb-14 max-w-2xl js-reveal translate-y-4 opacity-0 transition-[opacity,transform] duration-[600ms]">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-muted">Chương trình học</p>
          <h2 className="text-section font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
            Một mục tiêu.
            <br />
            Một chương trình phù hợp.
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {cards.map((card) => (
            <div
              key={card.title}
              className={`js-reveal translate-y-4 rounded-card border bg-white p-7 opacity-0 transition-[opacity,transform] duration-[600ms] hover:-translate-y-0.5 hover:border-hover-line hover:shadow-card-hover ${
                card.featured ? "border-2 border-mint shadow-featured" : "border-line"
              }`}
            >
              {card.featured ? (
                <div className="-top-3 left-7 mb-2 inline-flex items-center gap-1.5 rounded-full bg-mint px-3 py-1 text-[11px] font-semibold text-ink">
                  <Star className="h-3 w-3" /> PHỔ BIẾN NHẤT
                </div>
              ) : null}
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-muted">{card.eyebrow}</p>
              <h3 className="mb-3 text-[24px] font-semibold text-ink">{card.title}</h3>
              <p className="mb-6 text-[15px] leading-relaxed text-muted">{card.desc}</p>
              <div className="mb-8 space-y-2.5">
                {card.bullets.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-body">
                    <Check className="h-4 w-4 text-mint-deep" />
                    {item}
                  </div>
                ))}
              </div>
              <div className="border-t border-line-soft pt-5">
                <p className="mb-3 text-xs text-caption">Phù hợp với</p>
                <div className="mb-5 flex flex-wrap gap-1.5">
                  {card.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 rounded-full border border-line-soft bg-surface px-2.5 py-1 text-xs font-medium text-body">
                      {tag}
                    </span>
                  ))}
                </div>
                <a href="#" className={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${card.featured ? "bg-mint text-ink hover:bg-mint-deep" : "border border-line text-ink hover:border-hover-line hover:bg-surface-soft"}`}>
                  {card.cta}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
