import type { RouteObject } from "react-router-dom";

import DashboardAccessGuard from "@/shared/guards/DashboardAccessGuard";
import PrivateRoute from "@/shared/guards/PrivateRoute";
import DashboardLayout from "@/shared/layouts/DashboardLayout";
import MainLayout from "@/components/Layout/MainLayout";
import DashboardCourseCategoriesPage from "@/pages/Dashboard/CourseCategories";
import DashboardCoursesPage from "@/pages/Dashboard/Courses";
import DashboardCourseCreatePage from "@/pages/Dashboard/Courses/Create";
import DashboardCourseEditPage from "@/pages/Dashboard/Courses/Edit";
import DashboardCourseStatisticsPage from "@/pages/Dashboard/Courses/Statistics";
import DashboardHomePage from "@/pages/Dashboard/Home";
import DashboardCashflowPage from "@/pages/Dashboard/Cashflow";
import DashboardCashflowCreatePage from "@/pages/Dashboard/Cashflow/Create";
import DashboardCashflowEditPage from "@/pages/Dashboard/Cashflow/Edit";
import DashboardInvoicesPage from "@/pages/Dashboard/Invoices";
import DashboardInvoiceCreatePage from "@/pages/Dashboard/Invoices/Create";
import DashboardInvoiceEditPage from "@/pages/Dashboard/Invoices/Edit";
import DashboardDocumentsPage from "@/pages/Dashboard/Documents";
import DashboardDocumentCreatePage from "@/pages/Dashboard/Documents/Create";
import DashboardDocumentEditPage from "@/pages/Dashboard/Documents/Edit";
import DashboardGuestEnrollmentsPage from "@/pages/Dashboard/GuestEnrollments";
import DashboardClassesPage from "@/pages/Dashboard/Classes";
import DashboardClassCreatePage from "@/pages/Dashboard/Classes/Create";
import DashboardClassEditPage from "@/pages/Dashboard/Classes/Edit";
import DashboardAssignmentsPage from "@/pages/Dashboard/Assignments";
import DashboardAssignmentDetailPage from "@/pages/Dashboard/Assignments/Detail";
import DashboardAssignmentGradingPage from "@/pages/Dashboard/Assignments/Grading";
import DashboardAssignmentTypesPage from "@/pages/Dashboard/AssignmentTypes";
import DashboardAttendancePage from "@/pages/Dashboard/Attendance";
import DashboardCertificatesPage from "@/pages/Dashboard/Certificates";
import DashboardPermissionsPage from "@/pages/Dashboard/Permissions";
import DashboardPermissionCreatePage from "@/pages/Dashboard/Permissions/Create";
import DashboardPermissionEditPage from "@/pages/Dashboard/Permissions/Edit";
import DashboardProfilePage from "@/pages/Dashboard/Profile";
import DashboardResultsPage from "@/pages/Dashboard/Results";
import DashboardRolesPage from "@/pages/Dashboard/Roles";
import DashboardRoleCreatePage from "@/pages/Dashboard/Roles/Create";
import DashboardRoleEditPage from "@/pages/Dashboard/Roles/Edit";
import DashboardRoomsPage from "@/pages/Dashboard/Rooms";
import DashboardRoomCreatePage from "@/pages/Dashboard/Rooms/Create";
import DashboardRoomEditPage from "@/pages/Dashboard/Rooms/Edit";
import DashboardSchedulePage from "@/pages/Dashboard/Schedule";
import DashboardScheduleDetailPage from "@/pages/Dashboard/Schedule/Detail";
import DashboardStaffPage from "@/pages/Dashboard/Staff";
import DashboardStaffCreatePage from "@/pages/Dashboard/Staff/Create";
import DashboardStaffEditPage from "@/pages/Dashboard/Staff/Edit";
import DashboardStudentsPage from "@/pages/Dashboard/Students";
import DashboardStudentCreatePage from "@/pages/Dashboard/Students/Create";
import DashboardStudentEditPage from "@/pages/Dashboard/Students/Edit";
import DashboardTeachersPage from "@/pages/Dashboard/Teachers";
import DashboardTeacherCreatePage from "@/pages/Dashboard/Teachers/Create";
import DashboardTeacherEditPage from "@/pages/Dashboard/Teachers/Edit";
import DashboardTeachingSchedulePage from "@/pages/Dashboard/TeachingSchedule";
import DashboardSessionsPage from "@/pages/Dashboard/Sessions";
import DashboardSessionDetailPage from "@/pages/Dashboard/Sessions/Detail";
import DashboardOrderCreatePage from "@/pages/Dashboard/Orders/Create";
import FavoritesPage from "@/pages/Favorites";
import MyCoursesPage from "@/pages/MyCourses";
import MyInvoicesPage from "@/pages/MyInvoices";
import PaymentPage from "@/pages/Payment";
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
            path: PRIVATE_ROUTES.DASHBOARD_PROFILE,
            element: (
              <DashboardAccessGuard allowedRoles={["admin", "staff", "teacher", "student"]}>
                <DashboardProfilePage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_MY_COURSES,
            element: (
              <DashboardAccessGuard allowedRoles={["admin", "staff", "teacher", "student"]}>
                <MyCoursesPage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_MY_INVOICES,
            element: (
              <DashboardAccessGuard allowedRoles={["admin", "staff", "teacher", "student"]}>
                <MyInvoicesPage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_COURSES,
            element: (
              <DashboardAccessGuard
                allowedRoles={["admin", "staff","teacher"]}
                requiredPermissions={["course.create", "course.update", "course.delete"]}
              >
                <DashboardCoursesPage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_CENTER_COURSES,
            element: (
              <DashboardAccessGuard
                allowedRoles={["admin", "staff","teacher"]}
                requiredPermissions={["course.create", "course.update", "course.delete"]}
              >
                <DashboardCoursesPage modeFilter="center" />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_CENTER_COURSES_STATISTICS,
            element: (
              <DashboardAccessGuard allowedRoles={["admin", "staff"]}>
                <DashboardCourseStatisticsPage mode="center" />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_COURSES_CREATE,
            element: (
              <DashboardAccessGuard allowedRoles={["admin", "staff","teacher"]} requiredPermissions={["course.create"]}>
                <DashboardCourseCreatePage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_COURSES_EDIT,
            element: (
              <DashboardAccessGuard allowedRoles={["admin", "staff", "teacher"]} requiredPermissions={["course.update"]}>
                <DashboardCourseEditPage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_COURSE_CATEGORIES,
            element: (
              <DashboardAccessGuard allowedRoles={["admin", "staff"]} requiredPermissions={["course_category.read"]}>
                <DashboardCourseCategoriesPage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_STAFF,
            element: (
              <DashboardAccessGuard allowedRoles={["admin", "staff"]} requiredPermissions={["staff.read"]}>
                <DashboardStaffPage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_STAFF_CREATE,
            element: (
              <DashboardAccessGuard allowedRoles={["admin", "staff"]} requiredPermissions={["staff.create"]}>
                <DashboardStaffCreatePage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_STAFF_EDIT,
            element: (
              <DashboardAccessGuard allowedRoles={["admin", "staff"]} requiredPermissions={["staff.update"]}>
                <DashboardStaffEditPage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_PERMISSIONS,
            element: (
              <DashboardAccessGuard allowedRoles={["admin", "staff"]} requiredPermissions={["permission.read"]}>
                <DashboardPermissionsPage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_PERMISSIONS_CREATE,
            element: (
              <DashboardAccessGuard allowedRoles={["admin", "staff"]} requiredPermissions={["permission.create"]}>
                <DashboardPermissionCreatePage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_PERMISSIONS_EDIT,
            element: (
              <DashboardAccessGuard allowedRoles={["admin", "staff"]} requiredPermissions={["permission.update"]}>
                <DashboardPermissionEditPage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_ROLES,
            element: (
              <DashboardAccessGuard allowedRoles={["admin", "staff"]} requiredPermissions={["role.read"]}>
                <DashboardRolesPage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_ROLES_CREATE,
            element: (
              <DashboardAccessGuard allowedRoles={["admin", "staff"]} requiredPermissions={["role.create"]}>
                <DashboardRoleCreatePage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_ROLES_EDIT,
            element: (
              <DashboardAccessGuard allowedRoles={["admin", "staff"]} requiredPermissions={["role.update"]}>
                <DashboardRoleEditPage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_STUDENTS,
            element: (
              <DashboardAccessGuard
                allowedRoles={["admin", "staff", "teacher"]}
                requiredPermissions={["student.read"]}
              >
                <DashboardStudentsPage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_STUDENTS_CREATE,
            element: (
              <DashboardAccessGuard allowedRoles={["admin", "staff"]} requiredPermissions={["student.create"]}>
                <DashboardStudentCreatePage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_STUDENTS_EDIT,
            element: (
              <DashboardAccessGuard allowedRoles={["admin", "staff"]} requiredPermissions={["student.update"]}>
                <DashboardStudentEditPage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_TEACHERS,
            element: (
              <DashboardAccessGuard allowedRoles={["admin", "staff"]} requiredPermissions={["teacher.read"]}>
                <DashboardTeachersPage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_TEACHERS_CREATE,
            element: (
              <DashboardAccessGuard allowedRoles={["admin", "staff"]} requiredPermissions={["teacher.create"]}>
                <DashboardTeacherCreatePage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_TEACHERS_EDIT,
            element: (
              <DashboardAccessGuard allowedRoles={["admin", "staff"]} requiredPermissions={["teacher.update"]}>
                <DashboardTeacherEditPage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_FINANCE_CASHFLOW,
            element: (
              <DashboardAccessGuard allowedRoles={["admin", "staff"]} requiredPermissions={["order.read", "payment.read"]}>
                <DashboardCashflowPage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_FINANCE_CASHFLOW_CREATE,
            element: (
              <DashboardAccessGuard allowedRoles={["admin", "staff"]} requiredPermissions={["payment.create"]}>
                <DashboardCashflowCreatePage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_FINANCE_CASHFLOW_EDIT,
            element: (
              <DashboardAccessGuard allowedRoles={["admin", "staff"]} requiredPermissions={["payment.read"]}>
                <DashboardCashflowEditPage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_FINANCE_INVOICES,
            element: (
              <DashboardAccessGuard allowedRoles={["admin", "staff"]} requiredPermissions={["invoice.read", "order.read"]}>
                <DashboardInvoicesPage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_FINANCE_INVOICES_CREATE,
            element: (
              <DashboardAccessGuard allowedRoles={["admin", "staff"]} requiredPermissions={["order.create"]}>
                <DashboardInvoiceCreatePage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_FINANCE_INVOICES_EDIT,
            element: (
              <DashboardAccessGuard allowedRoles={["admin", "staff"]} requiredPermissions={["order.update"]}>
                <DashboardInvoiceEditPage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_ORDERS_CREATE,
            element: (
              <DashboardAccessGuard allowedRoles={["admin", "staff"]} requiredPermissions={["order.create"]}>
                <DashboardOrderCreatePage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_DOCUMENTS,
            element: (
              <DashboardAccessGuard allowedRoles={["admin", "staff", "teacher"]}>
                <DashboardDocumentsPage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_DOCUMENTS_CREATE,
            element: (
              <DashboardAccessGuard allowedRoles={["admin", "staff", "teacher"]}>
                <DashboardDocumentCreatePage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_DOCUMENTS_EDIT,
            element: (
              <DashboardAccessGuard allowedRoles={["admin", "staff", "teacher"]}>
                <DashboardDocumentEditPage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_CLASSES,
            element: (
              <DashboardAccessGuard
                allowedRoles={["admin", "staff", "teacher"]}
                requiredPermissions={["class.read"]}
              >
                <DashboardClassesPage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_CLASSES_CREATE,
            element: (
              <DashboardAccessGuard allowedRoles={["admin", "staff"]} requiredPermissions={["class.create"]}>
                <DashboardClassCreatePage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_CLASSES_EDIT,
            element: (
              <DashboardAccessGuard allowedRoles={["admin", "staff"]} requiredPermissions={["class.update"]}>
                <DashboardClassEditPage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_SESSIONS,
            element: (
              <DashboardAccessGuard allowedRoles={["admin", "teacher"]} requiredPermissions={["class_session.read"]}>
                <DashboardSessionsPage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_SESSIONS_DETAIL,
            element: (
              <DashboardAccessGuard allowedRoles={["admin", "teacher"]} requiredPermissions={["class_session.read"]}>
                <DashboardSessionDetailPage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_ATTENDANCE,
            element: (
              <DashboardAccessGuard allowedRoles={["admin", "staff", "teacher", "student"]}>
                <DashboardAttendancePage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_ASSIGNMENTS,
            element: (
              <DashboardAccessGuard allowedRoles={["admin", "staff", "teacher", "student"]}>
                <DashboardAssignmentsPage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_ASSIGNMENTS_DETAIL,
            element: (
              <DashboardAccessGuard allowedRoles={["student", "admin", "staff", "teacher"]}>
                <DashboardAssignmentDetailPage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_ASSIGNMENTS_GRADING,
            element: (
              <DashboardAccessGuard allowedRoles={["admin", "staff", "teacher"]} requiredPermissions={["assignment_grade.read"]}>
                <DashboardAssignmentGradingPage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_ASSIGNMENT_TYPES,
            element: (
              <DashboardAccessGuard
                allowedRoles={["admin", "staff"]}
                requiredPermissions={["assignment_type.read"]}
              >
                <DashboardAssignmentTypesPage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_ROOMS,
            element: (
              <DashboardAccessGuard allowedRoles={["admin", "staff"]} requiredPermissions={["room.read"]}>
                <DashboardRoomsPage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_ROOMS_CREATE,
            element: (
              <DashboardAccessGuard allowedRoles={["admin", "staff"]} requiredPermissions={["room.create"]}>
                <DashboardRoomCreatePage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_ROOMS_EDIT,
            element: (
              <DashboardAccessGuard allowedRoles={["admin", "staff"]} requiredPermissions={["room.update"]}>
                <DashboardRoomEditPage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_TEACHING_SCHEDULE,
            element: (
              <DashboardAccessGuard
                allowedRoles={["admin", "staff", "teacher"]}
                requiredPermissions={["class_session.read"]}
              >
                <DashboardTeachingSchedulePage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_SCHEDULE_DETAIL,
            element: (
              <DashboardAccessGuard allowedRoles={["student", "teacher", "admin", "staff"]}>
                <DashboardScheduleDetailPage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_SCHEDULE,
            element: (
              <DashboardAccessGuard allowedRoles={["student"]}>
                <DashboardSchedulePage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_RESULTS,
            element: (
              <DashboardAccessGuard allowedRoles={["student"]}>
                <DashboardResultsPage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_CERTIFICATES,
            element: (
              <DashboardAccessGuard allowedRoles={["student"]}>
                <DashboardCertificatesPage />
              </DashboardAccessGuard>
            ),
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD_GUEST_ENROLLMENTS,
            element: (
              <DashboardAccessGuard allowedRoles={["admin"]}>
                <DashboardGuestEnrollmentsPage />
              </DashboardAccessGuard>
            ),
          },
        ],
      },
      {
        element: <MainLayout />,
        children: [
          {
            path: PUBLIC_ROUTES.WISHLIST,
            element: <FavoritesPage />,
          },
          {
            path: PUBLIC_ROUTES.PAYMENT,
            element: <PaymentPage />,
          },
        ],
      },
    ],
  },
];
