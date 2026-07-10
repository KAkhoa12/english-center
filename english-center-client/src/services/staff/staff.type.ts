import type { SortOrder, UserRef } from "@/shared/types/response";
import type { DataImportResult } from "@/shared/types/data-transfer";

export type Staff = {
  id: string;
  user: UserRef;
  position: string | null;
  department: string | null;
  note: string | null;
};

export type StaffCreateRequest = {
  full_name: string;
  email: string;
  phone?: string | null;
  password: string;
  avatar_url?: string | null;
  position?: string | null;
  department?: string | null;
  note?: string | null;
};

export type StaffUpdateRequest = {
  position?: string | null;
  department?: string | null;
  note?: string | null;
};

export type ListStaffQuery = {
  page?: number;
  page_size?: number;
  search?: string;
  sort_by?: string;
  sort_order?: SortOrder;
};

export type StaffImportResult = DataImportResult;
