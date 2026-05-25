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
      const result = await checkAuth();

      if (mounted) {
        setCanAccess(result);
        setIsChecking(false);
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
