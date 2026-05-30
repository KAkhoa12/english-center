import { apiClient } from "@/config/api-client";

import type {
  CreateSubmissionAttachmentRequest,
  SubmissionAttachment,
} from "./submissionAttachments.type";

export const submissionAttachmentsApi = {
  createAttachment: (submissionId: string, data: CreateSubmissionAttachmentRequest) =>
    apiClient.post<SubmissionAttachment, CreateSubmissionAttachmentRequest>(
      `/submissions/${submissionId}/attachments`,
      data
    ),

  listAttachments: (submissionId: string) =>
    apiClient.get<SubmissionAttachment[]>(`/submissions/${submissionId}/attachments`),

  deleteAttachment: (attachmentId: string) =>
    apiClient.delete<void>(`/submission-attachments/${attachmentId}`),
};
