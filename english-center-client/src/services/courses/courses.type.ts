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
  media_id?: string;
  file_id?: string;
  media_type?: string;
  is_primary?: boolean;
  order_index?: number;
  created_at?: string;
  updated_at?: string;
  media?: Record<string, unknown> | null;
};

export type CourseListItem = {
  id: string;
  name: string;
  code: string;
  slug: string;
  description: string | null;
  target_level: TargetLevel | null;
  total_sessions: number | null;
  total_duration_time?: number | null;
  price: number;
  discount_price?: number | null;
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
  thumbnail?: Record<string, unknown> | null;
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
  media?: Record<string, unknown> | null;
};

export type CourseMediaUploadResult = CourseMedia;

export type CourseMediaDeleteResult = void;

export type CourseMediaUpdateRequest = {
  media_type?: string | null;
  order_index?: number | null;
  is_primary?: boolean | null;
};

export type CourseMediaUpdateResult = CourseMedia;

export type CenterCourseClassStatistic = {
  id: string;
  name: string;
  code: string | null;
  status: string;
  max_students: number;
  students_count: number;
};

export type CourseStatistic = {
  course: CourseListItem;
  total_enrollments: number;
  classes_count?: number;
  total_class_students?: number;
  classes?: CenterCourseClassStatistic[];
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
  discount_price?: number | null;
  total_duration_time?: number | null;
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
  discount_price?: number | null;
  total_duration_time?: number | null;
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
  tag_ids?: string[];
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
