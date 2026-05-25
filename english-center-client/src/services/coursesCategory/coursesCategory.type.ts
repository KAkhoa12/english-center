

export type CourseCategoryStatus = "active" | "inactive" | string;

export type CourseCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: CourseCategoryStatus;
  created_at: string;
  updated_at: string;
};

export type CreateCourseCategoryRequest = {
  name: string;
  slug?: string | null;
  description?: string | null;
  status?: CourseCategoryStatus;
};

export type UpdateCourseCategoryRequest = {
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  status?: CourseCategoryStatus | null;
};

export type ListCourseCategoriesQuery = {
  page?: number;
  page_size?: number;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  status?: CourseCategoryStatus;
};
