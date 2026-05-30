import { apiClient } from "@/config/api-client";

import type {
  CreateSubmissionAnswerRequest,
  SubmissionAnswer,
  UpdateSubmissionAnswerRequest,
} from "./submissionAnswers.type";

export const submissionAnswersApi = {
  createAnswer: (submissionId: string, data: CreateSubmissionAnswerRequest) =>
    apiClient.post<SubmissionAnswer, CreateSubmissionAnswerRequest>(`/submissions/${submissionId}/answers`, data),

  listAnswers: (submissionId: string) =>
    apiClient.get<SubmissionAnswer[]>(`/submissions/${submissionId}/answers`),

  updateAnswer: (answerId: string, data: UpdateSubmissionAnswerRequest) =>
    apiClient.patch<SubmissionAnswer, UpdateSubmissionAnswerRequest>(`/submission-answers/${answerId}`, data),

  deleteAnswer: (answerId: string) =>
    apiClient.delete<void>(`/submission-answers/${answerId}`),
};
