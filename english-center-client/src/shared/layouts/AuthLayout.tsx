import { CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { Outlet } from "react-router-dom";
import { AuthBrand } from "@/components/Auth";

const benefits = [
  "Lộ trình học cá nhân hóa theo mục tiêu",
  "Theo dõi tiến độ, điểm số và lịch học mỗi ngày",
  "Kết nối giáo viên và nhận phản hồi nhanh",
];

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        <aside className="relative hidden overflow-hidden bg-gray-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.62),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.38),transparent_30%)]" />
          <div className="relative z-10">
            <AuthBrand dark />
          </div>

          <div className="relative z-10 max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white/75">
              <Sparkles className="h-4 w-4 text-sun-400" />
              Học tiếng Anh thông minh hơn
            </div>
            <h2 className="text-5xl font-bold leading-tight tracking-tight">
              Một tài khoản cho toàn bộ hành trình học tập.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-white/60">
              Đăng nhập để quản lý khóa học, lịch học, bài tập và kết quả học
              tập tại StarEnglish.
            </p>

            <div className="mt-10 space-y-4">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent-400" />
                  <span className="text-sm font-medium text-white/75">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                <ShieldCheck className="h-6 w-6 text-accent-300" />
              </div>
              <div>
                <div className="font-bold">Bảo mật học viên</div>
                <div className="mt-1 text-sm text-white/50">
                  Dữ liệu tài khoản được bảo vệ trong hệ thống StarEnglish.
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex min-h-screen flex-col">
          <div className="flex items-center justify-between px-5 py-5 sm:px-8 lg:hidden">
            <AuthBrand />
          </div>
          <div className="flex flex-1 items-center justify-center px-5 py-8 sm:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuthLayout;
