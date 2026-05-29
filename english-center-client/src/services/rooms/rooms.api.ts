import { apiClient } from "@/config/api-client";

import type {
  ListRoomsQuery,
  Room,
  RoomCreateRequest,
  RoomUpdateRequest,
} from "./rooms.type";

const appendQuery = (url: string, query?: Record<string, unknown>): string => {
  if (!query) return url;

  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    params.set(key, String(value));
  });

  const queryString = params.toString();
  return queryString ? `${url}?${queryString}` : url;
};

export const roomsApi = {
  createRoom: (data: RoomCreateRequest) =>
    apiClient.post<Room, RoomCreateRequest>("/rooms", data),

  listRooms: (query?: ListRoomsQuery) =>
    apiClient.getWithMeta<Room[]>(appendQuery("/rooms", query)),

  getRoom: (roomId: string) =>
    apiClient.get<Room>(`/rooms/${roomId}`),

  updateRoom: (roomId: string, data: RoomUpdateRequest) =>
    apiClient.patch<Room, RoomUpdateRequest>(`/rooms/${roomId}`, data),

  deleteRoom: (roomId: string) =>
    apiClient.delete<void>(`/rooms/${roomId}`),
};
