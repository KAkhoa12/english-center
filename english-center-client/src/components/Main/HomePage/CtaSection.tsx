import { ArrowRight, Phone } from "lucide-react";

export default function CtaSection() {
  return (
    <section className="hero-gradient relative overflow-hidden py-24">
      <div className="blob-1" />
      <div className="blob-2" />
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center lg:px-8">
        <div className="fade-up">
          <h2 className="mb-6 text-3xl font-bold leading-[0.95] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Sẵn sàng bắt đầu{" "}
            <span className="font-serif-display font-normal italic">
              hành trình
            </span>{" "}
            mới?
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/80">
            Đăng ký nhận bài test trình độ miễn phí và ưu đãi giảm 20% học phí
            cho học viên mới.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-brand-600 shadow-xl transition-all hover:bg-gray-50"
            >
              Đăng ký test miễn phí
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="tel:19001234"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-8 py-4 font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              <Phone className="h-5 w-5" />
              Gọi 1900 1234
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
