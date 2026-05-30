export type EnrollmentCourse = {
  id: string;
  name: string;
  code: string;
  thumbnail_url: string | null;
};

export type Enrollment = {
  id: string;
  course_id: string;
  course: EnrollmentCourse;
  order_id: string | null;
  enrollment_status: string;
  enrolled_at: string;
};

export type ListEnrollmentsQuery = {
  page?: number;
  page_size?: number;
};
