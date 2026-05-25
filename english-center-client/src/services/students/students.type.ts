import type {SortOrder, UserRef } from "@/shared/types/response";

export type StudentLevel = string;

export type Student = {
  id: string;
  user: UserRef;
  date_of_birth: string | null;
  gender: string | null;
  address: string | null;
  level: StudentLevel | null;
  learning_goal: string | null;
  parent_name: string | null;
  parent_phone: string | null;
};

export type StudentCreateRequest = {
  full_name: string;
  email: string;
  phone?: string | null;
  password: string;
  avatar_url?: string | null;
  date_of_birth?: string | null;
  gender?: string | null;
  address?: string | null;
  level?: StudentLevel | null;
  learning_goal?: string | null;
  parent_name?: string | null;
  parent_phone?: string | null;
};

export type StudentUpdateRequest = {
  date_of_birth?: string | null;
  gender?: string | null;
  address?: string | null;
  level?: StudentLevel | null;
  learning_goal?: string | null;
  parent_name?: string | null;
  parent_phone?: string | null;
};

export type ListStudentsQuery = {
  page?: number;
  page_size?: number;
  search?: string;
  sort_by?: string;
  sort_order?: SortOrder;
  level?: StudentLevel;
};
