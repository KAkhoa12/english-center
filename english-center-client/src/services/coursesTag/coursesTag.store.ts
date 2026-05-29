import { create } from "zustand";

import type { ApiResponse, Pagination } from "@/shared/types/response";
import { coursesTagApi } from "./coursesTag.api";
import type {
  CourseTag,
  CreateCourseTagRequest,
  ListCourseTagsQuery,
  UpdateCourseTagRequest,
} from "./coursesTag.type";

const unwrap = <T>(response: ApiResponse<T>, fallbackMessage: string): T => {
  if (!response.success) throw new Error(response.message || fallbackMessage);
  return response.payload;
};

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
    const response = await coursesTagApi.listTags(query);
    const tags = unwrap(response, "Lay danh sach tag khoa hoc that bai");
    set({ tags, pagination: response.pagination ?? null });
    return tags;
  },

  getTag: async (tagId) => {
    const response = await coursesTagApi.getTag(tagId);
    const tag = unwrap(response, "Lay thong tin tag khoa hoc that bai");
    set({ selectedTag: tag });
    return tag;
  },

  createTag: async (data) => {
    const response = await coursesTagApi.createTag(data);
    const tag = unwrap(response, "Tao tag khoa hoc that bai");
    set((state) => ({ tags: [tag, ...state.tags], selectedTag: tag }));
    return tag;
  },

  updateTag: async (tagId, data) => {
    const response = await coursesTagApi.updateTag(tagId, data);
    const updated = unwrap(response, "Cap nhat tag khoa hoc that bai");
    set((state) => ({
      tags: state.tags.map((item) => (item.id === updated.id ? updated : item)),
      selectedTag: state.selectedTag?.id === updated.id ? updated : state.selectedTag,
    }));
    return updated;
  },

  deleteTag: async (tagId) => {
    const response = await coursesTagApi.deleteTag(tagId);
    unwrap(response, "Xoa tag khoa hoc that bai");
    set((state) => ({
      tags: state.tags.filter((item) => item.id !== tagId),
      selectedTag: state.selectedTag?.id === tagId ? null : state.selectedTag,
    }));
  },

  clearSelectedTag: () => set({ selectedTag: null }),
  clearError: () => set({ error: null }),
}));
