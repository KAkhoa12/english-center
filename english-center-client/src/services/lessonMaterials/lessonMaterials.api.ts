import { apiClient } from "@/config/api-client";

import type {
  CreateLessonMaterialRequest,
  LessonMaterial,
  SetLessonMaterialMediaRequest,
  UpdateLessonMaterialRequest,
  UploadLessonMaterialRequest,
} from "./lessonMaterials.type";

export const lessonMaterialsApi = {
  createMaterial: (lessonId: string, data: CreateLessonMaterialRequest) =>
    apiClient.post<LessonMaterial, CreateLessonMaterialRequest>(`/lessons/${lessonId}/materials`, data),

  listMaterials: (lessonId: string) =>
    apiClient.get<LessonMaterial[]>(`/lessons/${lessonId}/materials`),

  getMaterial: (materialId: string) =>
    apiClient.get<LessonMaterial>(`/lesson-materials/${materialId}`),

  updateMaterial: (materialId: string, data: UpdateLessonMaterialRequest) =>
    apiClient.patch<LessonMaterial, UpdateLessonMaterialRequest>(`/lesson-materials/${materialId}`, data),

  uploadMaterial: (lessonId: string, data: UploadLessonMaterialRequest) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("file", data.file);
    if (data.description !== undefined && data.description !== null) formData.append("description", data.description);
    if (data.external_url !== undefined && data.external_url !== null) formData.append("external_url", data.external_url);
    formData.append("order_index", String(data.order_index ?? 0));
    formData.append("is_downloadable", String(data.is_downloadable ?? true));
    return apiClient.post<LessonMaterial, FormData>(`/lessons/${lessonId}/materials/upload`, formData);
  },

  setMaterialMedia: (materialId: string, data: SetLessonMaterialMediaRequest) =>
    apiClient.patch<LessonMaterial, SetLessonMaterialMediaRequest>(`/lesson-materials/${materialId}/media`, data),

  deleteMaterial: (materialId: string) =>
    apiClient.delete<void>(`/lesson-materials/${materialId}`),
};
