import { create } from "zustand";

import type { ApiResponse } from "@/shared/types/response";

import { filesApi } from "./files.api";
import type {
  BucketObjectListPayload,
  BucketPayload,
  BucketType,
  PresignedUrlPayload,
  UploadedFilePayload,
} from "./files.type";

const unwrap = <T>(response: ApiResponse<T>, fallbackMessage: string): T => {
  if (!response.success) throw new Error(response.message || fallbackMessage);
  return response.payload;
};

type FilesState = {
  uploadedFile: UploadedFilePayload | null;
  presignedUrl: PresignedUrlPayload | null;
  buckets: BucketPayload[];
  bucketObjects: BucketObjectListPayload | null;
  isLoading: boolean;
  error: string | null;

  uploadFile: (file: File, bucketType: BucketType, folder?: string | null) => Promise<UploadedFilePayload>;
  getPresignedUrl: (bucketType: BucketType, objectName: string) => Promise<PresignedUrlPayload>;
  listBuckets: () => Promise<BucketPayload[]>;
  listBucketObjects: (
    bucketType: BucketType,
    query?: { prefix?: string | null; images_only?: boolean }
  ) => Promise<BucketObjectListPayload>;
  deleteFile: (bucketType: BucketType, objectName: string) => Promise<{ bucket: string; object_name: string } | null>;
  clearUploadedFile: () => void;
  clearError: () => void;
};

export const useFilesStore = create<FilesState>()((set) => ({
  uploadedFile: null,
  presignedUrl: null,
  buckets: [],
  bucketObjects: null,
  isLoading: false,
  error: null,

  uploadFile: async (file, bucketType, folder) => {
    try {
      set({ isLoading: true, error: null });
      const response = await filesApi.uploadFile(file, bucketType, folder);
      const uploadedFile = unwrap(response, "Tai tep len that bai");
      set({ uploadedFile, isLoading: false, error: null });
      return uploadedFile;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Tai tep len that bai";
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  getPresignedUrl: async (bucketType, objectName) => {
    const response = await filesApi.getPresignedUrl(bucketType, objectName);
    const presignedUrl = unwrap(response, "Lay URL tep that bai");
    set({ presignedUrl });
    return presignedUrl;
  },

  listBuckets: async () => {
    const response = await filesApi.listBuckets();
    const buckets = unwrap(response, "Lay danh sach bucket that bai");
    set({ buckets });
    return buckets;
  },

  listBucketObjects: async (bucketType, query) => {
    const response = await filesApi.listBucketObjects(bucketType, query);
    const bucketObjects = unwrap(response, "Lay danh sach tep that bai");
    set({ bucketObjects });
    return bucketObjects;
  },

  deleteFile: async (bucketType, objectName) => {
    const response = await filesApi.deleteFile(bucketType, objectName);
    const deletedFile = unwrap(response, "Xoa tep that bai");
    return deletedFile;
  },

  clearUploadedFile: () => set({ uploadedFile: null }),
  clearError: () => set({ error: null }),
}));
