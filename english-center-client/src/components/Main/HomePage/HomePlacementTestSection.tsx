import { ArrowLeft, ArrowRight, ClipboardList } from "lucide-react";

type AnswerOption = {
  label: string;
  active: boolean;
};

export default function HomePlacementTestSection() {
  const answerOptions: AnswerOption[] = [
    { label: "A. Going to the cinema tonight", active: false },
    { label: "B. Visiting the new art exhibition", active: true },
    { label: "C. Having dinner at a restaurant", active: false },
    { label: "D. Watching a movie at home", active: false },
  ];

  return (
    <section id="placement-test" className="bg-surface py-24">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="js-reveal translate-y-4 opacity-0 transition-[opacity,transform] duration-[600ms]">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-muted">Bắt đầu từ đúng trình độ</p>
            <h2 className="mb-5 text-section font-semibold leading-[1.1] tracking-[-0.02em] text-ink">Chưa biết nên bắt đầu từ đâu?</h2>
            <p className="mb-8 text-[17px] leading-relaxed text-muted">
              Hoàn thành bài kiểm tra 15 phút để nhận đánh giá trình độ và lộ trình học phù hợp.
            </p>
            <a href="#" className="mb-3 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-body">
              Kiểm tra trình độ miễn phí
              <ArrowRight className="h-4 w-4" />
            </a>
            <p className="text-sm text-caption">Không cần thẻ thanh toán · Nhận kết quả ngay</p>
          </div>
          <div className="js-reveal translate-y-4 opacity-0 transition-[opacity,transform] duration-[600ms]">
            <div className="rounded-2xl border border-line bg-white p-6 shadow-mockup">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink">
                    <ClipboardList className="h-4 w-4 text-mint" />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-ink">Bài kiểm tra trình độ</div>
                    <div className="text-[11px] text-caption">Phần 2/4 · Listening</div>
                  </div>
                </div>
                <div className="text-[11px] text-muted">07:42 còn lại</div>
              </div>
              <div className="mb-6 h-1 overflow-hidden rounded-full bg-line-soft">
                <div className="h-full w-1/2 rounded-full bg-mint" />
              </div>
              <p className="mb-4 text-[15px] font-medium text-ink">
                You will hear a short conversation. What does the woman suggest doing?
              </p>
              <div className="space-y-2.5">
                {answerOptions.map((option) => (
                  <div
                    key={option.label}
                    className={`flex items-center gap-3 rounded-lg border p-3 ${option.active ? "border-mint bg-mint/5" : "border-line hover:border-ink"}`}
                  >
                    <div className={`h-5 w-5 rounded-full border-2 ${option.active ? "border-mint bg-mint" : "border-line"}`} />
                    <span className={`text-[14px] ${option.active ? "font-medium text-ink" : "text-body"}`}>{option.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-line-soft pt-5">
                <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-transparent px-5 py-2.5 text-sm font-medium text-muted transition-colors hover:text-ink">
                  <ArrowLeft className="h-4 w-4" />
                  Trước
                </button>
                <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-body">
                  Câu tiếp theo
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
