import { apiClient } from "@/config/api-client";

import type {
  Assignment,
  AssignmentAttachment,
  AssignmentAttachmentCreateRequest,
  AssignmentAttachmentUpdateRequest,
  AssignmentCreateRequest,
  AssignmentGrade,
  AssignmentGradeCreateRequest,
  AssignmentGradeUpdateRequest,
  AssignmentSubmission,
  AssignmentSubmissionCreateRequest,
  AssignmentSubmissionUpdateRequest,
  AssignmentUpdateRequest,
  ListAssignmentsQuery,
  ListSubmissionsQuery,
} from "./assignments.type";

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

export const assignmentsApi = {
  createAssignment: (classId: string, data: AssignmentCreateRequest) =>
    apiClient.post<Assignment, AssignmentCreateRequest>(
      `/classes/${classId}/assignments`,
      data
    ),

  listClassAssignments: (classId: string, query?: ListAssignmentsQuery) =>
    apiClient.getWithMeta<Assignment[]>(
      appendQuery(`/classes/${classId}/assignments`, query)
    ),

  createLessonAssignment: (lessonId: string, data: AssignmentCreateRequest) =>
    apiClient.post<Assignment, AssignmentCreateRequest>(
      `/lessons/${lessonId}/assignments`,
      data
    ),

  listLessonAssignments: (lessonId: string, query?: ListAssignmentsQuery) =>
    apiClient.getWithMeta<Assignment[]>(
      appendQuery(`/lessons/${lessonId}/assignments`, query)
    ),

  getAssignment: (assignmentId: string) =>
    apiClient.get<Assignment>(`/assignments/${assignmentId}`),

  updateAssignment: (assignmentId: string, data: AssignmentUpdateRequest) =>
    apiClient.patch<Assignment, AssignmentUpdateRequest>(
      `/assignments/${assignmentId}`,
      data
    ),

  deleteAssignment: (assignmentId: string) =>
    apiClient.delete<void>(`/assignments/${assignmentId}`),

  publishAssignment: (assignmentId: string) =>
    apiClient.patch<Assignment, undefined>(`/assignments/${assignmentId}/publish`),

  closeAssignment: (assignmentId: string) =>
    apiClient.patch<Assignment, undefined>(`/assignments/${assignmentId}/close`),

  myAssignments: (query?: ListAssignmentsQuery) =>
    apiClient.getWithMeta<Assignment[]>(
      appendQuery("/students/me/assignments", query)
    ),

  createAttachment: (assignmentId: string, data: AssignmentAttachmentCreateRequest) =>
    apiClient.post<AssignmentAttachment, AssignmentAttachmentCreateRequest>(
      `/assignments/${assignmentId}/attachments`,
      data
    ),

  listAttachments: (assignmentId: string) =>
    apiClient.get<AssignmentAttachment[]>(
      `/assignments/${assignmentId}/attachments`
    ),

  updateAttachment: (attachmentId: string, data: AssignmentAttachmentUpdateRequest) =>
    apiClient.patch<AssignmentAttachment, AssignmentAttachmentUpdateRequest>(
      `/assignment-attachments/${attachmentId}`,
      data
    ),

  deleteAttachment: (attachmentId: string) =>
    apiClient.delete<void>(`/assignment-attachments/${attachmentId}`),

  submitAssignment: (assignmentId: string, data: AssignmentSubmissionCreateRequest) =>
    apiClient.post<AssignmentSubmission, AssignmentSubmissionCreateRequest>(
      `/assignments/${assignmentId}/submissions`,
      data
    ),

  listSubmissions: (assignmentId: string, query?: ListSubmissionsQuery) =>
    apiClient.getWithMeta<AssignmentSubmission[]>(
      appendQuery(`/assignments/${assignmentId}/submissions`, query)
    ),

  getSubmission: (submissionId: string) =>
    apiClient.get<AssignmentSubmission>(`/submissions/${submissionId}`),

  updateSubmission: (submissionId: string, data: AssignmentSubmissionUpdateRequest) =>
    apiClient.patch<AssignmentSubmission, AssignmentSubmissionUpdateRequest>(
      `/submissions/${submissionId}`,
      data
    ),

  deleteSubmission: (submissionId: string) =>
    apiClient.delete<void>(`/submissions/${submissionId}`),

  mySubmissions: (query?: ListSubmissionsQuery) =>
    apiClient.getWithMeta<AssignmentSubmission[]>(
      appendQuery("/students/me/submissions", query)
    ),

  gradeSubmission: (submissionId: string, data: AssignmentGradeCreateRequest) =>
    apiClient.post<AssignmentGrade, AssignmentGradeCreateRequest>(
      `/submissions/${submissionId}/grade`,
      data
    ),

  getSubmissionGrade: (submissionId: string) =>
    apiClient.get<AssignmentGrade>(`/submissions/${submissionId}/grade`),

  updateGrade: (gradeId: string, data: AssignmentGradeUpdateRequest) =>
    apiClient.patch<AssignmentGrade, AssignmentGradeUpdateRequest>(
      `/assignment-grades/${gradeId}`,
      data
    ),

  deleteGrade: (gradeId: string) =>
    apiClient.delete<void>(`/assignment-grades/${gradeId}`),

  getStudentGrades: (studentId: string, query?: ListSubmissionsQuery) =>
    apiClient.getWithMeta<AssignmentGrade[]>(
      appendQuery(`/students/${studentId}/assignment-grades`, query)
    ),
};
