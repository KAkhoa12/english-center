import { CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import logo from "@/assets/logo.svg";
const benefits = [
  "Lộ trình học cá nhân hóa theo mục tiêu",
  "Theo dõi tiến độ, điểm số và lịch học mỗi ngày",
  "Kết nối giáo viên và nhận phản hồi nhanh",
];

const BrandMark = ({ dark = false }: { dark?: boolean }) => (
  <Link to="/" className="flex items-center gap-2.5">
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
        dark ? "bg-white backdrop-blur" : "bg-white"
      }`}
    >
      <img src={logo} alt="FluentUp" className="h-5 w-5" />
    </div>
    <span
      className={`text-[18px] font-semibold tracking-tight ${
        dark ? "text-white" : "text-ink"
      }`}
    >
      Edu{" "}
      <span className={`font-normal ${dark ? "text-white/50" : "text-muted"}`}>
        English
      </span>
    </span>
  </Link>
);

export const AuthLayout = () => {
  return (
    <div className="max-h-screen bg-white text-body">
      <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        {/* ─── Left Panel ─── */}
        <aside className="relative hidden overflow-hidden p-10 text-white lg:flex lg:flex-col lg:justify-between bg-dark-teal">
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-grid-pattern opacity-40" />

          {/* Ambient glows */}
          <div className="pointer-events-none absolute -left-20 top-10 h-[400px] w-[400px] rounded-full bg-mint/20 blur-[120px]" />
          <div className="pointer-events-none absolute -right-20 bottom-10 h-[400px] w-[400px] rounded-full bg-sky/25 blur-[120px]" />

          {/* Brand */}
          <div className="relative z-10">
            <BrandMark dark />
          </div>

          {/* Main content */}
          <div className="relative z-10 max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[12px] font-semibold uppercase tracking-wider text-white/80 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-mint-soft" />
              Học tiếng Anh thông minh hơn
            </div>

            <h2 className="text-[44px] font-bold leading-[1.08] tracking-tight text-white">
              Một tài khoản cho
              <br />
              toàn bộ hành trình
              <br />
              <span className="text-mint-soft">học tập.</span>
            </h2>

            <p className="mt-5 text-[15px] leading-relaxed text-white/60 max-w-md">
              Đăng nhập để quản lý khóa học, lịch học, bài tập và kết quả học tập tại FluentUp English.
            </p>

            <div className="mt-10 space-y-3.5">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-mint/20 backdrop-blur-sm">
                    <CheckCircle2 className="h-4 w-4 text-mint-soft" strokeWidth={2.5} />
                  </div>
                  <span className="text-[14px] font-medium text-white/80">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom card */}
          <div className="relative z-10 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-mint/20 backdrop-blur-sm">
                <ShieldCheck className="h-5 w-5 text-mint-soft" />
              </div>
              <div>
                <div className="text-[14px] font-semibold text-white">
                  Bảo mật học viên
                </div>
                <div className="mt-0.5 text-[12px] leading-relaxed text-white/50">
                  Dữ liệu tài khoản được bảo vệ trong hệ thống FluentUp.
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* ─── Right Panel ─── */}
        <main className="flex min-h-screen flex-col bg-white">
          {/* Mobile brand */}
          <div className="flex items-center justify-between px-5 py-5 sm:px-8 lg:hidden">
            <BrandMark />
          </div>

          {/* Form area */}
          <div className="px-2 py-2 sm:px-8">
            <Outlet />
          </div>

          {/* Footer */}
          <div className="hidden px-5 py-4 text-center sm:px-8 lg:block">
            <p className="text-[12px] text-faint">
              © 2026 FluentUp English. All rights reserved.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuthLayout;
