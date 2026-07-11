import {
  Award,
  BarChart3,
  BookOpen,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  FileText,
  GraduationCap,
  LayoutDashboard,
  MessageCircle,
  PackageOpen,
  ShieldCheck,
  UserRound,
  UserSquare2,
} from "lucide-react";
import { type ComponentType, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "@/services/auth/auth.store";
import { canAccess, type AccessRule } from "@/shared/auth/rbac";
import { PRIVATE_ROUTES } from "@/shared/routes";
import { DashboardBrand } from "./DashboardBrand";

type DashboardSidebarProps = {
  className?: string;
};

type NavChildItem = AccessRule & {
  label: string;
  href: string;
};

type NavItem = AccessRule & {
  label: string;
  icon: ComponentType<{ className?: string }>;
  href?: string;
  children?: NavChildItem[];
};

const navItems: NavItem[] = [
  {
    label: "Tổng quan",
    icon: LayoutDashboard,
    href: PRIVATE_ROUTES.DASHBOARD,
    allowedRoles: ["admin", "staff", "teacher", "student"],
  },
  {
    label: "Khóa học tại trung tâm",
    icon: BookOpen,
    allowedRoles: ["admin", "staff", "teacher"],
    children: [
      {
        label: "Danh sách khóa học",
        href: PRIVATE_ROUTES.DASHBOARD_CENTER_COURSES,
        allowedRoles: ["admin", "staff", "teacher"],
        requiredPermissions: ["course.create", "course.update", "course.delete"],
      },
      {
        label: "Danh sách lớp học",
        href: PRIVATE_ROUTES.DASHBOARD_CLASSES,
        allowedRoles: ["admin", "staff", "teacher"],
        requiredPermissions: ["class.read"],
      },
      {
        label: "Buổi học",
        href: PRIVATE_ROUTES.DASHBOARD_SESSIONS,
        allowedRoles: ["admin", "teacher"],
        requiredPermissions: ["class_session.read"],
      },
      {
        label: "Thống kê",
        href: PRIVATE_ROUTES.DASHBOARD_CENTER_COURSES_STATISTICS,
        allowedRoles: ["admin", "staff"],
      },
    ],
  },
  {
    label: "Khóa học có sẵn",
    icon: BookOpen,
    allowedRoles: ["admin", "staff"],
    children: [
      {
        label: "Danh sách khóa học",
        href: PRIVATE_ROUTES.DASHBOARD_TEMPLATE_COURSES,
        allowedRoles: ["admin", "staff"],
        requiredPermissions: ["course.create", "course.update", "course.delete"],
      },
      {
        label: "Thống kê",
        href: PRIVATE_ROUTES.DASHBOARD_TEMPLATE_COURSES_STATISTICS,
        allowedRoles: ["admin", "staff"],
      },
    ],
  },
  {
    label: "Quản lý chung",
    icon: PackageOpen,
    allowedRoles: ["admin", "staff"],
    children: [
      {
        label: "Quản lý loại khóa học",
        href: PRIVATE_ROUTES.DASHBOARD_COURSE_CATEGORIES,
        allowedRoles: ["admin", "staff"],
        requiredPermissions: ["course_category.read"],
      },
      {
        label: "Quản lý tag khóa học",
        href: PRIVATE_ROUTES.DASHBOARD_COURSE_TAGS,
        allowedRoles: ["admin", "staff"],
        requiredPermissions: ["course_tag.read"],
      },
      {
        label: "Quản lý loại bài tập",
        href: PRIVATE_ROUTES.DASHBOARD_ASSIGNMENT_TYPES,
        allowedRoles: ["admin", "staff"],
        requiredPermissions: ["assignment_type.read"],
      },
      {
        label: "Quản lý phòng học",
        href: PRIVATE_ROUTES.DASHBOARD_ROOMS,
        allowedRoles: ["admin", "staff"],
        requiredPermissions: ["room.read"],
      },
    ],
  },
  {
    label: "Tài chính",
    icon: CircleDollarSign,
    allowedRoles: ["admin", "staff"],
    children: [
      {
        label: "Thu chi",
        href: PRIVATE_ROUTES.DASHBOARD_FINANCE_CASHFLOW,
        allowedRoles: ["admin", "staff"],
        requiredPermissions: ["order.read", "payment.read"],
      },
      {
        label: "Hóa đơn",
        href: PRIVATE_ROUTES.DASHBOARD_FINANCE_INVOICES,
        allowedRoles: ["admin", "staff"],
        requiredPermissions: ["invoice.read", "order.read"],
      },
    ],
  },
  {
    label: "Tài nguyên",
    icon: FileText,
    allowedRoles: ["admin", "staff", "teacher"],
    children: [
      {
        label: "Quản lý tài liệu",
        href: PRIVATE_ROUTES.DASHBOARD_DOCUMENTS,
        allowedRoles: ["admin", "staff", "teacher"],
      },
    ],
  },
  {
    label: "Nhân viên",
    icon: ShieldCheck,
    allowedRoles: ["admin", "staff"],
    children: [
      {
        label: "Quản lý nhân viên",
        href: PRIVATE_ROUTES.DASHBOARD_STAFF,
        allowedRoles: ["admin", "staff"],
        requiredPermissions: ["staff.read"],
      },
      {
        label: "Quản lý quyền",
        href: PRIVATE_ROUTES.DASHBOARD_PERMISSIONS,
        allowedRoles: ["admin", "staff"],
        requiredPermissions: ["permission.read"],
      },
      {
        label: "Quản lý vai trò",
        href: PRIVATE_ROUTES.DASHBOARD_ROLES,
        allowedRoles: ["admin", "staff"],
        requiredPermissions: ["role.read"],
      },
    ],
  },
  {
    label: "Học viên",
    icon: UserSquare2,
    allowedRoles: ["admin", "staff", "teacher"],
    children: [
      {
        label: "Danh sách học viên",
        href: PRIVATE_ROUTES.DASHBOARD_STUDENTS,
        allowedRoles: ["admin", "staff", "teacher"],
        requiredPermissions: ["student.read"],
      },
      {
        label: "Điểm danh",
        href: PRIVATE_ROUTES.DASHBOARD_ATTENDANCE,
        allowedRoles: ["admin", "staff", "teacher"],
        requiredPermissions: ["attendance.read"],
      },
      {
        label: "Bài tập",
        href: PRIVATE_ROUTES.DASHBOARD_ASSIGNMENTS,
        allowedRoles: ["admin", "staff", "teacher"],
        requiredPermissions: ["assignment.read"],
      },
    ],
  },
  {
    label: "Giảng viên",
    icon: GraduationCap,
    allowedRoles: ["admin", "staff", "teacher"],
    children: [
      {
        label: "Danh sách giảng viên",
        href: PRIVATE_ROUTES.DASHBOARD_TEACHERS,
        allowedRoles: ["admin", "staff"],
        requiredPermissions: ["teacher.read"],
      },
      {
        label: "Lịch giảng dạy",
        href: PRIVATE_ROUTES.DASHBOARD_TEACHING_SCHEDULE,
        allowedRoles: ["admin", "staff", "teacher"],
        requiredPermissions: ["class_session.read"],
      },
    ],
  },
  {
    label: "Lịch học",
    icon: CalendarDays,
    href: PRIVATE_ROUTES.DASHBOARD_SCHEDULE,
    allowedRoles: ["student"],
  },
  {
    label: "Bài tập",
    icon: FileText,
    href: PRIVATE_ROUTES.DASHBOARD_ASSIGNMENTS,
    allowedRoles: ["student"],
  },
  {
    label: "Kết quả",
    icon: BarChart3,
    href: PRIVATE_ROUTES.DASHBOARD_RESULTS,
    allowedRoles: ["student"],
  },
  {
    label: "Chứng chỉ",
    icon: Award,
    href: PRIVATE_ROUTES.DASHBOARD_CERTIFICATES,
    allowedRoles: ["student"],
  },
  {
    label: "Tin nhắn",
    icon: MessageCircle,
    href: PRIVATE_ROUTES.DASHBOARD_MESSAGES,
    allowedRoles: ["admin", "staff", "teacher", "student"],
  },
  {
    label: "Khách vãng lai",
    icon: UserRound,
    href: PRIVATE_ROUTES.DASHBOARD_GUEST_ENROLLMENTS,
    allowedRoles: ["admin"],
  },
  {
    label: "Cá nhân",
    icon: UserRound,
    allowedRoles: ["admin", "staff", "teacher", "student"],
    children: [
      {
        label: "Thông tin",
        href: PRIVATE_ROUTES.DASHBOARD_PROFILE,
        allowedRoles: ["admin", "staff", "teacher", "student"],
      },
      {
        label: "Khóa học của tôi",
        href: PRIVATE_ROUTES.DASHBOARD_MY_COURSES,
        allowedRoles: ["admin", "staff", "teacher", "student"],
      },
      {
        label: "Hóa đơn của tôi",
        href: PRIVATE_ROUTES.DASHBOARD_MY_INVOICES,
        allowedRoles: ["admin", "staff", "teacher", "student"],
      },
    ],
  },
];

export const DashboardSidebar = ({
  className = "hidden lg:block",
}: DashboardSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const me = useAuthStore((state) => state.me);

  const visibleNavItems = navItems
    .map((item) => ({
      ...item,
      children: item.children?.filter((child) => canAccess(me, child)),
    }))
    .filter((item) => canAccess(me, item) && (!item.children || item.children.length > 0));

  return (
    <aside
      className={`${className} sticky top-0 h-screen shrink-0 overflow-y-auto border-r border-line-soft bg-white transition-all duration-300 scrollbar-hidden ${
        collapsed ? "w-[72px] px-2" : "w-72 px-4"
      } py-5`}
    >
      <div className="flex items-center justify-between gap-2 px-1">
        {!collapsed && <DashboardBrand />}
        <button
          type="button"
          aria-label={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
          onClick={() => setCollapsed((prev) => !prev)}
          title={collapsed ? "Mở rộng" : "Thu gọn"}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-all hover:bg-surface-soft hover:text-ink"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      <div className="mx-1 my-4 h-px bg-line-soft" />

      <nav className="space-y-1 px-1">
        {visibleNavItems.map(({ label, icon: Icon, href, children }) =>
          children ? (
            <details key={label} className="group" open>
              <summary
                className={`list-none rounded-xl px-3 py-2 text-[13px] font-semibold text-muted transition-all hover:bg-surface-soft hover:text-ink ${
                  collapsed
                    ? "flex items-center justify-center"
                    : "flex items-center justify-between"
                }`}
                title={collapsed ? label : undefined}
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-[18px] w-[18px]" />
                  {!collapsed && <span>{label}</span>}
                </span>
                {!collapsed && (
                  <ChevronDown className="h-3.5 w-3.5 text-faint transition-transform duration-200 group-open:rotate-180" />
                )}
              </summary>
              {!collapsed && (
                <div className="mt-1 space-y-0.5 pl-3">
                  <div className="ml-2 h-4 w-px bg-line-soft" />
                  {children.map((child) => (
                    <NavLink
                      key={child.label}
                      to={child.href}
                      className={({ isActive }) =>
                        `relative block rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-mint/10 text-mint-deep font-semibold"
                            : "text-muted hover:bg-surface-soft hover:text-ink"
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
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-mint/10 text-mint-deep shadow-[0_0_0_1px_rgb(0_212_164/0.15)]"
                    : "text-muted hover:bg-surface-soft hover:text-ink"
                } ${collapsed ? "justify-center" : ""}`
              }
            >
              <Icon className="h-[18px] w-[18px]" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          )
        )}
      </nav>
    </aside>
  );
};
