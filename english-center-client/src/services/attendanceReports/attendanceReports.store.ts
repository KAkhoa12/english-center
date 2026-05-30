import { create } from "zustand";

import type { ApiResponse, Pagination } from "@/shared/types/response";

import { attendanceReportsApi } from "./attendanceReports.api";
import type {
  ClassAttendanceSummary,
  ClassStudentAttendanceSummary,
  ListClassStudentsSummaryQuery,
  StudentAttendanceSummary,
} from "./attendanceReports.type";

const unwrap = <T>(response: ApiResponse<T>, fallbackMessage: string): T => {
  if (!response.success) throw new Error(response.message || fallbackMessage);
  return response.payload;
};

type AttendanceReportsState = {
  classSummary: ClassAttendanceSummary | null;
  classStudentsSummary: ClassStudentAttendanceSummary[];
  classStudentsPagination: Pagination | null;
  studentSummary: StudentAttendanceSummary | null;
  isLoading: boolean;
  error: string | null;

  getClassSummary: (classId: string) => Promise<ClassAttendanceSummary>;
  getClassStudentsSummary: (
    classId: string,
    query?: ListClassStudentsSummaryQuery
  ) => Promise<ClassStudentAttendanceSummary[]>;
  getStudentSummary: (studentId: string) => Promise<StudentAttendanceSummary>;
  clearClassSummary: () => void;
  clearStudentSummary: () => void;
  clearError: () => void;
};

export const useAttendanceReportsStore = create<AttendanceReportsState>()((set) => ({
  classSummary: null,
  classStudentsSummary: [],
  classStudentsPagination: null,
  studentSummary: null,
  isLoading: false,
  error: null,

  getClassSummary: async (classId) => {
    const response = await attendanceReportsApi.getClassSummary(classId);
    const summary = unwrap(response, "Lay tong quan diem danh lop that bai");
    set({ classSummary: summary });
    return summary;
  },

  getClassStudentsSummary: async (classId, query) => {
    const response = await attendanceReportsApi.getClassStudentsSummary(classId, query);
    const summaries = unwrap(response, "Lay tong quan diem danh hoc vien that bai");
    set({
      classStudentsSummary: summaries,
      classStudentsPagination: response.pagination ?? null,
    });
    return summaries;
  },

  getStudentSummary: async (studentId) => {
    const response = await attendanceReportsApi.getStudentSummary(studentId);
    const summary = unwrap(response, "Lay tong quan diem danh hoc vien that bai");
    set({ studentSummary: summary });
    return summary;
  },

  clearClassSummary: () => set({ classSummary: null, classStudentsSummary: [], classStudentsPagination: null }),
  clearStudentSummary: () => set({ studentSummary: null }),
  clearError: () => set({ error: null }),
}));
