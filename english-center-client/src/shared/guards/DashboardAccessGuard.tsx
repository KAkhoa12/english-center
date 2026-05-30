import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuthStore } from "@/services/auth/auth.store";
import { canAccess, type AccessRule } from "@/shared/auth/rbac";

type DashboardAccessGuardProps = AccessRule & {
  children: ReactNode;
};

export default function DashboardAccessGuard({
  children,
  ...rule
}: DashboardAccessGuardProps) {
  const me = useAuthStore((state) => state.me);

  if (!canAccess(me, rule)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
