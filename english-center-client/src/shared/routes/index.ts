export const PUBLIC_ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  CART: "/cart",
  WISHLIST: "/wishlist",
  COURSE: "/courses",
  COURSE_DETAIL: "/course/:id",
  PAYMENT: "/payment",
};


export const PRIVATE_ROUTES = {
  DASHBOARD: "/dashboard",
  DASHBOARD_COURSES: "/dashboard/courses",
  DASHBOARD_COURSES_CREATE: "/dashboard/courses/create",
  DASHBOARD_COURSES_EDIT: "/dashboard/courses/:courseId/edit",
  DASHBOARD_COURSE_CATEGORIES: "/dashboard/course-categories",
  DASHBOARD_COURSE_TAGS: "/dashboard/course-tags",
  DASHBOARD_STAFF: "/dashboard/staff",
  DASHBOARD_PERMISSIONS: "/dashboard/permissions",
  DASHBOARD_ROLES: "/dashboard/roles",
  DASHBOARD_STUDENTS: "/dashboard/students",
  DASHBOARD_ATTENDANCE: "/dashboard/attendance",
  DASHBOARD_ASSIGNMENTS: "/dashboard/assignments",
  DASHBOARD_TEACHERS: "/dashboard/teachers",
  DASHBOARD_TEACHING_SCHEDULE: "/dashboard/teaching-schedule",
};
