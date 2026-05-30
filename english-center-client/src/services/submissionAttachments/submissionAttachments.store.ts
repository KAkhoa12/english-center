import { create } from "zustand";

import type { ApiResponse } from "@/shared/types/response";

import { submissionAttachmentsApi } from "./submissionAttachments.api";
import type {
  CreateSubmissionAttachmentRequest,
  SubmissionAttachment,
} from "./submissionAttachments.type";

const unwrap = <T>(response: ApiResponse<T>, fallbackMessage: string): T => {
  if (!response.success) throw new Error(response.message || fallbackMessage);
  return response.payload;
};

type SubmissionAttachmentsState = {
  attachments: SubmissionAttachment[];
  selectedAttachment: SubmissionAttachment | null;
  isLoading: boolean;
  error: string | null;

  createAttachment: (submissionId: string, data: CreateSubmissionAttachmentRequest) => Promise<SubmissionAttachment>;
  listAttachments: (submissionId: string) => Promise<SubmissionAttachment[]>;
  deleteAttachment: (attachmentId: string) => Promise<void>;
  clearSelectedAttachment: () => void;
  clearError: () => void;
};

export const useSubmissionAttachmentsStore = create<SubmissionAttachmentsState>()((set) => ({
  attachments: [],
  selectedAttachment: null,
  isLoading: false,
  error: null,

  createAttachment: async (submissionId, data) => {
    const response = await submissionAttachmentsApi.createAttachment(submissionId, data);
    const attachment = unwrap(response, "Tao tep dinh kem bai nop that bai");
    set((state) => ({ attachments: [...state.attachments, attachment], selectedAttachment: attachment }));
    return attachment;
  },

  listAttachments: async (submissionId) => {
    const response = await submissionAttachmentsApi.listAttachments(submissionId);
    const attachments = unwrap(response, "Lay danh sach tep dinh kem that bai");
    set({ attachments });
    return attachments;
  },

  deleteAttachment: async (attachmentId) => {
    const response = await submissionAttachmentsApi.deleteAttachment(attachmentId);
    unwrap(response, "Xoa tep dinh kem that bai");
    set((state) => ({
      attachments: state.attachments.filter((item) => item.id !== attachmentId),
      selectedAttachment: state.selectedAttachment?.id === attachmentId ? null : state.selectedAttachment,
    }));
  },

  clearSelectedAttachment: () => set({ selectedAttachment: null }),
  clearError: () => set({ error: null }),
}));
