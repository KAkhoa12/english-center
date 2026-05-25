import { create } from "zustand";

import type { Pagination } from "@/shared/types/response";

import { studentsApi } from "./students.api";
import type {
  ListStudentsQuery,
  Student,
  StudentCreateRequest,
  StudentUpdateRequest,
} from "./students.type";

type StudentsState = {
  students: Student[];
  pagination: Pagination | null;
  selectedStudent: Student | null;
  isLoading: boolean;
  error: string | null;

  listStudents: (query?: ListStudentsQuery) => Promise<Student[]>;
  getStudent: (studentId: string) => Promise<Student>;
  createStudent: (data: StudentCreateRequest) => Promise<Student>;
  updateStudent: (studentId: string, data: StudentUpdateRequest) => Promise<Student>;
  updateStudentAvatar: (studentId: string, file: File) => Promise<Student>;
  deleteStudent: (studentId: string) => Promise<void>;
  clearSelectedStudent: () => void;
  clearError: () => void;
};

export const useStudentsStore = create<StudentsState>()((set) => ({
  students: [],
  pagination: null,
  selectedStudent: null,
  isLoading: false,
  error: null,

  listStudents: async (query) => {
    try {
      set({ isLoading: true, error: null });
      const response = await studentsApi.listStudents(query);
      set({ students: response.payload, pagination: response.pagination ?? null, isLoading: false, error: null });
      return response.payload;
    } catch {
      set({ isLoading: false, error: "Lấy danh sách học viên thất bại" });
      throw new Error("Lấy danh sách học viên thất bại");
    }
  },

  getStudent: async (studentId) => {
    const item = await studentsApi.getStudent(studentId);
    set({ selectedStudent: item });
    return item;
  },

  createStudent: async (data) => {
    const item = await studentsApi.createStudent(data);
    set((state) => ({ students: [item, ...state.students], selectedStudent: item }));
    return item;
  },

  updateStudent: async (studentId, data) => {
    const item = await studentsApi.updateStudent(studentId, data);
    set((state) => ({
      students: state.students.map((x) => (x.id === item.id ? item : x)),
      selectedStudent: state.selectedStudent?.id === item.id ? item : state.selectedStudent,
    }));
    return item;
  },

  updateStudentAvatar: async (studentId, file) => {
    const item = await studentsApi.updateStudentAvatar(studentId, file);
    set((state) => ({
      students: state.students.map((x) => (x.id === item.id ? item : x)),
      selectedStudent: state.selectedStudent?.id === item.id ? item : state.selectedStudent,
    }));
    return item;
  },

  deleteStudent: async (studentId) => {
    await studentsApi.deleteStudent(studentId);
    set((state) => ({
      students: state.students.filter((x) => x.id !== studentId),
      selectedStudent: state.selectedStudent?.id === studentId ? null : state.selectedStudent,
    }));
  },

  clearSelectedStudent: () => set({ selectedStudent: null }),
  clearError: () => set({ error: null }),
}));
