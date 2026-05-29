import { create } from "zustand";

import type { ApiResponse, Pagination } from "@/shared/types/response";

import { roomsApi } from "./rooms.api";
import type {
  ListRoomsQuery,
  Room,
  RoomCreateRequest,
  RoomUpdateRequest,
} from "./rooms.type";

const unwrap = <T>(response: ApiResponse<T>, fallbackMessage: string): T => {
  if (!response.success) throw new Error(response.message || fallbackMessage);
  return response.payload;
};

type RoomsState = {
  rooms: Room[];
  pagination: Pagination | null;
  selectedRoom: Room | null;
  isLoading: boolean;
  error: string | null;

  listRooms: (query?: ListRoomsQuery) => Promise<Room[]>;
  getRoom: (roomId: string) => Promise<Room>;
  createRoom: (data: RoomCreateRequest) => Promise<Room>;
  updateRoom: (roomId: string, data: RoomUpdateRequest) => Promise<Room>;
  deleteRoom: (roomId: string) => Promise<void>;
  clearSelectedRoom: () => void;
  clearError: () => void;
};

export const useRoomsStore = create<RoomsState>()((set) => ({
  rooms: [],
  pagination: null,
  selectedRoom: null,
  isLoading: false,
  error: null,

  listRooms: async (query) => {
    try {
      set({ isLoading: true, error: null });
      const response = await roomsApi.listRooms(query);
      const rooms = unwrap(response, "Lay danh sach phong hoc that bai");
      set({ rooms, pagination: response.pagination ?? null, isLoading: false, error: null });
      return rooms;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Lay danh sach phong hoc that bai";
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  getRoom: async (roomId) => {
    const response = await roomsApi.getRoom(roomId);
    const room = unwrap(response, "Lay thong tin phong hoc that bai");
    set({ selectedRoom: room });
    return room;
  },

  createRoom: async (data) => {
    const response = await roomsApi.createRoom(data);
    const room = unwrap(response, "Tao phong hoc that bai");
    set((state) => ({ rooms: [room, ...state.rooms], selectedRoom: room }));
    return room;
  },

  updateRoom: async (roomId, data) => {
    const response = await roomsApi.updateRoom(roomId, data);
    const room = unwrap(response, "Cap nhat phong hoc that bai");
    set((state) => ({
      rooms: state.rooms.map((item) => (item.id === room.id ? room : item)),
      selectedRoom: state.selectedRoom?.id === room.id ? room : state.selectedRoom,
    }));
    return room;
  },

  deleteRoom: async (roomId) => {
    const response = await roomsApi.deleteRoom(roomId);
    unwrap(response, "Xoa phong hoc that bai");
    set((state) => ({
      rooms: state.rooms.filter((item) => item.id !== roomId),
      selectedRoom: state.selectedRoom?.id === roomId ? null : state.selectedRoom,
    }));
  },

  clearSelectedRoom: () => set({ selectedRoom: null }),
  clearError: () => set({ error: null }),
}));
