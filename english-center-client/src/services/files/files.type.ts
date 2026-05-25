import type { ApiResponse } from "../common/common.type";

export type BucketType = "avatar" | "material" | "submission" | "video" | "export";

export type UploadedFilePayload = {
  bucket: string;
  object_name: string;
  original_filename: string;
  content_type: string | null;
  size: number;
  presigned_url: string;
};

export type PresignedUrlPayload = {
  bucket: string;
  object_name: string;
  url: string;
  expires_in: number;
};

export type BucketPayload = { bucket: string };

export type BucketObjectListPayload = {
  bucket: string;
  prefix: string | null;
  items: Array<Record<string, unknown>>;
};

export type UploadFileResponse = ApiResponse<UploadedFilePayload>;
export type PresignedUrlResponse = ApiResponse<PresignedUrlPayload>;
export type ListBucketsResponse = ApiResponse<BucketPayload[]>;
export type ListBucketObjectsResponse = ApiResponse<BucketObjectListPayload>;
export type DeleteFileResponse = ApiResponse<{ bucket: string; object_name: string } | null>;
