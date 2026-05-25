import {
  BookOpen,
  Camera,
  ChevronDown,
  Globe2,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Play,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/services/auth/auth.store";
const navItems = [
  { href: "#about", label: "Về chúng tôi", type: "anchor" as const },
  { href: "/courses", label: "Khóa học", type: "route" as const },
  { href: "#teachers", label: "Giáo viên", type: "anchor" as const },
  { href: "#testimonials", label: "Học viên", type: "anchor" as const },
  { href: "#contact", label: "Liên hệ", type: "anchor" as const },
];

const footerGroups = [
  {
    title: "Khóa học",
    links: [
      "Tiếng Anh Trẻ Em",
      "Tiếng Anh Thiếu Niên",
      "Luyện Thi IELTS",
      "Giao Tiếp Ứng Dụng",
      "Tiếng Anh Thương Mại",
      "Luyện Thi TOEIC",
    ],
  },
  {
    title: "Hỗ trợ",
    links: [
      "Câu hỏi thường gặp",
      "Chính sách hoàn phí",
      "Hướng dẫn đăng ký",
      "Lịch khai giảng",
      "Tuyển dụng",
    ],
  },
  {
    title: "Cơ sở",
    links: [
      "Q.1 - 123 Nguyễn Huệ",
      "Q.7 - 456 Nguyễn Văn Linh",
      "Q.3 - 789 Võ Văn Tần",
      "Q. Bình Thạnh - 321 Xô Viết Nghệ Tĩnh",
    ],
  },
];

function BrandLogo({ dark = false }: { dark?: boolean }) {
  return (
    <a href="#" className="flex items-center gap-2">
      <div className="course-badge flex h-10 w-10 items-center justify-center rounded-xl">
        <BookOpen className="h-6 w-6 text-white" />
      </div>
      <span className={`text-xl font-bold ${dark ? "text-white" : "text-gray-900"}`}>
        Star
        <span className={dark ? "text-brand-400" : "text-brand-500"}>
          English
        </span>
      </span>
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
                  onClick={() => navigate("/me")}
                  className="cursor-pointer rounded-lg px-3 py-2 text-gray-700 focus:bg-brand-50 focus:text-brand-700"
                >
                  <User className="mr-2 h-4 w-4" />
                  Thông tin
                </DropdownMenuItem>
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
    <footer className="bg-gray-900 pb-8 pt-16 text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-5">
              <BrandLogo dark />
            </div>
            <p className="mb-6 text-sm leading-relaxed text-gray-400">
              Trung tâm tiếng Anh hàng đầu với phương pháp học tập hiện đại,
              giúp bạn tự tin giao tiếp và đạt chứng chỉ quốc tế.
            </p>
            <div className="flex gap-3">
              {[Globe2, Camera, Play].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  aria-label="Mạng xã hội StarEnglish"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 transition-colors hover:bg-brand-500"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title}>
              <h4 className="mb-5 font-semibold">{group.title}</h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-gray-400 transition-colors hover:text-brand-400"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-gray-500">
            © 2025 StarEnglish. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-xs text-gray-500 transition-colors hover:text-gray-300"
            >
              Điều khoản sử dụng
            </a>
            <a
              href="#"
              className="text-xs text-gray-500 transition-colors hover:text-gray-300"
            >
              Chính sách bảo mật
            </a>
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
    </div>
  );
}
