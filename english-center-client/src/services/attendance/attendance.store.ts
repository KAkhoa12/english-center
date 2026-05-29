import { create } from "zustand";

import type { ApiResponse, Pagination } from "@/shared/types/response";

import { attendanceApi } from "./attendance.api";
import type {
  AttendanceBulkItemRequest,
  AttendanceItem,
  AttendanceUpdateRequest,
  ListAttendanceQuery,
  ListClassAttendanceQuery,
} from "./attendance.type";

const unwrap = <T>(response: ApiResponse<T>, fallbackMessage: string): T => {
  if (!response.success) throw new Error(response.message || fallbackMessage);
  return response.payload;
};

type AttendanceState = {
  attendance: AttendanceItem[];
  pagination: Pagination | null;
  isLoading: boolean;
  error: string | null;

  markAttendance: (sessionId: string, data: AttendanceBulkItemRequest[]) => Promise<AttendanceItem[]>;
  getSessionAttendance: (sessionId: string, query?: ListAttendanceQuery) => Promise<AttendanceItem[]>;
  updateAttendance: (attendanceId: string, data: AttendanceUpdateRequest) => Promise<AttendanceItem>;
  deleteAttendance: (attendanceId: string) => Promise<void>;
  getClassAttendance: (classId: string, query?: ListClassAttendanceQuery) => Promise<AttendanceItem[]>;
  getStudentAttendance: (
    studentId: string,
    query?: { page?: number; page_size?: number; class_id?: string }
  ) => Promise<AttendanceItem[]>;
  getMyAttendance: (query?: { page?: number; page_size?: number }) => Promise<AttendanceItem[]>;
  clearError: () => void;
};

export const useAttendanceStore = create<AttendanceState>()((set) => ({
  attendance: [],
  pagination: null,
  isLoading: false,
  error: null,

  markAttendance: async (sessionId, data) => {
    const response = await attendanceApi.markAttendance(sessionId, data);
    const attendance = unwrap(response, "Diem danh that bai");
    set({ attendance });
    return attendance;
  },

  getSessionAttendance: async (sessionId, query) => {
    const response = await attendanceApi.getSessionAttendance(sessionId, query);
    const attendance = unwrap(response, "Lay danh sach diem danh that bai");
    set({ attendance, pagination: response.pagination ?? null });
    return attendance;
  },

  updateAttendance: async (attendanceId, data) => {
    const response = await attendanceApi.updateAttendance(attendanceId, data);
    const item = unwrap(response, "Cap nhat diem danh that bai");
    set((state) => ({
      attendance: state.attendance.map((attendance) =>
        attendance.id === item.id ? item : attendance
      ),
    }));
    return item;
  },

  deleteAttendance: async (attendanceId) => {
    const response = await attendanceApi.deleteAttendance(attendanceId);
    unwrap(response, "Xoa diem danh that bai");
    set((state) => ({
      attendance: state.attendance.filter((item) => item.id !== attendanceId),
    }));
  },

  getClassAttendance: async (classId, query) => {
    const response = await attendanceApi.getClassAttendance(classId, query);
    const attendance = unwrap(response, "Lay diem danh lop hoc that bai");
    set({ attendance, pagination: response.pagination ?? null });
    return attendance;
  },

  getStudentAttendance: async (studentId, query) => {
    const response = await attendanceApi.getStudentAttendance(studentId, query);
    const attendance = unwrap(response, "Lay diem danh hoc vien that bai");
    set({ attendance, pagination: response.pagination ?? null });
    return attendance;
  },

  getMyAttendance: async (query) => {
    const response = await attendanceApi.getMyAttendance(query);
    const attendance = unwrap(response, "Lay diem danh cua toi that bai");
    set({ attendance, pagination: response.pagination ?? null });
    return attendance;
  },

  clearError: () => set({ error: null }),
}));
