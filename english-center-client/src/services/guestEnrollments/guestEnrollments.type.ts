import type { SortOrder } from "@/shared/types/response";

export type GuestEnrollment = {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export type GuestEnrollmentCreateRequest = {
  content: string;
};

export type GuestEnrollmentUpdateRequest = {
  content?: string | null;
};

export type ListGuestEnrollmentsQuery = {
  page?: number;
  page_size?: number;
  search?: string;
  sort_by?: string;
  sort_order?: SortOrder;
};
