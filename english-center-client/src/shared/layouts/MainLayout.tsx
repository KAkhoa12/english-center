import {
  BookOpen,
  ChevronDown,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  ShoppingCart,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import ChatbotPopup from "@/components/Comon/ChatbotPopup";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/services/auth/auth.store";
import logo from "@/assets/logo.svg";
const navItems = [
  { href: "/", label: "Trang chủ", type: "route" as const },
  { href: "/courses", label: "Khóa học", type: "route" as const },
];

function BrandLogo() {
  return (
    <a href="#" className="flex items-center gap-2">
      <div className="course-badge flex h-10 w-10 items-center justify-center rounded-xl">
        <BookOpen className="h-6 w-6 text-white" />
      </div>
      <img src={logo} alt="Logo" className="h-10 w-10" />
    </a>
  );
}

function scrollToAnchor(
  event: MouseEvent<HTMLAnchorElement>,
  href: string,
  onAfterScroll?: () => void,
) {
  if (!href.startsWith("#") || href === "#") return;

  event.preventDefault();
  document.querySelector(href)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
  onAfterScroll?.();
}

function Header() {
  const navigate = useNavigate();
  const infoUser = useAuthStore((state) => state.me);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const displayName =
    infoUser?.user.full_name ??
    (infoUser as { user?: { full_name?: string } } | null)?.user?.full_name ??
    "Tài khoản";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`nav-blur fixed left-0 right-0 top-0 z-50 border-b border-gray-100 bg-white/80 transition-all duration-300 ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <BrandLogo />

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(event) => {
                if (item.type === "route") {
                  event.preventDefault();
                  navigate(item.href);
                  return;
                }
                scrollToAnchor(event, item.href);
              }}
              className="text-sm font-medium text-gray-600 transition-colors hover:text-brand-600"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:border-brand-200 hover:bg-brand-50/60"
                >
                  <span>{displayName}</span>
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
                  Dashboard
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
                className="px-4 py-2 text-sm font-medium text-brand-600 transition-colors hover:text-brand-700"
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="rounded-full bg-brand-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-brand-500/25 transition-all hover:bg-brand-600 hover:shadow-brand-500/40"
              >
                Đăng ký ngay
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label="Mở menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
          className="rounded-lg p-2 transition-colors hover:bg-gray-100 md:hidden"
        >
          {menuOpen ? (
            <X className="h-6 w-6 text-gray-700" />
          ) : (
            <Menu className="h-6 w-6 text-gray-700" />
          )}
        </button>
      </div>

      {menuOpen ? (
        <div className="nav-blur border-t border-gray-100 bg-white/95 md:hidden">
          <div className="flex flex-col gap-3 px-6 py-4">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(event) => {
                  if (item.type === "route") {
                    event.preventDefault();
                    navigate(item.href);
                    setMenuOpen(false);
                    return;
                  }
                  scrollToAnchor(event, item.href, () => setMenuOpen(false));
                }}
                className="py-2 text-sm font-medium text-gray-600 hover:text-brand-600"
              >
                {item.label}
              </a>
            ))}
            <hr className="my-2 border-gray-100" />
            {isAuthenticated ? (
              <>
                <p className="py-1 text-sm font-semibold text-gray-700">{displayName}</p>
                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    navigate("/");
                    setMenuOpen(false);
                  }}
                  className="w-full rounded-full border border-gray-200 px-5 py-2.5 text-center text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    navigate("/login");
                    setMenuOpen(false);
                  }}
                  className="w-full rounded-full border border-brand-200 px-5 py-2.5 text-center text-sm font-medium text-brand-700 transition-all hover:bg-brand-50"
                >
                  Đăng nhập
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigate("/register");
                    setMenuOpen(false);
                  }}
                  className="w-full rounded-full bg-brand-500 px-5 py-2.5 text-center text-sm font-medium text-white transition-all hover:bg-brand-600"
                >
                  Đăng ký ngay
                </button>
              </>
            )}
          </div>
        </div>
      ) : null}
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-ink pt-20 pb-10 text-white">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="mb-14 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2">
            <a href="#" className="mb-4 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
                <span className="text-sm font-bold leading-none text-mint">F</span>
              </div>
              <span className="text-[15px] font-semibold">FluentUp English</span>
            </a>
            <p className="max-w-xs text-[14px] leading-relaxed text-white/60">Học đúng lộ trình. Tiến bộ mỗi ngày.</p>
            <div className="mt-6 flex items-center gap-3">
              {["Facebook", "YouTube", "TikTok", "Instagram"].map((label) => (
                <a
                  key={label}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-[11px] font-semibold text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                  aria-label={label}
                >
                  {label.slice(0, 1)}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="mb-4 text-[13px] font-semibold">Khóa học</h4>
            <ul className="space-y-2.5 text-[13px] text-white/60">
              {["Foundation", "Communication", "IELTS", "Business English"].map((item) => (
                <li key={item}>
                  <a href="#" className="transition-colors hover:text-white">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-[13px] font-semibold">Học tập</h4>
            <ul className="space-y-2.5 text-[13px] text-white/60">
              {["Kiểm tra trình độ", "Lộ trình học", "Học online", "Tài nguyên"].map((item) => (
                <li key={item}>
                  <a href="#" className="transition-colors hover:text-white">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-[13px] font-semibold">Về FluentUp</h4>
            <ul className="space-y-2.5 text-[13px] text-white/60">
              {["Giáo viên", "Câu chuyện học viên", "Tuyển dụng", "Liên hệ"].map((item) => (
                <li key={item}>
                  <a href="#" className="transition-colors hover:text-white">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-[13px] font-semibold">Hỗ trợ</h4>
            <ul className="space-y-2.5 text-[13px] text-white/60">
              {["Trung tâm trợ giúp", "Chính sách học phí", "Điều khoản", "Bảo mật"].map((item) => (
                <li key={item}>
                  <a href="#" className="transition-colors hover:text-white">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-[13px] text-white/50">© 2026 FluentUp English. All rights reserved.</p>
          <div className="flex items-center gap-2 text-[12px] text-white/40">
            <span className="h-2 w-2 rounded-full bg-mint" />
            Hoạt động bình thường · Tất cả hệ thống đang ổn định
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function MainLayout() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-sans text-gray-800">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ChatbotPopup />
    </div>
  );
}
