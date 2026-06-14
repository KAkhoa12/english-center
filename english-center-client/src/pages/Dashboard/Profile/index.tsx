import { Mail, ShieldCheck, UserRound } from "lucide-react";

import { DashboardListPageHeader, SectionCard } from "@/components/Dashboard/Comon";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/services/auth/auth.store";

export default function DashboardProfilePage() {
  const me = useAuthStore((state) => state.me);
  const user = me?.user;
  const roles = me?.roles ?? [];

  return (
    <section>
      <DashboardListPageHeader
        title="Thông tin cá nhân"
        description="Thông tin tài khoản đang đăng nhập"
      />

      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionCard title="Tài khoản">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-brand-50 text-brand-600">
              <UserRound className="h-10 w-10" />
            </div>
            <h2 className="mt-4 text-xl font-bold text-gray-950">{user?.full_name ?? "Tài khoản"}</h2>
            <p className="mt-1 text-sm text-gray-500">{user?.email ?? "Chưa có email"}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {roles.length ? roles.map((role) => (
                <Badge key={role} variant="outline" className="border-brand-100 bg-brand-50 text-brand-700">
                  {role}
                </Badge>
              )) : <Badge variant="outline">Chưa có vai trò</Badge>}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Chi tiết">
          <div className="grid gap-3">
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <p className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                <UserRound className="h-4 w-4" />
                Họ tên
              </p>
              <p className="font-semibold text-gray-900">{user?.full_name ?? "-"}</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <p className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                <Mail className="h-4 w-4" />
                Email
              </p>
              <p className="font-semibold text-gray-900">{user?.email ?? "-"}</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <p className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                <ShieldCheck className="h-4 w-4" />
                Vai trò
              </p>
              <p className="font-semibold text-gray-900">{roles.length ? roles.join(", ") : "-"}</p>
            </div>
          </div>
        </SectionCard>
      </div>
    </section>
  );
}
