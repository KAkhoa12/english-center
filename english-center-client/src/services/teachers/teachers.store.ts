import { create } from "zustand";

import type { ApiResponse, Pagination } from "@/shared/types/response";

import { teachersApi } from "./teachers.api";
import type {
  ListTeachersQuery,
  Teacher,
  TeacherCreateRequest,
  TeacherUpdateRequest,
} from "./teachers.type";

const unwrap = <T>(response: ApiResponse<T>, fallbackMessage: string): T => {
  if (!response.success) throw new Error(response.message || fallbackMessage);
  return response.payload;
};

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
    const response = await teachersApi.listTeachers(query);
    const teachers = unwrap(response, "Lay danh sach giao vien that bai");
    set({ teachers, pagination: response.pagination ?? null });
    return teachers;
  },

  getTeacher: async (teacherId) => {
    const response = await teachersApi.getTeacher(teacherId);
    const item = unwrap(response, "Lay thong tin giao vien that bai");
    set({ selectedTeacher: item });
    return item;
  },

  createTeacher: async (data) => {
    const response = await teachersApi.createTeacher(data);
    const item = unwrap(response, "Tao giao vien that bai");
    set((state) => ({ teachers: [item, ...state.teachers], selectedTeacher: item }));
    return item;
  },

  updateTeacher: async (teacherId, data) => {
    const response = await teachersApi.updateTeacher(teacherId, data);
    const item = unwrap(response, "Cap nhat giao vien that bai");
    set((state) => ({
      teachers: state.teachers.map((x) => (x.id === item.id ? item : x)),
      selectedTeacher: state.selectedTeacher?.id === item.id ? item : state.selectedTeacher,
    }));
    return item;
  },

  updateTeacherAvatar: async (teacherId, file) => {
    const response = await teachersApi.updateTeacherAvatar(teacherId, file);
    const item = unwrap(response, "Cap nhat avatar giao vien that bai");
    set((state) => ({
      teachers: state.teachers.map((x) => (x.id === item.id ? item : x)),
      selectedTeacher: state.selectedTeacher?.id === item.id ? item : state.selectedTeacher,
    }));
    return item;
  },

  deleteTeacher: async (teacherId) => {
    const response = await teachersApi.deleteTeacher(teacherId);
    unwrap(response, "Xoa giao vien that bai");
    set((state) => ({
      teachers: state.teachers.filter((x) => x.id !== teacherId),
      selectedTeacher: state.selectedTeacher?.id === teacherId ? null : state.selectedTeacher,
    }));
  },

  clearSelectedTeacher: () => set({ selectedTeacher: null }),
  clearError: () => set({ error: null }),
}));
