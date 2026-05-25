import type { ApiResponse, SortOrder, UserRef } from "../common/common.type";

export type Teacher = {
  id: string;
  user: UserRef;
  specialization: string | null;
  bio: string | null;
  experience_years: number;
  certificates: Record<string, unknown> | null;
  hourly_rate: number | null;
};

export type TeacherCreateRequest = {
  full_name: string;
  email: string;
  phone?: string | null;
  password: string;
  avatar_url?: string | null;
  specialization?: string | null;
  bio?: string | null;
  experience_years?: number;
  certificates?: Record<string, unknown> | null;
  hourly_rate?: number | null;
};

export type TeacherUpdateRequest = {
  specialization?: string | null;
  bio?: string | null;
  experience_years?: number | null;
  certificates?: Record<string, unknown> | null;
  hourly_rate?: number | null;
};

export type ListTeachersQuery = {
  page?: number;
  page_size?: number;
  search?: string;
  sort_by?: string;
  sort_order?: SortOrder;
};

export type CreateTeacherResponse = ApiResponse<Teacher>;
export type ListTeachersResponse = ApiResponse<Teacher[]>;
export type GetTeacherResponse = ApiResponse<Teacher>;
export type UpdateTeacherResponse = ApiResponse<Teacher>;
export type DeleteTeacherResponse = ApiResponse<null>;
