import { ArrowRight, Quote, Star } from "lucide-react";

export default function HomeStoriesSection() {
  return (
    <section id="stories" className="bg-white py-24">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="mb-14 max-w-2xl js-reveal translate-y-4 opacity-0 transition-[opacity,transform] duration-[600ms]">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-muted">Câu chuyện học viên</p>
          <h2 className="text-section font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
            Tiến bộ thật.
            <br />
            Cảm xúc thật.
          </h2>
        </div>
        <div className="js-reveal translate-y-4 overflow-hidden bg-coral opacity-0 transition-[opacity,transform] duration-[600ms]">
          <div className="grid items-stretch gap-0 lg:grid-cols-5">
            <div className="flex flex-col justify-center p-8 lg:col-span-3 md:p-12 lg:p-14">
              <Quote className="mb-6 h-10 w-10 text-white/40" />
              <p className="mb-8 text-[22px] font-medium leading-[1.05] tracking-[-0.025em] text-white md:text-[26px] lg:text-[28px]">
                "Trước đây mình luôn nghĩ mình không có năng khiếu học tiếng Anh. Sau 6 tháng, mình đã có thể tự tin thuyết trình hoàn toàn bằng tiếng Anh."
              </p>
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-[15px] font-semibold text-white">Nguyễn Hoàng Minh</div>
                  <div className="text-[13px] text-white/70">Marketing Executive</div>
                </div>
                <div className="hidden h-8 w-px bg-white/20 sm:block" />
                <div className="hidden items-center gap-2 sm:flex">
                  <span className="rounded-full bg-white/15 px-2.5 py-1 text-[12px] font-medium text-white">IELTS 4.5</span>
                  <ArrowRight className="h-4 w-4 text-white/70" />
                  <span className="rounded-full bg-white px-2.5 py-1 text-[12px] font-semibold text-coral">IELTS 6.5</span>
                </div>
              </div>
            </div>
            <div className="relative min-h-[280px] lg:col-span-2 lg:min-h-full">
              <img src="https://picsum.photos/seed/student-hoang-minh-story/600/700.jpg" alt="Nguyễn Hoàng Minh" className="absolute inset-0 h-full w-full object-cover" />
            </div>
          </div>
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {[
            ["Trần Lê", "Sinh viên", "Lộ trình học rất rõ ràng. Mình biết mỗi tuần cần làm gì và thấy mình tiến bộ từng tuần."],
            ["Hà Vũ", "Nhân viên kinh doanh", "Giáo viên rất tận tâm. Mỗi lỗi sai đều được sửa chi tiết, mình hiểu vì sao mình sai và cách khắc phục."],
            ["Khoa Mai", "Kỹ sư phần mềm", "Mình đã thử nhiều trung tâm nhưng đây là nơi đầu tiên mình thực sự muốn học mỗi ngày."],
          ].map(([name, role, quote]) => (
            <div key={name} className="js-reveal translate-y-4 rounded-card border border-line bg-white p-6 opacity-0 transition-[opacity,transform] duration-[600ms]">
              <div className="mb-4 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-mint text-mint" />
                ))}
              </div>
              <p className="mb-5 text-[14px] leading-relaxed text-body">"{quote}"</p>
              <div className="flex items-center gap-3 border-t border-line-soft pt-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-sky to-sky-deep text-[12px] font-semibold text-white">
                  {name.split(" ").slice(-1)[0].slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-ink">{name}</div>
                  <div className="text-[11px] text-caption">{role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
