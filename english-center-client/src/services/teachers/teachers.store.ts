import { create } from "zustand";

import type { Pagination } from "@/shared/types/response";

import { teachersApi } from "./teachers.api";
import type {
  ListTeachersQuery,
  Teacher,
  TeacherCreateRequest,
  TeacherUpdateRequest,
} from "./teachers.type";

type TeachersState = {
  teachers: Teacher[];
  pagination: Pagination | null;
  selectedTeacher: Teacher | null;
  isLoading: boolean;
  error: string | null;

  listTeachers: (query?: ListTeachersQuery) => Promise<Teacher[]>;
  getTeacher: (teacherId: string) => Promise<Teacher>;
  createTeacher: (data: TeacherCreateRequest) => Promise<Teacher>;
  updateTeacher: (teacherId: string, data: TeacherUpdateRequest) => Promise<Teacher>;
  updateTeacherAvatar: (teacherId: string, file: File) => Promise<Teacher>;
  deleteTeacher: (teacherId: string) => Promise<void>;
  clearSelectedTeacher: () => void;
  clearError: () => void;
};

export const useTeachersStore = create<TeachersState>()((set) => ({
  teachers: [],
  pagination: null,
  selectedTeacher: null,
  isLoading: false,
  error: null,

  listTeachers: async (query) => {
    try {
      set({ isLoading: true, error: null });
      const response = await teachersApi.listTeachers(query);
      set({ teachers: response.payload, pagination: response.pagination ?? null, isLoading: false, error: null });
      return response.payload;
    } catch {
      set({ isLoading: false, error: "Lấy danh sách giáo viên thất bại" });
      throw new Error("Lấy danh sách giáo viên thất bại");
    }
  },

  getTeacher: async (teacherId) => {
    const item = await teachersApi.getTeacher(teacherId);
    set({ selectedTeacher: item });
    return item;
  },

  createTeacher: async (data) => {
    const item = await teachersApi.createTeacher(data);
    set((state) => ({ teachers: [item, ...state.teachers], selectedTeacher: item }));
    return item;
  },

  updateTeacher: async (teacherId, data) => {
    const item = await teachersApi.updateTeacher(teacherId, data);
    set((state) => ({
      teachers: state.teachers.map((x) => (x.id === item.id ? item : x)),
      selectedTeacher: state.selectedTeacher?.id === item.id ? item : state.selectedTeacher,
    }));
    return item;
  },

  updateTeacherAvatar: async (teacherId, file) => {
    const item = await teachersApi.updateTeacherAvatar(teacherId, file);
    set((state) => ({
      teachers: state.teachers.map((x) => (x.id === item.id ? item : x)),
      selectedTeacher: state.selectedTeacher?.id === item.id ? item : state.selectedTeacher,
    }));
    return item;
  },

  deleteTeacher: async (teacherId) => {
    await teachersApi.deleteTeacher(teacherId);
    set((state) => ({
      teachers: state.teachers.filter((x) => x.id !== teacherId),
      selectedTeacher: state.selectedTeacher?.id === teacherId ? null : state.selectedTeacher,
    }));
  },

  clearSelectedTeacher: () => set({ selectedTeacher: null }),
  clearError: () => set({ error: null }),
}));
