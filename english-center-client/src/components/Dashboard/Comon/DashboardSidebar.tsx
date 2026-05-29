import {
  Award,
  BarChart3,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  FileText,
  GraduationCap,
  LayoutDashboard,
  MessageCircle,
  Settings,
  ShieldCheck,
  Users,
  UserSquare2,
} from "lucide-react";
import { type ComponentType, useState } from "react";
import { NavLink } from "react-router-dom";
import { PRIVATE_ROUTES } from "@/shared/routes";
import { DashboardBrand } from "./DashboardBrand";

type DashboardSidebarProps = {
  className?: string;
};

type NavChildItem = {
  label: string;
  href: string;
};

type NavItem = {
  label: string;
  icon: ComponentType<{ className?: string }>;
  href?: string;
  children?: NavChildItem[];
};

const navItems: NavItem[] = [
  { label: "Tổng quan", icon: LayoutDashboard, href: PRIVATE_ROUTES.DASHBOARD },
  {
    label: "Lớp học",
    icon: Users,
    children: [
      { label: "Danh sách khóa học", href: PRIVATE_ROUTES.DASHBOARD_COURSES },
      { label: "Quản lý lớp học", href: PRIVATE_ROUTES.DASHBOARD_CLASSES },
      { label: "Danh sách loại khóa học", href: PRIVATE_ROUTES.DASHBOARD_COURSE_CATEGORIES },
      { label: "Danh sách tag khóa học", href: PRIVATE_ROUTES.DASHBOARD_COURSE_TAGS },
    ],
  },
  {
    label: "Tài chính",
    icon: CircleDollarSign,
    children: [
      { label: "Thu chi", href: PRIVATE_ROUTES.DASHBOARD_FINANCE_CASHFLOW },
      { label: "Hóa đơn", href: PRIVATE_ROUTES.DASHBOARD_FINANCE_INVOICES },
    ],
  },
  {
    label: "Tài nguyên",
    icon: FileText,
    children: [{ label: "Quản lý tài liệu", href: PRIVATE_ROUTES.DASHBOARD_DOCUMENTS }],
  },
  {
    label: "Nhân viên",
    icon: ShieldCheck,
    children: [
      { label: "Quản lý nhân viên", href: PRIVATE_ROUTES.DASHBOARD_STAFF },
      { label: "Quản lý quyền", href: PRIVATE_ROUTES.DASHBOARD_PERMISSIONS },
      { label: "Quản lý vai trò", href: PRIVATE_ROUTES.DASHBOARD_ROLES },
    ],
  },
  {
    label: "Học viên",
    icon: UserSquare2,
    children: [
      { label: "Danh sách học viên", href: PRIVATE_ROUTES.DASHBOARD_STUDENTS },
      { label: "Điểm danh", href: PRIVATE_ROUTES.DASHBOARD_ATTENDANCE },
      { label: "Bài tập", href: PRIVATE_ROUTES.DASHBOARD_ASSIGNMENTS },
    ],
  },
  {
    label: "Giảng viên",
    icon: GraduationCap,
    children: [
      { label: "Danh sách giảng viên", href: PRIVATE_ROUTES.DASHBOARD_TEACHERS },
      { label: "Lịch giảng dạy", href: PRIVATE_ROUTES.DASHBOARD_TEACHING_SCHEDULE },
    ],
  },
  { label: "Lịch học", icon: CalendarDays },
  { label: "Bài tập", icon: FileText },
  { label: "Kết quả", icon: BarChart3 },
  { label: "Chứng chỉ", icon: Award },
  { label: "Tin nhắn", icon: MessageCircle },
];

export const DashboardSidebar = ({
  className = "hidden lg:block",
}: DashboardSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`${className} sticky top-0 h-screen shrink-0 overflow-y-auto border-r border-gray-100 bg-white px-4 py-6 transition-all ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        {!collapsed && <DashboardBrand />}
        <button
          type="button"
          aria-label={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
          onClick={() => setCollapsed((prev) => !prev)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition-all hover:bg-gray-50 hover:text-gray-900"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      <nav className="mt-10 space-y-1">
        {navItems.map(({ label, icon: Icon, href, children }) =>
          children ? (
            <details key={label} className="group" open>
              <summary
                className={`list-none rounded-2xl px-4 py-3 text-sm font-semibold text-gray-500 transition-all hover:bg-gray-50 hover:text-gray-900 ${
                  collapsed
                    ? "flex items-center justify-center"
                    : "flex items-center justify-between"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-5 w-5" />
                  {!collapsed && label}
                </span>
                {!collapsed && (
                  <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                )}
              </summary>
              {!collapsed && (
                <div className="mt-1 space-y-1 pl-7">
                {children.map((child) => (
                  <NavLink
                    key={child.label}
                    to={child.href}
                    className={({ isActive }) =>
                      `block rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                        isActive
                          ? "bg-brand-50 text-brand-700"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                      }`
                    }
                  >
                    {child.label}
                  </NavLink>
                ))}
              </div>
            )}
          </details>
        ) : (
            <NavLink
              key={label}
              to={href ?? "#"}
              end={href === PRIVATE_ROUTES.DASHBOARD}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-brand-50 text-brand-600 shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                } ${collapsed ? "justify-center" : ""}`
              }
            >
              <Icon className="h-5 w-5" />
              {!collapsed && label}
            </NavLink>
          )
        )}
      </nav>

      {!collapsed && (
        <div className="mt-10 rounded-3xl bg-gray-950 p-5 text-white">
          <div className="text-sm font-semibold">IELTS Intensive</div>
          <p className="mt-2 text-xs leading-relaxed text-white/60">
            Mục tiêu band 7.0 đang đi đúng tiến độ. Còn 18 buổi để hoàn thành lộ
            trình.
          </p>
          <div className="mt-4 h-2 rounded-full bg-white/10">
            <div className="h-full w-[72%] rounded-full bg-accent-400" />
          </div>
        </div>
      )}

      <a
        href="#"
        className={`mt-6 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-500 transition-all hover:bg-gray-50 hover:text-gray-900 ${
          collapsed ? "justify-center" : ""
        }`}
      >
        <Settings className="h-5 w-5" />
        {!collapsed && "Cài đặt"}
      </a>
    </aside>
  );
};
