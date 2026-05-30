import { apiClient } from "@/config/api-client";

import type {
  AssignmentQuestion,
  CreateAssignmentQuestionRequest,
  UpdateAssignmentQuestionRequest,
} from "./assignmentQuestions.type";

export const assignmentQuestionsApi = {
  createQuestion: (assignmentId: string, data: CreateAssignmentQuestionRequest) =>
    apiClient.post<AssignmentQuestion, CreateAssignmentQuestionRequest>(`/assignments/${assignmentId}/questions`, data),

  listQuestions: (assignmentId: string) =>
    apiClient.get<AssignmentQuestion[]>(`/assignments/${assignmentId}/questions`),

  updateQuestion: (questionId: string, data: UpdateAssignmentQuestionRequest) =>
    apiClient.patch<AssignmentQuestion, UpdateAssignmentQuestionRequest>(`/assignment-questions/${questionId}`, data),

  deleteQuestion: (questionId: string) =>
    apiClient.delete<void>(`/assignment-questions/${questionId}`),
};
