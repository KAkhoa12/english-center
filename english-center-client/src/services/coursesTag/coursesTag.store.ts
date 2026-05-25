import { create } from "zustand";

import { coursesTagApi } from "./coursesTag.api";
import type { Pagination } from "@/shared/types/response";
import type {
  CourseTag,
  CreateCourseTagRequest,
  ListCourseTagsQuery,
  UpdateCourseTagRequest,
} from "./coursesTag.type";

type CoursesTagState = {
  tags: CourseTag[];
  pagination: Pagination | null;
  selectedTag: CourseTag | null;
  isLoading: boolean;
  error: string | null;

  listTags: (query?: ListCourseTagsQuery) => Promise<CourseTag[]>;
  getTag: (tagId: string) => Promise<CourseTag>;
  createTag: (data: CreateCourseTagRequest) => Promise<CourseTag>;
  updateTag: (tagId: string, data: UpdateCourseTagRequest) => Promise<CourseTag>;
  deleteTag: (tagId: string) => Promise<void>;
  clearSelectedTag: () => void;
  clearError: () => void;
};

export const useCoursesTagStore = create<CoursesTagState>()((set) => ({
  tags: [],
  pagination: null,
  selectedTag: null,
  isLoading: false,
  error: null,

  listTags: async (query) => {
    try {
      set({ isLoading: true, error: null });
      const response = await coursesTagApi.listTags(query);
      set({
        tags: response.payload,
        pagination: response.pagination ?? null,
        isLoading: false,
        error: null,
      });
      return response.payload;
    } catch {
      set({ isLoading: false, error: "Lấy danh sách tag khóa học thất bại" });
      throw new Error("Lấy danh sách tag khóa học thất bại");
    }
  },

  getTag: async (tagId) => {
    try {
      set({ isLoading: true, error: null });
      const tag = await coursesTagApi.getTag(tagId);
      set({ selectedTag: tag, isLoading: false, error: null });
      return tag;
    } catch {
      set({ isLoading: false, error: "Lấy thông tin tag khóa học thất bại" });
      throw new Error("Lấy thông tin tag khóa học thất bại");
    }
  },

  createTag: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const tag = await coursesTagApi.createTag(data);
      set((state) => ({
        tags: [tag, ...state.tags],
        selectedTag: tag,
        isLoading: false,
        error: null,
      }));
      return tag;
    } catch {
      set({ isLoading: false, error: "Tạo tag khóa học thất bại" });
      throw new Error("Tạo tag khóa học thất bại");
    }
  },

  updateTag: async (tagId, data) => {
    try {
      set({ isLoading: true, error: null });
      const updated = await coursesTagApi.updateTag(tagId, data);
      set((state) => ({
        tags: state.tags.map((item) => (item.id === updated.id ? updated : item)),
        selectedTag: state.selectedTag?.id === updated.id ? updated : state.selectedTag,
        isLoading: false,
        error: null,
      }));
      return updated;
    } catch {
      set({ isLoading: false, error: "Cập nhật tag khóa học thất bại" });
      throw new Error("Cập nhật tag khóa học thất bại");
    }
  },

  deleteTag: async (tagId) => {
    try {
      set({ isLoading: true, error: null });
      await coursesTagApi.deleteTag(tagId);
      set((state) => ({
        tags: state.tags.filter((item) => item.id !== tagId),
        selectedTag: state.selectedTag?.id === tagId ? null : state.selectedTag,
        isLoading: false,
        error: null,
      }));
    } catch {
      set({ isLoading: false, error: "Xóa tag khóa học thất bại" });
      throw new Error("Xóa tag khóa học thất bại");
    }
  },

  clearSelectedTag: () => {
    set({ selectedTag: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
