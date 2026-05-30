export type SubmissionAttachment = {
  id: string;
  submission_id: string;
  title: string | null;
  file_bucket: string;
  file_object_name: string;
  original_filename: string | null;
  content_type: string | null;
  file_size: number | null;
  presigned_url: string | null;
};

export type CreateSubmissionAttachmentRequest = {
  title?: string | null;
  file_bucket: string;
  file_object_name: string;
  original_filename?: string | null;
  content_type?: string | null;
  file_size?: number | null;
};
