import { create } from "zustand";

import type { ApiResponse } from "@/shared/types/response";

import { classSessionMediaApi } from "./classSessionMedia.api";
import type {
  ClassSessionMedia,
  CreateClassSessionMediaRequest,
  UpdateClassSessionMediaRequest,
  UploadClassSessionMediaRequest,
} from "./classSessionMedia.type";

const unwrap = <T>(response: ApiResponse<T>, fallbackMessage: string): T => {
  if (!response.success) throw new Error(response.message || fallbackMessage);
  return response.payload;
};

type ClassSessionMediaState = {
  mediaBySessionId: Record<string, ClassSessionMedia[]>;
  isLoading: boolean;
  error: string | null;

  listMedia: (sessionId: string) => Promise<ClassSessionMedia[]>;
  createMedia: (sessionId: string, data: CreateClassSessionMediaRequest) => Promise<ClassSessionMedia>;
  uploadMedia: (sessionId: string, data: UploadClassSessionMediaRequest) => Promise<ClassSessionMedia>;
  updateMedia: (mediaId: string, data: UpdateClassSessionMediaRequest) => Promise<ClassSessionMedia>;
  deleteMedia: (sessionId: string, mediaId: string) => Promise<void>;
  clearError: () => void;
};

export const useClassSessionMediaStore = create<ClassSessionMediaState>()((set) => ({
  mediaBySessionId: {},
  isLoading: false,
  error: null,

  listMedia: async (sessionId) => {
    const response = await classSessionMediaApi.listMedia(sessionId);
    const items = unwrap(response, "Lay tai lieu buoi hoc that bai");
    set((state) => ({ mediaBySessionId: { ...state.mediaBySessionId, [sessionId]: items } }));
    return items;
  },

  createMedia: async (sessionId, data) => {
    const response = await classSessionMediaApi.createMedia(sessionId, data);
    const item = unwrap(response, "Them tai lieu buoi hoc that bai");
    set((state) => ({
      mediaBySessionId: {
        ...state.mediaBySessionId,
        [sessionId]: [...(state.mediaBySessionId[sessionId] ?? []), item],
      },
    }));
    return item;
  },

  uploadMedia: async (sessionId, data) => {
    const response = await classSessionMediaApi.uploadMedia(sessionId, data);
    const item = unwrap(response, "Tai tai lieu buoi hoc that bai");
    set((state) => ({
      mediaBySessionId: {
        ...state.mediaBySessionId,
        [sessionId]: [...(state.mediaBySessionId[sessionId] ?? []), item],
      },
    }));
    return item;
  },

  updateMedia: async (mediaId, data) => {
    const response = await classSessionMediaApi.updateMedia(mediaId, data);
    const item = unwrap(response, "Cap nhat tai lieu buoi hoc that bai");
    set((state) => ({
      mediaBySessionId: Object.fromEntries(
        Object.entries(state.mediaBySessionId).map(([sessionId, items]) => [
          sessionId,
          items.map((media) => (media.id === mediaId ? item : media)),
        ]),
      ),
    }));
    return item;
  },

  deleteMedia: async (sessionId, mediaId) => {
    const response = await classSessionMediaApi.deleteMedia(mediaId);
    unwrap(response, "Xoa tai lieu buoi hoc that bai");
    set((state) => ({
      mediaBySessionId: {
        ...state.mediaBySessionId,
        [sessionId]: (state.mediaBySessionId[sessionId] ?? []).filter((item) => item.id !== mediaId),
      },
    }));
  },

  clearError: () => set({ error: null }),
}));
