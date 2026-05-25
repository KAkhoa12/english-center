import type { RouteObject } from 'react-router-dom';
import { PUBLIC_ROUTES } from '@/shared/routes';
import MainLayout from '@/shared/layouts/MainLayout';
import HomePage from '@/pages/Home';
import AuthLayout from '@/shared/layouts/AuthLayout';
import LoginPage from '@/pages/Login';
import RegisterPage from '@/pages/Regiter';
import CoursesPage from '@/pages/Courses';
import CourseDetailPage from '@/pages/CoursesDetail';


export const publicRoutes: RouteObject[] = [
  {
    element: <MainLayout />,
    children: [
      {
        path: PUBLIC_ROUTES.HOME,
        element: <HomePage />,
      },
      {
        path: PUBLIC_ROUTES.COURSE,
        element: <CoursesPage />,
      },
      {
        path: PUBLIC_ROUTES.COURSE_DETAIL,
        element: <CourseDetailPage />,
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: PUBLIC_ROUTES.LOGIN,
        element: <LoginPage />,
      },
      {
        path: PUBLIC_ROUTES.REGISTER,
        element: <RegisterPage />,
      },
    ],
  },
];
