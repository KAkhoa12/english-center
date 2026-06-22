import { create } from "zustand";

import type { ApiResponse } from "@/shared/types/response";

import { profileApi } from "./profile.api";
import type { Profile, ProfileUpdateRequest } from "./profile.type";

const unwrap = <T>(response: ApiResponse<T>, fallbackMessage: string): T => {
  if (!response.success) throw new Error(response.message || fallbackMessage);
  return response.payload;
};

type ProfileState = {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  getMyProfile: () => Promise<Profile>;
  updateMyProfile: (data: ProfileUpdateRequest) => Promise<Profile>;
  updateMyAvatar: (file: File) => Promise<Profile>;
  clearError: () => void;
};

export const useProfileStore = create<ProfileState>()((set) => ({
  profile: null,
  isLoading: false,
  error: null,

  getMyProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const profile = unwrap(await profileApi.getMyProfile(), "Lay thong tin ca nhan that bai");
      set({ profile, isLoading: false });
      return profile;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Lay thong tin ca nhan that bai";
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  updateMyProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const profile = unwrap(await profileApi.updateMyProfile(data), "Cap nhat thong tin ca nhan that bai");
      set({ profile, isLoading: false });
      return profile;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Cap nhat thong tin ca nhan that bai";
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  updateMyAvatar: async (file) => {
    set({ isLoading: true, error: null });
    try {
      const profile = unwrap(await profileApi.updateMyAvatar(file), "Cap nhat anh dai dien that bai");
      set({ profile, isLoading: false });
      return profile;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Cap nhat anh dai dien that bai";
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
