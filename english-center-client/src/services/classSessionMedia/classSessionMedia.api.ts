import { apiClient } from "@/config/api-client";

import type {
  ClassSessionMedia,
  CreateClassSessionMediaRequest,
  UpdateClassSessionMediaRequest,
  UploadClassSessionMediaRequest,
} from "./classSessionMedia.type";

export const classSessionMediaApi = {
  listMedia: (sessionId: string) =>
    apiClient.get<ClassSessionMedia[]>(`/sessions/${sessionId}/media`),

  createMedia: (sessionId: string, data: CreateClassSessionMediaRequest) =>
    apiClient.post<ClassSessionMedia, CreateClassSessionMediaRequest>(`/sessions/${sessionId}/media`, data),

  uploadMedia: (sessionId: string, data: UploadClassSessionMediaRequest) => {
    const formData = new FormData();
    formData.append("file", data.file);
    if (data.title) formData.append("title", data.title);
    if (data.description) formData.append("description", data.description);
    if (data.order_index !== undefined) formData.append("order_index", String(data.order_index));

    return apiClient.post<ClassSessionMedia, FormData>(`/sessions/${sessionId}/media/upload`, formData);
  },

  updateMedia: (mediaId: string, data: UpdateClassSessionMediaRequest) =>
    apiClient.patch<ClassSessionMedia, UpdateClassSessionMediaRequest>(`/sessions/media/${mediaId}`, data),

  deleteMedia: (mediaId: string) =>
    apiClient.delete<void>(`/sessions/media/${mediaId}`),
};
