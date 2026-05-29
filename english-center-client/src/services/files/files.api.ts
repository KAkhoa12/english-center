import { apiClient } from "@/config/api-client";

import type {
  BucketObjectListPayload,
  BucketPayload,
  BucketType,
  PresignedUrlPayload,
  UploadedFilePayload,
} from "./files.type";

const appendQuery = (url: string, query?: Record<string, unknown>): string => {
  if (!query) return url;

  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    params.set(key, String(value));
  });

  const queryString = params.toString();
  return queryString ? `${url}?${queryString}` : url;
};

export const filesApi = {
  uploadFile: (file: File, bucketType: BucketType, folder?: string | null) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket_type", bucketType);
    if (folder) formData.append("folder", folder);

    return apiClient.post<UploadedFilePayload, FormData>("/files/upload", formData);
  },

  getPresignedUrl: (bucketType: BucketType, objectName: string) =>
    apiClient.get<PresignedUrlPayload>(
      appendQuery("/files/presigned-url", {
        bucket_type: bucketType,
        object_name: objectName,
      })
    ),

  listBuckets: () =>
    apiClient.get<BucketPayload[]>("/files/buckets"),

  listBucketObjects: (
    bucketType: BucketType,
    query?: { prefix?: string | null; images_only?: boolean }
  ) =>
    apiClient.get<BucketObjectListPayload>(
      appendQuery(`/files/buckets/${bucketType}/objects`, query)
    ),

  deleteFile: (bucketType: BucketType, objectName: string) =>
    apiClient.delete<{ bucket: string; object_name: string } | null>(
      appendQuery("/files", {
        bucket_type: bucketType,
        object_name: objectName,
      })
    ),
};
