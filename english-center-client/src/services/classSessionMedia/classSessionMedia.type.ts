export type SessionMediaFile = {
  id: string;
  bucket: string;
  object_name: string;
  original_filename: string | null;
  content_type: string | null;
  size: number | null;
  url: string | null;
};

export type ClassSessionMedia = {
  id: string;
  class_session_id: string;
  media_id: string;
  title: string | null;
  description: string | null;
  order_index: number;
  media: SessionMediaFile | null;
};

export type CreateClassSessionMediaRequest = {
  media_id: string;
  title?: string | null;
  description?: string | null;
  order_index?: number;
};

export type UpdateClassSessionMediaRequest = {
  title?: string | null;
  description?: string | null;
  order_index?: number | null;
};

export type UploadClassSessionMediaRequest = {
  file: File;
  title?: string | null;
  description?: string | null;
  order_index?: number;
};
