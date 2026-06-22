export type ClassScheduleName = "T2" | "T3" | "T4" | "T5" | "T6" | "T7" | "CN";

export type ClassSchedule = {
  id: string;
  class_id: string;
  schedule_name: ClassScheduleName;
  start_time: string;
  end_time: string;
  created_at?: string;
  updated_at?: string;
};

export type CreateClassScheduleRequest = {
  schedule_name: ClassScheduleName;
  start_time: string;
  end_time: string;
};

export type UpdateClassScheduleRequest = {
  schedule_name?: ClassScheduleName | null;
  start_time?: string | null;
  end_time?: string | null;
};
