import { create } from "zustand";

import type { ApiResponse } from "@/shared/types/response";

import { classSchedulesApi } from "./classSchedules.api";
import type { ClassSchedule, CreateClassScheduleRequest, UpdateClassScheduleRequest } from "./classSchedules.type";

const unwrap = <T>(response: ApiResponse<T>, fallbackMessage: string): T => {
  if (!response.success) throw new Error(response.message || fallbackMessage);
  return response.payload;
};

type ClassSchedulesState = {
  schedules: ClassSchedule[];
  isLoading: boolean;
  error: string | null;
  message: string | null;

  listClassSchedules: (classId: string) => Promise<ClassSchedule[]>;
  createClassSchedule: (classId: string, data: CreateClassScheduleRequest) => Promise<ClassSchedule>;
  updateClassSchedule: (scheduleId: string, data: UpdateClassScheduleRequest) => Promise<ClassSchedule>;
  deleteClassSchedule: (scheduleId: string) => Promise<void>;
  clearError: () => void;
};

export const useClassSchedulesStore = create<ClassSchedulesState>()((set) => ({
  schedules: [],
  isLoading: false,
  error: null,
  message: null,

  listClassSchedules: async (classId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await classSchedulesApi.listClassSchedules(classId);
      const schedules = unwrap(response, "Lay lich hoc trong tuan that bai");
      set({ schedules, isLoading: false });
      return schedules;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Lay lich hoc trong tuan that bai";
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  createClassSchedule: async (classId, data) => {
    const response = await classSchedulesApi.createClassSchedule(classId, data);
    const schedule = unwrap(response, "Them lich hoc trong tuan that bai");
    set((state) => ({ schedules: [...state.schedules, schedule], message: "Them lich hoc trong tuan thanh cong" }));
    return schedule;
  },

  updateClassSchedule: async (scheduleId, data) => {
    const response = await classSchedulesApi.updateClassSchedule(scheduleId, data);
    const schedule = unwrap(response, "Cap nhat lich hoc trong tuan that bai");
    set((state) => ({
      schedules: state.schedules.map((item) => (item.id === schedule.id ? schedule : item)),
      message: "Cap nhat lich hoc trong tuan thanh cong",
    }));
    return schedule;
  },

  deleteClassSchedule: async (scheduleId) => {
    const response = await classSchedulesApi.deleteClassSchedule(scheduleId);
    unwrap(response, "Xoa lich hoc trong tuan that bai");
    set((state) => ({
      schedules: state.schedules.filter((item) => item.id !== scheduleId),
      message: "Xoa lich hoc trong tuan thanh cong",
    }));
  },

  clearError: () => set({ error: null }),
}));
