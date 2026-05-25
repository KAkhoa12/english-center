import { ArrowRight, CirclePlay, GraduationCap, Star } from "lucide-react";

const stats = [
  ["10,000+", "Học viên tin tưởng"],
  ["98%", "Tỷ lệ đậu chứng chỉ"],
  ["50+", "Giáo viên bản ngữ"],
];

export default function HeroSection() {
  return (
    <section className="hero-gradient relative flex min-h-screen items-center overflow-hidden">
      <div className="blob-1" />
      <div className="blob-2" />
      <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/english-hero/1920/1080.jpg')] bg-cover bg-center opacity-10 mix-blend-overlay" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 pt-32 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="text-white">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 backdrop-blur-md">
              <span className="h-2 w-2 animate-pulse rounded-full bg-accent-400" />
              <span className="text-sm font-medium text-white/90">
                Tuyển sinh mùa hè 2025 - Ưu đãi lên đến 40%
              </span>
            </div>

            <h1 className="mb-6 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-7xl">
              Mở khóa
              <br />
              <span className="font-serif-display font-normal italic">
                tương lai
              </span>
              <br />
              với Tiếng Anh
            </h1>

            <p className="mb-10 max-w-lg text-lg leading-relaxed text-white/80">
              Phương pháp học tập hiện đại, giáo viên bản ngữ giàu kinh nghiệm,
              môi trường rèn luyện giao tiếp tự tin - tất cả tại StarEnglish.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#courses"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-brand-600 shadow-xl shadow-brand-700/20 transition-all hover:bg-gray-50 hover:shadow-brand-700/30"
              >
                Khám phá khóa học
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#about"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-8 py-4 font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                <CirclePlay className="h-5 w-5" />
                Xem giới thiệu
              </a>
            </div>

            <div className="mt-14 flex flex-wrap gap-8 border-t border-white/15 pt-8">
              {stats.map(([value, label]) => (
                <div key={label}>
                  <div className="counter text-3xl font-bold">{value}</div>
                  <div className="mt-1 text-sm text-white/60">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="float-anim relative">
              <img
                src="https://picsum.photos/seed/student-english/600/700.jpg"
                alt="Học viên StarEnglish"
                className="mx-auto w-full max-w-md rounded-3xl border border-white/20 object-cover shadow-2xl shadow-brand-900/30"
              />
            </div>
            <div className="float-anim-delay absolute -left-4 top-16 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-400/20">
                <GraduationCap className="h-5 w-5 text-accent-500" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  IELTS 8.0+
                </div>
                <div className="text-xs text-gray-500">Đạt chứng chỉ</div>
              </div>
            </div>
            <div className="float-anim-delay2 absolute -right-4 bottom-24 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sun-400/20">
                <Star className="h-5 w-5 text-sun-500" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  4.9/5.0
                </div>
                <div className="text-xs text-gray-500">Đánh giá học viên</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 50C360 100 720 0 1080 50C1260 75 1380 80 1440 75V100H0V50Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
