import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authApi } from "@/services/auth/auth.api";
import { PUBLIC_ROUTES } from "@/shared/routes";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) { toast.error("Link không hợp lệ"); return; }
    if (!password) { toast.error("Vui lòng nhập mật khẩu mới"); return; }
    if (password !== confirm) { toast.error("Mật khẩu xác nhận không khớp"); return; }
    if (password.length < 6) { toast.error("Mật khẩu phải có ít nhất 6 ký tự"); return; }
    setLoading(true);
    try {
      const res = await authApi.resetPassword({ token, password });
      if (!res.success) throw new Error(res.message || "Đặt lại mật khẩu thất bại");
      setDone(true);
      toast.success("Đặt lại mật khẩu thành công");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Đặt lại mật khẩu thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="mx-auto max-w-sm space-y-4 text-center">
        <h1 className="text-2xl font-bold">Link không hợp lệ</h1>
        <p className="text-gray-500">Vui lòng kiểm tra lại email hoặc yêu cầu gửi lại link.</p>
        <Button asChild><Link to={PUBLIC_ROUTES.LOGIN}>Quay lại đăng nhập</Link></Button>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mx-auto max-w-sm space-y-4 text-center">
        <h1 className="text-2xl font-bold">Đặt lại mật khẩu thành công</h1>
        <p className="text-gray-500">Bạn có thể đăng nhập bằng mật khẩu mới.</p>
        <Button asChild><Link to={PUBLIC_ROUTES.LOGIN}>Đăng nhập</Link></Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Đặt lại mật khẩu</h1>
        <p className="mt-1 text-sm text-gray-500">Nhập mật khẩu mới cho tài khoản của bạn</p>
      </div>
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
        <Input type="password" placeholder="Mật khẩu mới" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Input type="password" placeholder="Xác nhận mật khẩu" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        <Button type="submit" className="w-full" disabled={loading}>{loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}</Button>
      </form>
    </div>
  );
}
