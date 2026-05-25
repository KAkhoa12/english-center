import type { SortOrder } from "@/shared/types/response";

export type Permission = {
  id: string;
  code: string;
  name: string | null;
  description: string | null;
};

export type PermissionCreateRequest = {
  code: string;
  name?: string | null;
  description?: string | null;
};

export type PermissionUpdateRequest = {
  code?: string | null;
  name?: string | null;
  description?: string | null;
};

export type ListPermissionsQuery = {
  page?: number;
  page_size?: number;
  search?: string;
  sort_by?: string;
  sort_order?: SortOrder;
};
