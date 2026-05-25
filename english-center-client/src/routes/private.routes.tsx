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
import DashboardRolesPage from "@/pages/Dashboard/Roles";
import DashboardStaffPage from "@/pages/Dashboard/Staff";
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
            path: PRIVATE_ROUTES.DASHBOARD_PERMISSIONS,
            element: <DashboardPermissionsPage />,
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_ROLES,
            element: <DashboardRolesPage />,
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
