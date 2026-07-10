import { Building, Video } from 'lucide-react';

export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundImage:
          'linear-gradient(180deg, #87A8C8 0%, #B9C7D5 40%, #E8D9C3 75%, #F5E9D8 100%)',
      }}
    >
      <div className="absolute rounded-[50%] blur-[80px] pointer-events-none bg-[#87A8C8]/30 w-125 h-125 -top-32 -right-20"></div>
      <div className="absolute rounded-[50%] blur-[80px] pointer-events-none bg-[#F5E9D8]/50 w-100 h-100 top-20 -left-20"></div>
      <div className="container mx-auto relative px-6 lg:px-8 py-20 lg:py-28">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-white/60 mb-6">
            <div className="flex items-center gap-0.5 h-4">
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className="inline-block w-0.75 h-3.5 rounded-sm bg-mint"
                  style={{
                    animation: 'wave 1.1s ease-in-out infinite',
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-[#5A4A2A]">
              Đang có 1,240 học viên online
            </span>
          </div>
          <h1 className="text-[clamp(36px,6vw,72px)] font-extrabold tracking-[-0.02em] leading-[1.05] text-[#0A0A0A] mb-6">
            Các khóa học phù hợp
            <br />
            <span className="text-[#2D5A4F]">Một mục tiêu.</span>
            <br />
            Một chương trình phù hợp.
          </h1>

          <p className="text-lg lg:text-xl text-[#5A4A2A] max-w-xl mb-8">
            Từ lớp học trực tiếp tại trung tâm đến khóa học video linh hoạt —
            chọn cách học phù hợp với lịch trình và mục tiêu của bạn.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#E5E5E5] bg-white/80 backdrop-blur-sm shadow-sm">
              <div className="w-6 h-6 rounded-full bg-mint/10 flex items-center justify-center">
                <Building className="w-3.5 h-3.5 text-mint-deep" />
              </div>
              <span className="text-sm font-medium text-[#1C1C1E]">
                Học tại trung tâm
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#E5E5E5] bg-white/80 backdrop-blur-sm shadow-sm">
              <div className="w-6 h-6 rounded-full bg-mint/10 flex items-center justify-center">
                <Video className="w-3.5 h-3.5 text-mint-deep" />
              </div>
              <span className="text-sm font-medium text-[#1C1C1E]">
                Học online với video có sẵn
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
