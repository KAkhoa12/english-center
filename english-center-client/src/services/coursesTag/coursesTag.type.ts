
export type CourseTag = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
};

export type CreateCourseTagRequest = {
  name: string;
  slug?: string | null;
};

export type UpdateCourseTagRequest = {
  name?: string | null;
  slug?: string | null;
};

export type ListCourseTagsQuery = {
  page?: number;
  page_size?: number;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
};
