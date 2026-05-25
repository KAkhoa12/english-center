import { create } from "zustand";

import { coursesCategoryApi } from "./coursesCategory.api";
import type { Pagination } from "@/shared/types/response";
import type {
  CourseCategory,
  CreateCourseCategoryRequest,
  ListCourseCategoriesQuery,
  UpdateCourseCategoryRequest,
} from "./coursesCategory.type";

type CoursesCategoryState = {
  categories: CourseCategory[];
  pagination: Pagination | null;
  selectedCategory: CourseCategory | null;
  isLoading: boolean;
  error: string | null;

  listCategories: (query?: ListCourseCategoriesQuery) => Promise<CourseCategory[]>;
  getCategory: (categoryId: string) => Promise<CourseCategory>;
  createCategory: (data: CreateCourseCategoryRequest) => Promise<CourseCategory>;
  updateCategory: (
    categoryId: string,
    data: UpdateCourseCategoryRequest
  ) => Promise<CourseCategory>;
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
    try {
      set({ isLoading: true, error: null });
      const response = await coursesCategoryApi.listCategories(query);
      set({
        categories: response.payload,
        pagination: response.pagination ?? null,
        isLoading: false,
        error: null,
      });
      return response.payload;
    } catch {
      set({ isLoading: false, error: "Lấy danh sách loại khóa học thất bại" });
      throw new Error("Lấy danh sách loại khóa học thất bại");
    }
  },

  getCategory: async (categoryId) => {
    try {
      set({ isLoading: true, error: null });
      const category = await coursesCategoryApi.getCategory(categoryId);
      set({ selectedCategory: category, isLoading: false, error: null });
      return category;
    } catch {
      set({ isLoading: false, error: "Lấy thông tin loại khóa học thất bại" });
      throw new Error("Lấy thông tin loại khóa học thất bại");
    }
  },

  createCategory: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const category = await coursesCategoryApi.createCategory(data);
      set((state) => ({
        categories: [category, ...state.categories],
        selectedCategory: category,
        isLoading: false,
        error: null,
      }));
      return category;
    } catch {
      set({ isLoading: false, error: "Tạo loại khóa học thất bại" });
      throw new Error("Tạo loại khóa học thất bại");
    }
  },

  updateCategory: async (categoryId, data) => {
    try {
      set({ isLoading: true, error: null });
      const updated = await coursesCategoryApi.updateCategory(categoryId, data);
      set((state) => ({
        categories: state.categories.map((item) =>
          item.id === updated.id ? updated : item
        ),
        selectedCategory:
          state.selectedCategory?.id === updated.id
            ? updated
            : state.selectedCategory,
        isLoading: false,
        error: null,
      }));
      return updated;
    } catch {
      set({ isLoading: false, error: "Cập nhật loại khóa học thất bại" });
      throw new Error("Cập nhật loại khóa học thất bại");
    }
  },

  deleteCategory: async (categoryId) => {
    try {
      set({ isLoading: true, error: null });
      await coursesCategoryApi.deleteCategory(categoryId);
      set((state) => ({
        categories: state.categories.filter((item) => item.id !== categoryId),
        selectedCategory:
          state.selectedCategory?.id === categoryId
            ? null
            : state.selectedCategory,
        isLoading: false,
        error: null,
      }));
    } catch {
      set({ isLoading: false, error: "Xóa loại khóa học thất bại" });
      throw new Error("Xóa loại khóa học thất bại");
    }
  },

  clearSelectedCategory: () => {
    set({ selectedCategory: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
