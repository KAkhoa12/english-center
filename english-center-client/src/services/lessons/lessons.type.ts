type MediaRef = {
  id: string;
  file_name?: string;
  file_type?: string;
  mime_type?: string;
  file_size?: number;
  storage_provider?: string;
  bucket_name?: string;
  object_name?: string;
  public_url?: string;
};

type LessonCourseRef = {
  id: string;
  name: string;
};

type LessonModuleRef = {
  id: string;
  title: string;
} | null;

export type LessonMaterialRef = {
  id: string;
  lesson_id: string;
  title: string;
  description: string | null;
  media_id: string | null;
  media: MediaRef | null;
  external_url: string | null;
  order_index: number;
  is_downloadable: boolean;
};

export type Lesson = {
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
  content?: string | null;
  course?: LessonCourseRef;
  module?: LessonModuleRef;
  materials?: LessonMaterialRef[];
};

export type CreateLessonRequest = {
  module_id?: string | null;
  media_id?: string | null;
  title: string;
  description?: string | null;
  content?: string | null;
  order_index?: number;
  estimated_duration_minutes?: number | null;
};

export type UpdateLessonRequest = {
  module_id?: string | null;
  media_id?: string | null;
  title?: string | null;
  description?: string | null;
  content?: string | null;
  order_index?: number | null;
  estimated_duration_minutes?: number | null;
  status?: string | null;
};

export type ListLessonsQuery = {
  page?: number;
  page_size?: number;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  module_id?: string;
  status?: string;
};

export type SetLessonThumbnailRequest = {
  media_id: string;
};
