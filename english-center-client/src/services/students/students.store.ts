import { create } from "zustand";

import type { ApiResponse, Pagination } from "@/shared/types/response";

import { studentsApi } from "./students.api";
import type {
  ListStudentsQuery,
  Student,
  StudentCreateRequest,
  StudentUpdateRequest,
} from "./students.type";

const unwrap = <T>(response: ApiResponse<T>, fallbackMessage: string): T => {
  if (!response.success) throw new Error(response.message || fallbackMessage);
  return response.payload;
};

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
    const response = await studentsApi.listStudents(query);
    const students = unwrap(response, "Lay danh sach hoc vien that bai");
    set({ students, pagination: response.pagination ?? null });
    return students;
  },

  getStudent: async (studentId) => {
    const response = await studentsApi.getStudent(studentId);
    const item = unwrap(response, "Lay thong tin hoc vien that bai");
    set({ selectedStudent: item });
    return item;
  },

  createStudent: async (data) => {
    const response = await studentsApi.createStudent(data);
    const item = unwrap(response, "Tao hoc vien that bai");
    set((state) => ({ students: [item, ...state.students], selectedStudent: item }));
    return item;
  },

  updateStudent: async (studentId, data) => {
    const response = await studentsApi.updateStudent(studentId, data);
    const item = unwrap(response, "Cap nhat hoc vien that bai");
    set((state) => ({
      students: state.students.map((x) => (x.id === item.id ? item : x)),
      selectedStudent: state.selectedStudent?.id === item.id ? item : state.selectedStudent,
    }));
    return item;
  },

  updateStudentAvatar: async (studentId, file) => {
    const response = await studentsApi.updateStudentAvatar(studentId, file);
    const item = unwrap(response, "Cap nhat avatar hoc vien that bai");
    set((state) => ({
      students: state.students.map((x) => (x.id === item.id ? item : x)),
      selectedStudent: state.selectedStudent?.id === item.id ? item : state.selectedStudent,
    }));
    return item;
  },

  deleteStudent: async (studentId) => {
    const response = await studentsApi.deleteStudent(studentId);
    unwrap(response, "Xoa hoc vien that bai");
    set((state) => ({
      students: state.students.filter((x) => x.id !== studentId),
      selectedStudent: state.selectedStudent?.id === studentId ? null : state.selectedStudent,
    }));
  },

  clearSelectedStudent: () => set({ selectedStudent: null }),
  clearError: () => set({ error: null }),
}));
