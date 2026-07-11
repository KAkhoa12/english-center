import { Bell, Bot, ChevronDown, Home, LogOut, Menu, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/services/auth/auth.store";
import { DashboardAiChatSheet } from "./DashboardAiChatSheet";
import { DashboardBrand } from "./DashboardBrand";

type DashboardHeaderProps = {
  onOpenSidebar: () => void;
};

export const DashboardHeader = ({ onOpenSidebar }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const [aiOpen, setAiOpen] = useState(false);
  const infoUser = useAuthStore((state) => state.me);
  const logout = useAuthStore((state) => state.logout);
  const displayName =
    infoUser?.user.full_name ??
    (infoUser as { user?: { full_name?: string } } | null)?.user?.full_name ??
    "Tài khoản";

  return (
    <header className="sticky top-0 z-30 border-b border-line-soft bg-white/90 px-4 py-3.5 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 lg:hidden">
          <button
            type="button"
            aria-label="Mở menu dashboard"
            onClick={onOpenSidebar}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line-soft bg-white text-muted transition-all hover:bg-surface-soft hover:text-ink"
          >
            <Menu className="h-5 w-5" />
          </button>
          <DashboardBrand />
        </div>

        <div className="hidden lg:block">
          <p className="text-[13px] font-medium text-caption">
            Xin chào, <span className="text-ink">{displayName}</span>
          </p>
          <h1 className="mt-0.5 text-[22px] font-bold tracking-tight text-ink">
            Dashboard học tập
          </h1>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2.5">
          {/* Search */}
          <label className="hidden w-full max-w-sm items-center gap-2 rounded-full border border-line-soft bg-surface-soft/60 px-4 py-2.5 text-sm text-faint transition-all focus-within:border-mint focus-within:ring-4 focus-within:ring-mint/15 md:flex">
            <Search className="h-4 w-4 shrink-0" />
            <input
              type="search"
              placeholder="Tìm lớp học, bài tập..."
              className="w-full border-none bg-transparent p-0 text-sm text-body outline-none placeholder:text-faint"
            />
          </label>

          {/* Notification */}
          <button
            type="button"
            aria-label="Thông báo"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-line-soft bg-white text-muted transition-all hover:bg-surface-soft hover:text-ink"
          >
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-coral ring-2 ring-white" />
          </button>

          {/* AI Chat */}
          <button
            type="button"
            aria-label="Mở trợ lý AI"
            onClick={() => setAiOpen(true)}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-mint/20 bg-mint/10 text-mint-deep transition-all hover:bg-mint/20"
          >
            <Bot className="h-[18px] w-[18px]" />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="hidden items-center gap-2.5 rounded-full border border-line-soft bg-white py-1.5 pl-1.5 pr-3 transition-all hover:bg-surface-soft sm:flex"
              >
                <img
                  src="https://picsum.photos/seed/dashboard-user/96/96.jpg"
                  alt={displayName}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <span className="text-[13px] font-semibold text-ink">{displayName}</span>
                <ChevronDown className="h-3.5 w-3.5 text-faint" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              {/* User info header */}
              <div className="px-3 py-2.5">
                <p className="text-[13px] font-semibold text-ink truncate">{displayName}</p>
                <p className="text-[11px] text-caption truncate">
                  {infoUser?.user?.email ?? "—"}
                </p>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => navigate("/")}
                className="cursor-pointer"
              >
                <Home className="h-4 w-4 text-faint" />
                Quay về trang chủ
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={async () => {
                  await logout();
                  navigate("/");
                }}
                className="cursor-pointer text-coral hover:bg-coral/10 hover:text-coral focus:bg-coral/10 focus:text-coral"
              >
                <LogOut className="h-4 w-4" />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>
      <DashboardAiChatSheet open={aiOpen} onOpenChange={setAiOpen} />
    </header>
  );
};
