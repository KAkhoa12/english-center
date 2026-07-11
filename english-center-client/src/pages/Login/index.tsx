import { LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "@/services/auth/auth.store";

export const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const storeError = useAuthStore((state) => state.error);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const result = await login({ email, password });
      if (result.success) {
        toast.success(result.message || "Đăng nhập thành công");
        navigate("/", { replace: true });
      } else {
        toast.error(result.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      const fallbackMessage = storeError || "Đăng nhập thất bại";
      const message =
        error instanceof Error && error.message ? error.message : fallbackMessage;
      toast.error(message);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-sky/15 blur-[100px]" />
      <div className="pointer-events-none absolute -left-32 top-1/3 h-[400px] w-[400px] rounded-full bg-cream/40 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-[300px] w-[300px] rounded-full bg-mint/10 blur-[80px]" />

      <div className="relative flex min-h-screen items-center justify-center px-5 py-10">
        <div className="w-full max-w-[420px]">

          {/* Card */}
          <div className="rounded-[24px] border border-line-soft bg-white p-7 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08)] sm:p-8">
            {/* Eyebrow */}
            <div className="mb-4 flex justify-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-mint/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-mint-deep">
                <span className="h-1.5 w-1.5 rounded-full bg-mint" />
                Đăng nhập
              </span>
            </div>

            {/* Title */}
            <div className="mb-6 text-center">
              <h1 className="text-[26px] font-bold leading-tight tracking-tight text-ink">
                Chào mừng bạn trở lại
              </h1>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">
                Truy cập dashboard để tiếp tục lớp học, bài tập và lộ trình tiếng Anh của bạn.
              </p>
            </div>

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-[13px] font-semibold text-ink"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="email@example.com"
                    autoComplete="email"
                    required
                    className="h-11 w-full rounded-full border border-line bg-white pl-11 pr-4 text-[14px] font-medium text-body transition-all duration-200 outline-none placeholder:text-faint hover:border-hover-line focus:border-mint focus:ring-4 focus:ring-mint/15"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="block text-[13px] font-semibold text-ink"
                >
                  Mật khẩu
                </label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Nhập mật khẩu"
                    autoComplete="current-password"
                    required
                    className="h-11 w-full rounded-full border border-line bg-white pl-11 pr-4 text-[14px] font-medium text-body transition-all duration-200 outline-none placeholder:text-faint hover:border-hover-line focus:border-mint focus:ring-4 focus:ring-mint/15"
                  />
                </div>
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between gap-4 pt-1">
                <label className="flex cursor-pointer items-center gap-2 text-[13px] font-medium text-muted">
                  <span className="relative flex h-[18px] w-[18px] items-center justify-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="peer absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-md border border-line bg-white transition-all checked:border-mint checked:bg-mint"
                    />
                    <svg
                      className="pointer-events-none absolute h-3 w-3 text-ink opacity-0 transition-opacity peer-checked:opacity-100"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  Ghi nhớ đăng nhập
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[13px] font-semibold text-mint-deep transition-colors hover:text-ink"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-ink text-[14px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-mint-deep disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Đang đăng nhập...
                  </>
                ) : (
                  "Đăng nhập"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-line-soft" />
              <span className="text-[11px] font-medium uppercase tracking-wider text-faint">
                hoặc
              </span>
              <div className="h-px flex-1 bg-line-soft" />
            </div>

            {/* Social Auth */}
            <button
              type="button"
              className="flex h-11 w-full items-center justify-center gap-2.5 rounded-full border border-line bg-white text-[14px] font-semibold text-body transition-all duration-200 hover:-translate-y-0.5 hover:border-hover-line hover:bg-surface-soft"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-coral/15 text-[12px] font-black text-coral">
                G
              </span>
              Tiếp tục với Google
            </button>

            {/* Register link */}
            <p className="mt-6 text-center text-[13px] text-muted">
              Chưa có tài khoản?{" "}
              <Link
                to="/register"
                className="font-semibold text-mint-deep transition-colors hover:text-ink"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-[12px] text-faint">
            Bằng việc đăng nhập, bạn đồng ý với{" "}
            <Link to="/terms" className="font-medium text-muted hover:text-ink">
              Điều khoản sử dụng
            </Link>{" "}
            và{" "}
            <Link
              to="/privacy"
              className="font-medium text-muted hover:text-ink"
            >
              Chính sách bảo mật
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
