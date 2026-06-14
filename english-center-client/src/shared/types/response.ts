export type Pagination = {
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  payload: T;
  pagination?: Pagination;
  statusCode?: number;
};

export type SortOrder = "asc" | "desc";

export type UserRef = {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  avatar_url?: string | null;
  status?: string;
  is_verified?: boolean;
};
