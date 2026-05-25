import type {SortOrder } from "@/shared/types/response";

export type Role = {
  id: string;
  name: string;
  description: string | null;
};

export type RoleCreateRequest = {
  name: string;
  description?: string | null;
};

export type RoleUpdateRequest = {
  name?: string | null;
  description?: string | null;
};

export type AssignPermissionsRequest = {
  permission_ids: string[];
};

export type ListRolesQuery = {
  page?: number;
  page_size?: number;
  search?: string;
  sort_by?: string;
  sort_order?: SortOrder;
};
