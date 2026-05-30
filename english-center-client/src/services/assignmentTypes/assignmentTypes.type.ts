import type { SortOrder } from "@/shared/types/response";

export type AssignmentTypeStatus = "active" | "inactive" | string;

export type AssignmentType = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  is_auto_gradable: boolean;
  requires_file_submission: boolean;
  allow_text_submission: boolean;
  allow_file_submission: boolean;
  status: AssignmentTypeStatus;
  created_at: string;
  updated_at: string;
};

export type AssignmentTypeCreateRequest = {
  code: string;
  name: string;
  description?: string | null;
  is_auto_gradable?: boolean;
  requires_file_submission?: boolean;
  allow_text_submission?: boolean;
  allow_file_submission?: boolean;
  status?: AssignmentTypeStatus;
};

export type AssignmentTypeUpdateRequest = {
  code?: string | null;
  name?: string | null;
  description?: string | null;
  is_auto_gradable?: boolean | null;
  requires_file_submission?: boolean | null;
  allow_text_submission?: boolean | null;
  allow_file_submission?: boolean | null;
  status?: AssignmentTypeStatus | null;
};

export type ListAssignmentTypesQuery = {
  page?: number;
  page_size?: number;
  search?: string;
  sort_by?: string;
  sort_order?: SortOrder;
  status?: AssignmentTypeStatus;
};
