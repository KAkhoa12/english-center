import type { SortOrder } from "@/shared/types/response";

export type RoomStatus = string;

export type Room = {
  id: string;
  name: string;
  capacity: number;
  location: string | null;
  status: RoomStatus;
  created_at: string;
  updated_at: string;
};

export type RoomCreateRequest = {
  name: string;
  capacity: number;
  location?: string | null;
  status?: RoomStatus;
};

export type RoomUpdateRequest = {
  name?: string | null;
  capacity?: number | null;
  location?: string | null;
  status?: RoomStatus | null;
};

export type ListRoomsQuery = {
  page?: number;
  page_size?: number;
  search?: string;
  sort_by?: string;
  sort_order?: SortOrder;
  status?: RoomStatus;
};
