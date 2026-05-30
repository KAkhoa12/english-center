import { create } from "zustand";

import type { ApiResponse, Pagination } from "@/shared/types/response";

import { lessonsApi } from "./lessons.api";
import type {
  CreateLessonRequest,
  Lesson,
  ListLessonsQuery,
  SetLessonThumbnailRequest,
  UpdateLessonRequest,
} from "./lessons.type";

const unwrap = <T>(response: ApiResponse<T>, fallbackMessage: string): T => {
  if (!response.success) throw new Error(response.message || fallbackMessage);
  return response.payload;
};

type LessonsState = {
  lessons: Lesson[];
  pagination: Pagination | null;
  selectedLesson: Lesson | null;
  isLoading: boolean;
  error: string | null;

  createLesson: (courseId: string, data: CreateLessonRequest) => Promise<Lesson>;
  listLessons: (courseId: string, query?: ListLessonsQuery) => Promise<Lesson[]>;
  getLesson: (lessonId: string) => Promise<Lesson>;
  updateLesson: (lessonId: string, data: UpdateLessonRequest) => Promise<Lesson>;
  uploadLessonThumbnail: (lessonId: string, file: File) => Promise<Lesson>;
  setLessonThumbnail: (lessonId: string, data: SetLessonThumbnailRequest) => Promise<Lesson>;
  deleteLesson: (lessonId: string) => Promise<void>;
  clearSelectedLesson: () => void;
  clearError: () => void;
};

export const useLessonsStore = create<LessonsState>()((set) => ({
  lessons: [],
  pagination: null,
  selectedLesson: null,
  isLoading: false,
  error: null,

  createLesson: async (courseId, data) => {
    const response = await lessonsApi.createLesson(courseId, data);
    const lesson = unwrap(response, "Tao bai hoc that bai");
    set((state) => ({ lessons: [...state.lessons, lesson], selectedLesson: lesson }));
    return lesson;
  },

  listLessons: async (courseId, query) => {
    const response = await lessonsApi.listLessons(courseId, query);
    const lessons = unwrap(response, "Lay danh sach bai hoc that bai");
    set({ lessons, pagination: response.pagination ?? null });
    return lessons;
  },

  getLesson: async (lessonId) => {
    const response = await lessonsApi.getLesson(lessonId);
    const lesson = unwrap(response, "Lay chi tiet bai hoc that bai");
    set({ selectedLesson: lesson });
    return lesson;
  },

  updateLesson: async (lessonId, data) => {
    const response = await lessonsApi.updateLesson(lessonId, data);
    const lesson = unwrap(response, "Cap nhat bai hoc that bai");
    set((state) => ({
      lessons: state.lessons.map((item) => (item.id === lesson.id ? lesson : item)),
      selectedLesson: state.selectedLesson?.id === lesson.id ? lesson : state.selectedLesson,
    }));
    return lesson;
  },

  uploadLessonThumbnail: async (lessonId, file) => {
    const response = await lessonsApi.uploadLessonThumbnail(lessonId, file);
    const lesson = unwrap(response, "Tai thumbnail bai hoc that bai");
    set((state) => ({
      lessons: state.lessons.map((item) => (item.id === lesson.id ? lesson : item)),
      selectedLesson: state.selectedLesson?.id === lesson.id ? lesson : state.selectedLesson,
    }));
    return lesson;
  },

  setLessonThumbnail: async (lessonId, data) => {
    const response = await lessonsApi.setLessonThumbnail(lessonId, data);
    const lesson = unwrap(response, "Cap nhat thumbnail bai hoc that bai");
    set((state) => ({
      lessons: state.lessons.map((item) => (item.id === lesson.id ? lesson : item)),
      selectedLesson: state.selectedLesson?.id === lesson.id ? lesson : state.selectedLesson,
    }));
    return lesson;
  },

  deleteLesson: async (lessonId) => {
    const response = await lessonsApi.deleteLesson(lessonId);
    unwrap(response, "Xoa bai hoc that bai");
    set((state) => ({
      lessons: state.lessons.filter((item) => item.id !== lessonId),
      selectedLesson: state.selectedLesson?.id === lessonId ? null : state.selectedLesson,
    }));
  },

  clearSelectedLesson: () => set({ selectedLesson: null }),
  clearError: () => set({ error: null }),
}));
