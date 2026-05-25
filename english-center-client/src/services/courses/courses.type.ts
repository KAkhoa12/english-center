export type SortOrder = "asc" | "desc";

export type CourseStatus = "draft" | "active" | "archived" | string;
export type TargetLevel = "A0" | "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | string;
export type CourseModuleStatus = "active" | "inactive" | string;

export type CourseCategoryRef = {
  id: string;
  name: string;
  slug: string;
};

export type CourseTagRef = {
  id: string;
  name: string;
  slug: string;
};

export type CourseRequirement = {
  id: string;
  course_id: string;
  requirement_text: string;
  order_index: number;
};

export type CourseOutcome = {
  id: string;
  course_id: string;
  outcome_text: string;
  order_index: number;
};

export type CourseModule = {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  order_index: number;
  status: CourseModuleStatus;
};

export type CourseListItem = {
  id: string;
  name: string;
  code: string;
  slug: string;
  description: string | null;
  target_level: TargetLevel | null;
  duration_weeks: number | null;
  total_sessions: number | null;
  price: number;
  status: CourseStatus;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
  categories: CourseCategoryRef[];
  tags: CourseTagRef[];
};

export type CourseDetail = CourseListItem & {
  output_goal: string | null;
  requirements: CourseRequirement[];
  outcomes: CourseOutcome[];
  modules: CourseModule[];
  lessons_count: number;
};

export type CourseThumbnailUploadResult = {
  course_id: string;
  thumbnail_url: string | null;
  bucket: string | null;
  object_name: string | null;
};

export type CreateCourseRequest = {
  name: string;
  code: string;
  slug?: string | null;
  description?: string | null;
  target_level?: TargetLevel | null;
  output_goal?: string | null;
  duration_weeks?: number | null;
  total_sessions?: number | null;
  price?: number;
  status?: CourseStatus;
  category_ids?: string[] | null;
  tag_ids?: string[] | null;
  requirements?: string[] | null;
  outcomes?: string[] | null;
};

export type UpdateCourseRequest = {
  title?: string | null;
  name?: string | null;
  code?: string | null;
  slug?: string | null;
  description?: string | null;
  target_level?: TargetLevel | null;
  output_goal?: string | null;
  duration_weeks?: number | null;
  total_sessions?: number | null;
  price?: number | null;
  status?: CourseStatus | null;
  category_ids?: string[] | null;
  tag_ids?: string[] | null;
};

export type ListCoursesQuery = {
  page?: number;
  page_size?: number;
  search?: string;
  sort_by?: string;
  sort_order?: SortOrder;
  status?: CourseStatus;
  target_level?: TargetLevel;
  category_id?: string;
  tag_id?: string;
  min_price?: number;
  max_price?: number;
};

export type CreateCourseRequirementRequest = {
  requirement_text: string;
  order_index?: number;
};

export type UpdateCourseRequirementRequest = {
  requirement_text?: string | null;
  order_index?: number | null;
};

export type CreateCourseOutcomeRequest = {
  outcome_text: string;
  order_index?: number;
};

export type UpdateCourseOutcomeRequest = {
  outcome_text?: string | null;
  order_index?: number | null;
};
