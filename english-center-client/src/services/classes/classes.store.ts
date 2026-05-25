import { create } from "zustand";

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

  listClassStudents: (
    classId: string,
    query?: ListClassStudentsQuery
  ) => Promise<ClassStudentItem[]>;
  addStudentToClass: (
    classId: string,
    data: AddStudentToClassRequest
  ) => Promise<ClassStudentItem>;
  updateClassStudent: (
    classId: string,
    studentId: string,
    data: UpdateClassStudentRequest
  ) => Promise<ClassStudentItem>;
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
    try {
      set({ isLoading: true, error: null });

      const classes = await classesApi.listClasses(query);
      set({ classes, isLoading: false, error: null });

      return classes;
    } catch {
      set({ isLoading: false, error: "Lấy danh sách lớp học thất bại" });
      throw new Error("Lấy danh sách lớp học thất bại");
    }
  },

  getClass: async (classId) => {
    try {
      set({ isLoading: true, error: null });

      const classItem = await classesApi.getClass(classId);
      set({ selectedClass: classItem, isLoading: false, error: null });

      return classItem;
    } catch {
      set({ isLoading: false, error: "Lấy thông tin lớp học thất bại" });
      throw new Error("Lấy thông tin lớp học thất bại");
    }
  },

  createClass: async (data) => {
    try {
      set({ isLoading: true, error: null });

      const classItem = await classesApi.createClass(data);
      set((state) => ({
        classes: [classItem, ...state.classes],
        selectedClass: classItem,
        isLoading: false,
        error: null,
      }));

      return classItem;
    } catch {
      set({ isLoading: false, error: "Tạo lớp học thất bại" });
      throw new Error("Tạo lớp học thất bại");
    }
  },

  updateClass: async (classId, data) => {
    try {
      set({ isLoading: true, error: null });

      const updated = await classesApi.updateClass(classId, data);
      set((state) => ({
        classes: state.classes.map((item) => (item.id === updated.id ? updated : item)),
        selectedClass: state.selectedClass?.id === updated.id ? updated : state.selectedClass,
        isLoading: false,
        error: null,
      }));

      return updated;
    } catch {
      set({ isLoading: false, error: "Cập nhật lớp học thất bại" });
      throw new Error("Cập nhật lớp học thất bại");
    }
  },

  deleteClass: async (classId) => {
    try {
      set({ isLoading: true, error: null });

      await classesApi.deleteClass(classId);
      set((state) => ({
        classes: state.classes.filter((item) => item.id !== classId),
        selectedClass: state.selectedClass?.id === classId ? null : state.selectedClass,
        classStudents: state.selectedClass?.id === classId ? [] : state.classStudents,
        isLoading: false,
        error: null,
      }));
    } catch {
      set({ isLoading: false, error: "Xóa lớp học thất bại" });
      throw new Error("Xóa lớp học thất bại");
    }
  },

  listCourseClasses: async (courseId, query) => {
    try {
      set({ isLoading: true, error: null });

      const classes = await classesApi.listCourseClasses(courseId, query);
      set({ classes, isLoading: false, error: null });

      return classes;
    } catch {
      set({ isLoading: false, error: "Lấy danh sách lớp theo khóa học thất bại" });
      throw new Error("Lấy danh sách lớp theo khóa học thất bại");
    }
  },

  listStudentClasses: async (studentId, query) => {
    try {
      set({ isLoading: true, error: null });

      const classes = await classesApi.listStudentClasses(studentId, query);
      set({ classes, isLoading: false, error: null });

      return classes;
    } catch {
      set({ isLoading: false, error: "Lấy danh sách lớp của học viên thất bại" });
      throw new Error("Lấy danh sách lớp của học viên thất bại");
    }
  },

  listClassStudents: async (classId, query) => {
    try {
      set({ isLoading: true, error: null });

      const classStudents = await classesApi.listClassStudents(classId, query);
      set({ classStudents, isLoading: false, error: null });

      return classStudents;
    } catch {
      set({ isLoading: false, error: "Lấy danh sách học viên trong lớp thất bại" });
      throw new Error("Lấy danh sách học viên trong lớp thất bại");
    }
  },

  addStudentToClass: async (classId, data) => {
    try {
      set({ isLoading: true, error: null });

      const classStudent = await classesApi.addStudentToClass(classId, data);
      set((state) => ({
        classStudents: [...state.classStudents, classStudent],
        selectedClass:
          state.selectedClass?.id === classId
            ? {
                ...state.selectedClass,
                current_students_count: state.selectedClass.current_students_count + 1,
              }
            : state.selectedClass,
        isLoading: false,
        error: null,
      }));

      return classStudent;
    } catch {
      set({ isLoading: false, error: "Thêm học viên vào lớp thất bại" });
      throw new Error("Thêm học viên vào lớp thất bại");
    }
  },

  updateClassStudent: async (classId, studentId, data) => {
    try {
      set({ isLoading: true, error: null });

      const updated = await classesApi.updateClassStudent(classId, studentId, data);
      set((state) => ({
        classStudents: state.classStudents.map((item) =>
          item.student_id === updated.student_id ? updated : item
        ),
        isLoading: false,
        error: null,
      }));

      return updated;
    } catch {
      set({ isLoading: false, error: "Cập nhật học viên trong lớp thất bại" });
      throw new Error("Cập nhật học viên trong lớp thất bại");
    }
  },

  removeClassStudent: async (classId, studentId) => {
    try {
      set({ isLoading: true, error: null });

      await classesApi.removeClassStudent(classId, studentId);
      set((state) => ({
        classStudents: state.classStudents.filter((item) => item.student_id !== studentId),
        selectedClass:
          state.selectedClass?.id === classId
            ? {
                ...state.selectedClass,
                current_students_count: Math.max(
                  0,
                  state.selectedClass.current_students_count - 1
                ),
              }
            : state.selectedClass,
        isLoading: false,
        error: null,
      }));
    } catch {
      set({ isLoading: false, error: "Xóa học viên khỏi lớp thất bại" });
      throw new Error("Xóa học viên khỏi lớp thất bại");
    }
  },

  clearSelectedClass: () => {
    set({
      selectedClass: null,
      classStudents: [],
    });
  },

  clearError: () => {
    set({ error: null });
  },
}));
