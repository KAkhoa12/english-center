import { LockKeyhole, Mail, Phone, UserRound } from "lucide-react";
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

export const RegisterPage = () => {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const storeError = useAuthStore((state) => state.error);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const result = await register({
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        password,
        avatar_url: null,
        date_of_birth: null,
        gender: null,
        address: null,
        level: null,
        learning_goal: null,
        parent_name: null,
        parent_phone: null,
      });

      if (result.success) {
        toast.success(result.message || "Đăng ký thành công");
        navigate("/", { replace: true });
      } else {
        toast.error(result.message || "Đăng ký thất bại");
      }
    } catch (error) {
      const fallbackMessage = storeError || "Đăng ký thất bại";
      const message =
        error instanceof Error && error.message ? error.message : fallbackMessage;
      toast.error(message);
    }
  };

  return (
    <AuthCard
      eyebrow="Đăng ký"
      title="Tạo tài khoản học viên"
      description="Bắt đầu lộ trình học tiếng Anh cá nhân hóa cùng StarEnglish trong vài phút."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <AuthInput
          label="Họ và tên"
          Icon={UserRound}
          type="text"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          placeholder="Nguyễn Minh Anh"
          autoComplete="name"
          required
        />
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
          label="Số điện thoại"
          Icon={Phone}
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="0912 345 678"
          autoComplete="tel"
          required
        />
        <AuthInput
          label="Mật khẩu"
          Icon={LockKeyhole}
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Tối thiểu 8 ký tự"
          autoComplete="new-password"
          minLength={8}
          required
        />

        <label className="flex items-start gap-3 text-sm leading-relaxed text-gray-500">
          <input
            type="checkbox"
            required
            className="mt-1 h-4 w-4 rounded border-gray-300 text-brand-600"
          />
          <span>
            Tôi đồng ý với{" "}
            <Link to="/terms" className="font-bold text-brand-600">
              điều khoản sử dụng
            </Link>{" "}
            và{" "}
            <Link to="/privacy" className="font-bold text-brand-600">
              chính sách bảo mật
            </Link>
            .
          </span>
        </label>

        <AuthSubmitButton disabled={isLoading}>
          {isLoading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
        </AuthSubmitButton>
      </form>

      <AuthDivider />

      <SocialAuthButton
        icon={<span className="text-base font-black text-coral-500">G</span>}
      >
        Đăng ký với Google
      </SocialAuthButton>

      <p className="mt-7 text-center text-sm text-gray-500">
        Đã có tài khoản?{" "}
        <Link
          to="/login"
          className="font-bold text-brand-600 hover:text-brand-700"
        >
          Đăng nhập
        </Link>
      </p>
    </AuthCard>
  );
};

export default RegisterPage;
