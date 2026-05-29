import { create } from "zustand";

import type { ApiResponse } from "@/shared/types/response";
import { classesApi } from "./classes.api";
import type {
  AddStudentToClassRequest,
  ClassCreateRequest,
  ClassItem,
  ClassStudentItem,
  ClassUpdateRequest,
  ListClassesQuery,
  ListClassStudentsQuery,
  ListCourseClassesQuery,
  ListStudentClassesQuery,
  UpdateClassStudentRequest,
} from "./classes.type";

const unwrap = <T>(response: ApiResponse<T>, fallbackMessage: string): T => {
  if (!response.success) throw new Error(response.message || fallbackMessage);
  return response.payload;
};

type ClassesState = {
  classes: ClassItem[];
  selectedClass: ClassItem | null;
  classStudents: ClassStudentItem[];
  isLoading: boolean;
  error: string | null;

  listClasses: (query?: ListClassesQuery) => Promise<ClassItem[]>;
  getClass: (classId: string) => Promise<ClassItem>;
  createClass: (data: ClassCreateRequest) => Promise<ClassItem>;
  updateClass: (classId: string, data: ClassUpdateRequest) => Promise<ClassItem>;
  deleteClass: (classId: string) => Promise<void>;
  listCourseClasses: (courseId: string, query?: ListCourseClassesQuery) => Promise<ClassItem[]>;
  listStudentClasses: (studentId: string, query?: ListStudentClassesQuery) => Promise<ClassItem[]>;
  listClassStudents: (classId: string, query?: ListClassStudentsQuery) => Promise<ClassStudentItem[]>;
  addStudentToClass: (classId: string, data: AddStudentToClassRequest) => Promise<ClassStudentItem>;
  updateClassStudent: (classId: string, studentId: string, data: UpdateClassStudentRequest) => Promise<ClassStudentItem>;
  removeClassStudent: (classId: string, studentId: string) => Promise<void>;
  clearSelectedClass: () => void;
  clearError: () => void;
};

export const useClassesStore = create<ClassesState>()((set) => ({
  classes: [],
  selectedClass: null,
  classStudents: [],
  isLoading: false,
  error: null,

  listClasses: async (query) => {
    const response = await classesApi.listClasses(query);
    const classes = unwrap(response, "Lay danh sach lop hoc that bai");
    set({ classes });
    return classes;
  },

  getClass: async (classId) => {
    const response = await classesApi.getClass(classId);
    const classItem = unwrap(response, "Lay thong tin lop hoc that bai");
    set({ selectedClass: classItem });
    return classItem;
  },

  createClass: async (data) => {
    const response = await classesApi.createClass(data);
    const classItem = unwrap(response, "Tao lop hoc that bai");
    set((state) => ({ classes: [classItem, ...state.classes], selectedClass: classItem }));
    return classItem;
  },

  updateClass: async (classId, data) => {
    const response = await classesApi.updateClass(classId, data);
    const updated = unwrap(response, "Cap nhat lop hoc that bai");
    set((state) => ({
      classes: state.classes.map((item) => (item.id === updated.id ? updated : item)),
      selectedClass: state.selectedClass?.id === updated.id ? updated : state.selectedClass,
    }));
    return updated;
  },

  deleteClass: async (classId) => {
    const response = await classesApi.deleteClass(classId);
    unwrap(response, "Xoa lop hoc that bai");
    set((state) => ({
      classes: state.classes.filter((item) => item.id !== classId),
      selectedClass: state.selectedClass?.id === classId ? null : state.selectedClass,
      classStudents: state.selectedClass?.id === classId ? [] : state.classStudents,
    }));
  },

  listCourseClasses: async (courseId, query) => {
    const response = await classesApi.listCourseClasses(courseId, query);
    const classes = unwrap(response, "Lay danh sach lop theo khoa hoc that bai");
    set({ classes });
    return classes;
  },

  listStudentClasses: async (studentId, query) => {
    const response = await classesApi.listStudentClasses(studentId, query);
    const classes = unwrap(response, "Lay danh sach lop cua hoc vien that bai");
    set({ classes });
    return classes;
  },

  listClassStudents: async (classId, query) => {
    const response = await classesApi.listClassStudents(classId, query);
    const classStudents = unwrap(response, "Lay danh sach hoc vien trong lop that bai");
    set({ classStudents });
    return classStudents;
  },

  addStudentToClass: async (classId, data) => {
    const response = await classesApi.addStudentToClass(classId, data);
    const classStudent = unwrap(response, "Them hoc vien vao lop that bai");
    set((state) => ({
      classStudents: [...state.classStudents, classStudent],
      selectedClass:
        state.selectedClass?.id === classId
          ? { ...state.selectedClass, current_students_count: state.selectedClass.current_students_count + 1 }
          : state.selectedClass,
    }));
    return classStudent;
  },

  updateClassStudent: async (classId, studentId, data) => {
    const response = await classesApi.updateClassStudent(classId, studentId, data);
    const updated = unwrap(response, "Cap nhat hoc vien trong lop that bai");
    set((state) => ({
      classStudents: state.classStudents.map((item) =>
        item.student_id === updated.student_id ? updated : item
      ),
    }));
    return updated;
  },

  removeClassStudent: async (classId, studentId) => {
    const response = await classesApi.removeClassStudent(classId, studentId);
    unwrap(response, "Xoa hoc vien khoi lop that bai");
    set((state) => ({
      classStudents: state.classStudents.filter((item) => item.student_id !== studentId),
      selectedClass:
        state.selectedClass?.id === classId
          ? {
              ...state.selectedClass,
              current_students_count: Math.max(0, state.selectedClass.current_students_count - 1),
            }
          : state.selectedClass,
    }));
  },

  clearSelectedClass: () => set({ selectedClass: null, classStudents: [] }),
  clearError: () => set({ error: null }),
}));
