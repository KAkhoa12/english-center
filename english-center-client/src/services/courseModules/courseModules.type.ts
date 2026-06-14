type MediaRef = {
  id: string;
  bucket?: string;
  object_name?: string;
  original_filename?: string | null;
  content_type?: string | null;
  size?: number | null;
  url?: string | null;
};

type ModuleLessonRef = {
  id: string;
  course_id: string;
  module_id: string | null;
  media_id: string | null;
  thumbnail: MediaRef | null;
  title: string;
  description: string | null;
  order_index: number;
  estimated_duration_minutes: number | null;
  status: string;
};

export type CourseModule = {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  media_id: string | null;
  media: MediaRef | null;
  order_index: number;
  status: string;
  lessons?: ModuleLessonRef[];
};

export type CreateCourseModuleRequest = {
  title: string;
  description?: string | null;
  media_id?: string | null;
  order_index?: number;
};

export type UpdateCourseModuleRequest = {
  title?: string | null;
  description?: string | null;
  media_id?: string | null;
  order_index?: number | null;
  status?: string | null;
};
