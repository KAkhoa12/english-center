import { ChevronDown, Heart, LayoutDashboard, LogOut, Menu, ShoppingCart } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.svg"
import { useAuthStore } from "@/services/auth/auth.store";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
const navItems = [
  { href: "/", label: "Trang chủ" },
  { href: "/courses", label: "Khóa học"}
];


export default function Header({ isScrolled, mobileOpen, onToggleMobile }: { isScrolled: boolean; mobileOpen: boolean; onToggleMobile: () => void }) {
  const navigate = useNavigate();
  const infoUser = useAuthStore((state) => state.me);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  return (
    <header
      id="navbar"
      className={`fixed inset-x-0 top-0 z-50 border-b border-line-soft backdrop-blur-md transition-[background-color,box-shadow] duration-200 ${
        isScrolled ? "bg-white/[0.92] shadow-navbar" : "bg-white/80"
      }`}
    >
      <div className="mx-auto flex h-16 w-full container items-center justify-between ">
        <Link to="/" className="flex items-center ">
          <img src={logo} alt="FluentUp English" className="h-10 w-10" />
          <span className="text-[15px] font-semibold text-ink">du English</span>
        </Link>

        <nav className="hidden items-center gap-8 text-[14px] lg:flex">
          {navItems.map((item) => (
            <span key={item.href} onClick={() => navigate(item.href)} className="text-muted cursor-pointer transition-colors hover:text-ink">
              {item.label}
            </span>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:border-brand-200 hover:bg-brand-50/60"
                >
                  <span>{infoUser?.user.full_name}</span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 rounded-xl border border-gray-100 bg-white p-1.5 shadow-lg"
              >
                <DropdownMenuItem
                  onClick={() => navigate("/cart")}
                  className="cursor-pointer rounded-lg px-3 py-2 text-gray-700 focus:bg-brand-50 focus:text-brand-700"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Giỏ hàng
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/wishlist")}
                  className="cursor-pointer rounded-lg px-3 py-2 text-gray-700 focus:bg-brand-50 focus:text-brand-700"
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Yêu thích
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/dashboard")}
                  className="cursor-pointer rounded-lg px-3 py-2 text-gray-700 focus:bg-brand-50 focus:text-brand-700"
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Quản trị
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
          ) : (
            <>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="px-4 py-2 text-sm border border-mint rounded-3xl cursor-pointer font-medium text-brand-600 transition-colors hover:text-brand-700"
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="rounded-full bg-mint px-5 py-2.5 text-sm cursor-pointer font-medium text-black shadow-lg shadow-brand-500/25 transition-all hover:bg-brand-600 hover:shadow-brand-500/40"
              >
                Đăng ký ngay
              </button>
            </>
          )}

          <button type="button" className="-mr-2 p-2 lg:hidden" aria-label="Mở menu" aria-expanded={mobileOpen} onClick={onToggleMobile}>
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className={`overflow-hidden border-t border-line-soft bg-white transition-[max-height] duration-300 lg:hidden ${mobileOpen ? "max-h-[400px]" : "max-h-0"}`}>
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-5 py-4 sm:px-8" onClick={onToggleMobile}>
          {navItems.map((item) => (
            <span key={item.href} onClick={()=>navigate(item.href)} className="py-2.5 text-sm text-body">
              {item.label}
            </span>
          ))}
          <a href="#" className="py-2.5 text-sm text-muted">
            Đăng nhập
          </a>
        </div>
      </div>
    </header>
  );
}
