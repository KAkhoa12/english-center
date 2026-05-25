import type { RouteObject } from "react-router-dom";

import PrivateRoute from "@/shared/guards/PrivateRoute";
import DashboardLayout from "@/shared/layouts/DashboardLayout";
import MainLayout from "@/shared/layouts/MainLayout";
import CartPage from "@/pages/Cart";
import DashboardCourseCategoriesPage from "@/pages/Dashboard/CourseCategories";
import DashboardCoursesPage from "@/pages/Dashboard/Courses";
import DashboardCourseCreatePage from "@/pages/Dashboard/Courses/Create";
import DashboardCourseEditPage from "@/pages/Dashboard/Courses/Edit";
import DashboardCourseTagsPage from "@/pages/Dashboard/CourseTags";
import DashboardHomePage from "@/pages/Dashboard/Home";
import DashboardPermissionsPage from "@/pages/Dashboard/Permissions";
import DashboardPermissionCreatePage from "@/pages/Dashboard/Permissions/Create";
import DashboardPermissionEditPage from "@/pages/Dashboard/Permissions/Edit";
import DashboardRolesPage from "@/pages/Dashboard/Roles";
import DashboardRoleCreatePage from "@/pages/Dashboard/Roles/Create";
import DashboardRoleEditPage from "@/pages/Dashboard/Roles/Edit";
import DashboardStaffPage from "@/pages/Dashboard/Staff";
import DashboardStaffCreatePage from "@/pages/Dashboard/Staff/Create";
import DashboardStaffEditPage from "@/pages/Dashboard/Staff/Edit";
import DashboardStudentsPage from "@/pages/Dashboard/Students";
import DashboardStudentCreatePage from "@/pages/Dashboard/Students/Create";
import DashboardStudentEditPage from "@/pages/Dashboard/Students/Edit";
import DashboardTeachersPage from "@/pages/Dashboard/Teachers";
import DashboardTeacherCreatePage from "@/pages/Dashboard/Teachers/Create";
import DashboardTeacherEditPage from "@/pages/Dashboard/Teachers/Edit";
import FavoritesPage from "@/pages/Favorites";
import { PRIVATE_ROUTES, PUBLIC_ROUTES } from "@/shared/routes";

export const privateRoutes: RouteObject[] = [
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: PRIVATE_ROUTES.DASHBOARD,
            element: <DashboardHomePage />,
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_COURSES,
            element: <DashboardCoursesPage />,
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_COURSES_CREATE,
            element: <DashboardCourseCreatePage />,
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_COURSES_EDIT,
            element: <DashboardCourseEditPage />,
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_COURSE_CATEGORIES,
            element: <DashboardCourseCategoriesPage />,
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_COURSE_TAGS,
            element: <DashboardCourseTagsPage />,
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_STAFF,
            element: <DashboardStaffPage />,
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_STAFF_CREATE,
            element: <DashboardStaffCreatePage />,
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_STAFF_EDIT,
            element: <DashboardStaffEditPage />,
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_PERMISSIONS,
            element: <DashboardPermissionsPage />,
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_PERMISSIONS_CREATE,
            element: <DashboardPermissionCreatePage />,
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_PERMISSIONS_EDIT,
            element: <DashboardPermissionEditPage />,
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_ROLES,
            element: <DashboardRolesPage />,
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_ROLES_CREATE,
            element: <DashboardRoleCreatePage />,
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_ROLES_EDIT,
            element: <DashboardRoleEditPage />,
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_STUDENTS,
            element: <DashboardStudentsPage />,
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_STUDENTS_CREATE,
            element: <DashboardStudentCreatePage />,
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_STUDENTS_EDIT,
            element: <DashboardStudentEditPage />,
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_TEACHERS,
            element: <DashboardTeachersPage />,
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_TEACHERS_CREATE,
            element: <DashboardTeacherCreatePage />,
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_TEACHERS_EDIT,
            element: <DashboardTeacherEditPage />,
          },
        ],
      },
      {
        element: <MainLayout />,
        children: [
          {
            path: PUBLIC_ROUTES.CART,
            element: <CartPage />,
          },
          {
            path: PUBLIC_ROUTES.WISHLIST,
            element: <FavoritesPage />,
          },
        ],
      },
    ],
  },
];
