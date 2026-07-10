import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/services/auth/auth.store";

export default function PrivateRoute() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  const [isChecking, setIsChecking] = useState(true);
  const [canAccess, setCanAccess] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function verifyAuth() {
      try {
        const result = await checkAuth();
        if (mounted) {
          setCanAccess(result);
        }
      } catch (error) {
        console.error("Xảy ra lỗi khi kiểm tra quyền truy cập:", error);
        if (mounted) {
          setCanAccess(false);
        }
      } finally {
        if (mounted) {
          setIsChecking(false); // Luôn luôn chạy để tắt màn hình loading
        }
      }
    }

    verifyAuth();

    return () => {
      mounted = false;
    };
  }, [checkAuth]);

  if (isChecking) {
    return <div>Đang kiểm tra đăng nhập...</div>;
  }

  if (!canAccess) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
