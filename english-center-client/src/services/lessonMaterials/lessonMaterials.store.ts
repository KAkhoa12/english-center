import { create } from "zustand";

import type { ApiResponse } from "@/shared/types/response";

import { lessonMaterialsApi } from "./lessonMaterials.api";
import type {
  CreateLessonMaterialRequest,
  LessonMaterial,
  SetLessonMaterialMediaRequest,
  UpdateLessonMaterialRequest,
  UploadLessonMaterialRequest,
} from "./lessonMaterials.type";

const unwrap = <T>(response: ApiResponse<T>, fallbackMessage: string): T => {
  if (!response.success) throw new Error(response.message || fallbackMessage);
  return response.payload;
};

type LessonMaterialsState = {
  materials: LessonMaterial[];
  selectedMaterial: LessonMaterial | null;
  isLoading: boolean;
  error: string | null;

  createMaterial: (lessonId: string, data: CreateLessonMaterialRequest) => Promise<LessonMaterial>;
  listMaterials: (lessonId: string) => Promise<LessonMaterial[]>;
  getMaterial: (materialId: string) => Promise<LessonMaterial>;
  updateMaterial: (materialId: string, data: UpdateLessonMaterialRequest) => Promise<LessonMaterial>;
  uploadMaterial: (lessonId: string, data: UploadLessonMaterialRequest) => Promise<LessonMaterial>;
  setMaterialMedia: (materialId: string, data: SetLessonMaterialMediaRequest) => Promise<LessonMaterial>;
  deleteMaterial: (materialId: string) => Promise<void>;
  clearSelectedMaterial: () => void;
  clearError: () => void;
};

export const useLessonMaterialsStore = create<LessonMaterialsState>()((set) => ({
  materials: [],
  selectedMaterial: null,
  isLoading: false,
  error: null,

  createMaterial: async (lessonId, data) => {
    const response = await lessonMaterialsApi.createMaterial(lessonId, data);
    const material = unwrap(response, "Tao tai lieu bai hoc that bai");
    set((state) => ({ materials: [...state.materials, material], selectedMaterial: material }));
    return material;
  },

  listMaterials: async (lessonId) => {
    const response = await lessonMaterialsApi.listMaterials(lessonId);
    const materials = unwrap(response, "Lay danh sach tai lieu that bai");
    set({ materials });
    return materials;
  },

  getMaterial: async (materialId) => {
    const response = await lessonMaterialsApi.getMaterial(materialId);
    const material = unwrap(response, "Lay chi tiet tai lieu that bai");
    set({ selectedMaterial: material });
    return material;
  },

  updateMaterial: async (materialId, data) => {
    const response = await lessonMaterialsApi.updateMaterial(materialId, data);
    const material = unwrap(response, "Cap nhat tai lieu that bai");
    set((state) => ({
      materials: state.materials.map((item) => (item.id === material.id ? material : item)),
      selectedMaterial: state.selectedMaterial?.id === material.id ? material : state.selectedMaterial,
    }));
    return material;
  },

  uploadMaterial: async (lessonId, data) => {
    const response = await lessonMaterialsApi.uploadMaterial(lessonId, data);
    const material = unwrap(response, "Tai tai lieu bai hoc that bai");
    set((state) => ({ materials: [...state.materials, material], selectedMaterial: material }));
    return material;
  },

  setMaterialMedia: async (materialId, data) => {
    const response = await lessonMaterialsApi.setMaterialMedia(materialId, data);
    const material = unwrap(response, "Cap nhat media tai lieu that bai");
    set((state) => ({
      materials: state.materials.map((item) => (item.id === material.id ? material : item)),
      selectedMaterial: state.selectedMaterial?.id === material.id ? material : state.selectedMaterial,
    }));
    return material;
  },

  deleteMaterial: async (materialId) => {
    const response = await lessonMaterialsApi.deleteMaterial(materialId);
    unwrap(response, "Xoa tai lieu that bai");
    set((state) => ({
      materials: state.materials.filter((item) => item.id !== materialId),
      selectedMaterial: state.selectedMaterial?.id === materialId ? null : state.selectedMaterial,
    }));
  },

  clearSelectedMaterial: () => set({ selectedMaterial: null }),
  clearError: () => set({ error: null }),
}));
