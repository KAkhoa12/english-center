import { ClipboardCheck, GraduationCap, LineChart, Route } from "lucide-react";

export default function HomeLearningJourneySection() {
  const steps = [
    { no: "01", title: "Kiểm tra trình độ", desc: "Đánh giá toàn diện Listening, Speaking, Reading và Writing.", icon: ClipboardCheck },
    { no: "02", title: "Xây dựng lộ trình", desc: "Thiết kế kế hoạch học theo trình độ, lịch học và mục tiêu cá nhân.", icon: Route },
    { no: "03", title: "Học và thực hành", desc: "Học cùng giáo viên, luyện tập tình huống thực tế và nhận phản hồi liên tục.", icon: GraduationCap, accent: true },
    { no: "04", title: "Theo dõi tiến bộ", desc: "Biết rõ kỹ năng nào đang tiến bộ và kỹ năng nào cần cải thiện.", icon: LineChart },
  ];

  return (
    <section id="learning-journey" className="bg-white py-24">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="mb-16 max-w-2xl js-reveal translate-y-4 opacity-0 transition-[opacity,transform] duration-[600ms]">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-muted">Lộ trình học</p>
          <h2 className="mb-5 text-section font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
            Biết mình đang ở đâu.
            <br />
            Hiểu rõ mình cần đi đến đâu.
          </h2>
          <p className="text-[17px] leading-relaxed text-muted">
            Không học theo một giáo trình giống nhau. Mỗi học viên bắt đầu bằng bài đánh giá năng lực và nhận một lộ trình phù hợp với mục tiêu thực tế.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.no} className="js-reveal translate-y-4 rounded-card border border-line bg-white p-6 opacity-0 transition-[opacity,transform] duration-[600ms]">
              <div className="mb-6 flex items-center justify-between">
                <span className="text-[40px] font-semibold leading-[1.05] tracking-[-0.025em] text-line-soft">{step.no}</span>
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${step.accent ? "bg-mint/10" : "bg-surface"}`}>
                  <step.icon className={`h-4 w-4 ${step.accent ? "text-mint-deep" : "text-ink"}`} />
                </div>
              </div>
              <h3 className="mb-2 text-[18px] font-semibold text-ink">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
