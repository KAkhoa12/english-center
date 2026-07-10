import { ArrowRight } from "lucide-react";

export default function HomeFinalCtaSection() {
  return (
    <section className="relative overflow-hidden bg-final py-32">
      <div className="pointer-events-none absolute -left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-white/50 blur-[70px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-white/40 blur-[70px]" />
      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="js-reveal translate-y-4 text-section font-semibold leading-[1.1] tracking-[-0.02em] text-ink opacity-0 transition-[opacity,transform] duration-[600ms]">
            Một phiên bản tự tin hơn của bạn
            <br />
            có thể bắt đầu từ hôm nay.
          </h2>
          <p className="js-reveal translate-y-4 mb-8 text-[17px] text-body/70 opacity-0 transition-[opacity,transform] duration-[600ms]">
            Hãy bắt đầu bằng việc hiểu rõ trình độ hiện tại của mình.
          </p>
          <div className="js-reveal flex flex-col items-center justify-center gap-3 translate-y-4 opacity-0 transition-[opacity,transform] duration-[600ms] sm:flex-row">
            <a href="#" className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-body sm:w-auto">
              Kiểm tra trình độ miễn phí
              <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#" className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-line bg-transparent px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-hover-line hover:bg-surface-soft sm:w-auto">
              Nhận tư vấn lộ trình
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
