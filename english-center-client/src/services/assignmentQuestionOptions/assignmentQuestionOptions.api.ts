import { apiClient } from "@/config/api-client";

import type {
  AssignmentQuestionOption,
  CreateAssignmentQuestionOptionRequest,
  UpdateAssignmentQuestionOptionRequest,
} from "./assignmentQuestionOptions.type";

export const assignmentQuestionOptionsApi = {
  createOption: (questionId: string, data: CreateAssignmentQuestionOptionRequest) =>
    apiClient.post<AssignmentQuestionOption, CreateAssignmentQuestionOptionRequest>(
      `/assignment-questions/${questionId}/options`,
      data
    ),

  listOptions: (questionId: string) =>
    apiClient.get<AssignmentQuestionOption[]>(`/assignment-questions/${questionId}/options`),

  updateOption: (optionId: string, data: UpdateAssignmentQuestionOptionRequest) =>
    apiClient.patch<AssignmentQuestionOption, UpdateAssignmentQuestionOptionRequest>(
      `/assignment-question-options/${optionId}`,
      data
    ),

  deleteOption: (optionId: string) =>
    apiClient.delete<void>(`/assignment-question-options/${optionId}`),
};
