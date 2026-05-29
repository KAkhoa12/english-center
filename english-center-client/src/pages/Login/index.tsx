import { LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  AuthCard,
  AuthDivider,
  AuthInput,
  AuthSubmitButton,
  SocialAuthButton,
} from "@/components/Auth";
import { useAuthStore } from "@/services/auth/auth.store";

export const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const storeError = useAuthStore((state) => state.error);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
    <AuthCard
      eyebrow="Đăng nhập"
      title="Chào mừng bạn trở lại"
      description="Truy cập dashboard để tiếp tục lớp học, bài tập và lộ trình tiếng Anh của bạn."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <AuthInput
          label="Email"
          Icon={Mail}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="email@example.com"
          autoComplete="email"
          required
        />
        <AuthInput
          label="Mật khẩu"
          Icon={LockKeyhole}
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Nhập mật khẩu"
          autoComplete="current-password"
          required
        />

        <div className="flex items-center justify-between gap-4">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-brand-600"
            />
            Ghi nhớ đăng nhập
          </label>
          <Link
            to="/forgot-password"
            className="text-sm font-bold text-brand-600 hover:text-brand-700"
          >
            Quên mật khẩu?
          </Link>
        </div>

        <AuthSubmitButton disabled={isLoading}>
          {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
        </AuthSubmitButton>
      </form>

      <AuthDivider />

      <SocialAuthButton
        icon={<span className="text-base font-black text-coral-500">G</span>}
      >
        Tiếp tục với Google
      </SocialAuthButton>

      <p className="mt-7 text-center text-sm text-gray-500">
        Chưa có tài khoản?{" "}
        <Link
          to="/register"
          className="font-bold text-brand-600 hover:text-brand-700"
        >
          Đăng ký ngay
        </Link>
      </p>
    </AuthCard>
  );
};

export default LoginPage;
