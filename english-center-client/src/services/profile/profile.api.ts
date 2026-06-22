import { apiClient } from "@/config/api-client";

import type { Profile, ProfileUpdateRequest } from "./profile.type";

export const profileApi = {
  getMyProfile: () => apiClient.get<Profile>("/profile/me"),

  updateMyProfile: (data: ProfileUpdateRequest) =>
    apiClient.patch<Profile, ProfileUpdateRequest>("/profile/me", data),

  updateMyAvatar: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.patch<Profile, FormData>("/profile/me/avatar", formData);
  },
};
