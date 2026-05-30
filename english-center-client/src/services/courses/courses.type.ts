export type SortOrder = "asc" | "desc";

export type CourseMode = "center" | "template";
export type CourseStatus = "active" | "inactive" | "archived" | string;
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
  media_id?: string | null;
  media?: Record<string, unknown> | null;
  order_index: number;
  status: CourseModuleStatus;
};

export type CourseMedia = {
  id: string;
  course_id?: string;
  file_id?: string;
  media_type?: string;
  is_primary?: boolean;
  order_index?: number;
  created_at?: string;
  updated_at?: string;
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
  mode: CourseMode;
  category?: CourseCategoryRef | null;
  category_id?: string | null;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
  categories?: CourseCategoryRef[];
  tags: CourseTagRef[];
};

export type CourseDetail = CourseListItem & {
  category?: CourseCategoryRef | null;
  category_id?: string | null;
  mode: CourseMode;
  thumbnail?: string | null;
  media?: CourseMedia[];
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
  category_id: string;
  mode?: CourseMode;
  target_level?: TargetLevel | null;
  output_goal?: string | null;
  duration_weeks?: number | null;
  total_sessions?: number | null;
  price?: number;
  status?: CourseStatus;
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
  category_id?: string | null;
  mode?: CourseMode | null;
  target_level?: TargetLevel | null;
  output_goal?: string | null;
  duration_weeks?: number | null;
  total_sessions?: number | null;
  price?: number | null;
  status?: CourseStatus | null;
  tag_ids?: string[] | null;
};

export type ListCoursesQuery = {
  page?: number;
  page_size?: number;
  search?: string;
  sort_by?: string;
  sort_order?: SortOrder;
  status?: CourseStatus;
  mode?: CourseMode;
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
