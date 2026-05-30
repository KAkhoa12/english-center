import { create } from "zustand";

import type { ApiResponse } from "@/shared/types/response";

import { courseModulesApi } from "./courseModules.api";
import type {
  CourseModule,
  CreateCourseModuleRequest,
  UpdateCourseModuleRequest,
} from "./courseModules.type";

const unwrap = <T>(response: ApiResponse<T>, fallbackMessage: string): T => {
  if (!response.success) throw new Error(response.message || fallbackMessage);
  return response.payload;
};

type CourseModulesState = {
  modules: CourseModule[];
  selectedModule: CourseModule | null;
  isLoading: boolean;
  error: string | null;

  createModule: (courseId: string, data: CreateCourseModuleRequest) => Promise<CourseModule>;
  listModules: (courseId: string) => Promise<CourseModule[]>;
  getModule: (moduleId: string) => Promise<CourseModule>;
  updateModule: (moduleId: string, data: UpdateCourseModuleRequest) => Promise<CourseModule>;
  deleteModule: (moduleId: string) => Promise<void>;
  clearSelectedModule: () => void;
  clearError: () => void;
};

export const useCourseModulesStore = create<CourseModulesState>()((set) => ({
  modules: [],
  selectedModule: null,
  isLoading: false,
  error: null,

  createModule: async (courseId, data) => {
    const response = await courseModulesApi.createModule(courseId, data);
    const module = unwrap(response, "Tao module that bai");
    set((state) => ({ modules: [...state.modules, module], selectedModule: module }));
    return module;
  },

  listModules: async (courseId) => {
    const response = await courseModulesApi.listModules(courseId);
    const modules = unwrap(response, "Lay danh sach module that bai");
    set({ modules });
    return modules;
  },

  getModule: async (moduleId) => {
    const response = await courseModulesApi.getModule(moduleId);
    const module = unwrap(response, "Lay chi tiet module that bai");
    set({ selectedModule: module });
    return module;
  },

  updateModule: async (moduleId, data) => {
    const response = await courseModulesApi.updateModule(moduleId, data);
    const module = unwrap(response, "Cap nhat module that bai");
    set((state) => ({
      modules: state.modules.map((item) => (item.id === module.id ? module : item)),
      selectedModule: state.selectedModule?.id === module.id ? module : state.selectedModule,
    }));
    return module;
  },

  deleteModule: async (moduleId) => {
    const response = await courseModulesApi.deleteModule(moduleId);
    unwrap(response, "Xoa module that bai");
    set((state) => ({
      modules: state.modules.filter((item) => item.id !== moduleId),
      selectedModule: state.selectedModule?.id === moduleId ? null : state.selectedModule,
    }));
  },

  clearSelectedModule: () => set({ selectedModule: null }),
  clearError: () => set({ error: null }),
}));
