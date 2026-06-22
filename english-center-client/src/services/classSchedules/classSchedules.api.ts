import { apiClient } from "@/config/api-client";

import type { ClassSchedule, CreateClassScheduleRequest, UpdateClassScheduleRequest } from "./classSchedules.type";

export const classSchedulesApi = {
  listClassSchedules: (classId: string) =>
    apiClient.get<ClassSchedule[]>(`/classes/${classId}/schedules`),

  createClassSchedule: (classId: string, data: CreateClassScheduleRequest) =>
    apiClient.post<ClassSchedule, CreateClassScheduleRequest>(`/classes/${classId}/schedules`, data),

  updateClassSchedule: (scheduleId: string, data: UpdateClassScheduleRequest) =>
    apiClient.patch<ClassSchedule, UpdateClassScheduleRequest>(`/classes/schedules/${scheduleId}`, data),

  deleteClassSchedule: (scheduleId: string) =>
    apiClient.delete<void>(`/classes/schedules/${scheduleId}`),
};
