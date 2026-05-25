import { LockKeyhole, Mail, Phone, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import {
  AuthCard,
  AuthDivider,
  AuthInput,
  AuthSubmitButton,
  SocialAuthButton,
} from "@/components/Auth";

export const RegisterPage = () => {
  return (
    <AuthCard
      eyebrow="Đăng ký"
      title="Tạo tài khoản học viên"
      description="Bắt đầu lộ trình học tiếng Anh cá nhân hóa cùng StarEnglish trong vài phút."
    >
      <form className="space-y-5">
        <AuthInput
          label="Họ và tên"
          Icon={UserRound}
          type="text"
          placeholder="Nguyễn Minh Anh"
          autoComplete="name"
          required
        />
        <AuthInput
          label="Email"
          Icon={Mail}
          type="email"
          placeholder="email@example.com"
          autoComplete="email"
          required
        />
        <AuthInput
          label="Số điện thoại"
          Icon={Phone}
          type="tel"
          placeholder="0912 345 678"
          autoComplete="tel"
          required
        />
        <AuthInput
          label="Mật khẩu"
          Icon={LockKeyhole}
          type="password"
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

        <AuthSubmitButton>Tạo tài khoản</AuthSubmitButton>
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
