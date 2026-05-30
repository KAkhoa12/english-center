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

export type LessonMaterial = {
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

export type CreateLessonMaterialRequest = {
  title: string;
  description?: string | null;
  media_id?: string | null;
  external_url?: string | null;
  order_index?: number;
  is_downloadable?: boolean;
};

export type UpdateLessonMaterialRequest = {
  title?: string | null;
  description?: string | null;
  media_id?: string | null;
  external_url?: string | null;
  order_index?: number | null;
  is_downloadable?: boolean | null;
};

export type UploadLessonMaterialRequest = {
  title: string;
  file: File;
  description?: string | null;
  external_url?: string | null;
  order_index?: number;
  is_downloadable?: boolean;
};

export type SetLessonMaterialMediaRequest = {
  media_id: string;
};
