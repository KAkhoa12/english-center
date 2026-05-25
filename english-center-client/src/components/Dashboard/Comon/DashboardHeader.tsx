import { Bell, ChevronDown, Home, LogOut, Menu, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/services/auth/auth.store";
import { DashboardBrand } from "./DashboardBrand";

type DashboardHeaderProps = {
  onOpenSidebar: () => void;
};

export const DashboardHeader = ({ onOpenSidebar }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const infoUser = useAuthStore((state) => state.me);
  const logout = useAuthStore((state) => state.logout);
  const displayName =
    infoUser?.user.full_name ??
    (infoUser as { user?: { full_name?: string } } | null)?.user?.full_name ??
    "Tài khoản";

  return (
    <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/85 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 lg:hidden">
          <button
            type="button"
            aria-label="Mở menu dashboard"
            onClick={onOpenSidebar}
            className="rounded-2xl border border-gray-100 bg-white p-2.5 text-gray-700 shadow-sm"
          >
            <Menu className="h-5 w-5" />
          </button>
          <DashboardBrand />
        </div>

        <div className="hidden lg:block">
          <p className="text-sm font-medium text-gray-400">Xin chào, {displayName}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-950">
            Dashboard học tập
          </h1>
        </div>

        <div className="flex flex-1 items-center justify-end gap-3">
          <label className="hidden w-full max-w-sm items-center gap-2 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-400 md:flex">
            <Search className="h-4 w-4" />
            <input
              type="search"
              placeholder="Tìm lớp học, bài tập..."
              className="w-full border-none bg-transparent p-0 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:shadow-none"
            />
          </label>

          <button
            type="button"
            aria-label="Thông báo"
            className="relative rounded-2xl border border-gray-100 bg-white p-3 text-gray-600 shadow-sm transition-colors hover:text-brand-600"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-coral-500" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="hidden items-center gap-3 rounded-2xl border border-gray-100 bg-white py-2 pl-2 pr-3 shadow-sm sm:flex"
              >
                <img
                  src="https://picsum.photos/seed/dashboard-user/96/96.jpg"
                  alt={displayName}
                  className="h-9 w-9 rounded-xl object-cover"
                />
                <span className="text-sm font-semibold text-gray-800">{displayName}</span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 rounded-xl border border-gray-100 bg-white p-1.5 shadow-lg"
            >
              <DropdownMenuItem
                onClick={() => navigate("/")}
                className="cursor-pointer rounded-lg px-3 py-2 text-gray-700 focus:bg-brand-50 focus:text-brand-700"
              >
                <Home className="mr-2 h-4 w-4" />
                Quay về trang chủ
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1 bg-gray-100" />
              <DropdownMenuItem
                onClick={async () => {
                  await logout();
                  navigate("/");
                }}
                className="cursor-pointer rounded-lg px-3 py-2 text-red-600 focus:bg-red-50 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
