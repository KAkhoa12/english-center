import { create } from "zustand";

import type { ApiResponse, Pagination } from "@/shared/types/response";
import { coursesCategoryApi } from "./coursesCategory.api";
import type {
  CourseCategory,
  CreateCourseCategoryRequest,
  ListCourseCategoriesQuery,
  UpdateCourseCategoryRequest,
} from "./coursesCategory.type";

const unwrap = <T>(response: ApiResponse<T>, fallbackMessage: string): T => {
  if (!response.success) throw new Error(response.message || fallbackMessage);
  return response.payload;
};

type CoursesCategoryState = {
  categories: CourseCategory[];
  pagination: Pagination | null;
  selectedCategory: CourseCategory | null;
  isLoading: boolean;
  error: string | null;

  listCategories: (query?: ListCourseCategoriesQuery) => Promise<CourseCategory[]>;
  getCategory: (categoryId: string) => Promise<CourseCategory>;
  createCategory: (data: CreateCourseCategoryRequest) => Promise<CourseCategory>;
  updateCategory: (categoryId: string, data: UpdateCourseCategoryRequest) => Promise<CourseCategory>;
  deleteCategory: (categoryId: string) => Promise<void>;
  clearSelectedCategory: () => void;
  clearError: () => void;
};

export const useCoursesCategoryStore = create<CoursesCategoryState>()((set) => ({
  categories: [],
  pagination: null,
  selectedCategory: null,
  isLoading: false,
  error: null,

  listCategories: async (query) => {
    const response = await coursesCategoryApi.listCategories(query);
    const categories = unwrap(response, "Lay danh sach loai khoa hoc that bai");
    set({ categories, pagination: response.pagination ?? null });
    return categories;
  },

  getCategory: async (categoryId) => {
    const response = await coursesCategoryApi.getCategory(categoryId);
    const category = unwrap(response, "Lay thong tin loai khoa hoc that bai");
    set({ selectedCategory: category });
    return category;
  },

  createCategory: async (data) => {
    const response = await coursesCategoryApi.createCategory(data);
    const category = unwrap(response, "Tao loai khoa hoc that bai");
    set((state) => ({ categories: [category, ...state.categories], selectedCategory: category }));
    return category;
  },

  updateCategory: async (categoryId, data) => {
    const response = await coursesCategoryApi.updateCategory(categoryId, data);
    const updated = unwrap(response, "Cap nhat loai khoa hoc that bai");
    set((state) => ({
      categories: state.categories.map((item) => (item.id === updated.id ? updated : item)),
      selectedCategory: state.selectedCategory?.id === updated.id ? updated : state.selectedCategory,
    }));
    return updated;
  },

  deleteCategory: async (categoryId) => {
    const response = await coursesCategoryApi.deleteCategory(categoryId);
    unwrap(response, "Xoa loai khoa hoc that bai");
    set((state) => ({
      categories: state.categories.filter((item) => item.id !== categoryId),
      selectedCategory: state.selectedCategory?.id === categoryId ? null : state.selectedCategory,
    }));
  },

  clearSelectedCategory: () => set({ selectedCategory: null }),
  clearError: () => set({ error: null }),
}));
