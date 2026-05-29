import { create } from "zustand";

import type { ApiResponse, Pagination } from "@/shared/types/response";

import { assignmentsApi } from "./assignments.api";
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

const unwrap = <T>(response: ApiResponse<T>, fallbackMessage: string): T => {
  if (!response.success) throw new Error(response.message || fallbackMessage);
  return response.payload;
};

type AssignmentsState = {
  assignments: Assignment[];
  submissions: AssignmentSubmission[];
  attachments: AssignmentAttachment[];
  grades: AssignmentGrade[];
  pagination: Pagination | null;
  selectedAssignment: Assignment | null;
  selectedSubmission: AssignmentSubmission | null;
  isLoading: boolean;
  error: string | null;

  createAssignment: (classId: string, data: AssignmentCreateRequest) => Promise<Assignment>;
  listClassAssignments: (classId: string, query?: ListAssignmentsQuery) => Promise<Assignment[]>;
  getAssignment: (assignmentId: string) => Promise<Assignment>;
  updateAssignment: (assignmentId: string, data: AssignmentUpdateRequest) => Promise<Assignment>;
  deleteAssignment: (assignmentId: string) => Promise<void>;
  publishAssignment: (assignmentId: string) => Promise<Assignment>;
  closeAssignment: (assignmentId: string) => Promise<Assignment>;
  myAssignments: (query?: ListAssignmentsQuery) => Promise<Assignment[]>;
  createAttachment: (assignmentId: string, data: AssignmentAttachmentCreateRequest) => Promise<AssignmentAttachment>;
  listAttachments: (assignmentId: string) => Promise<AssignmentAttachment[]>;
  updateAttachment: (attachmentId: string, data: AssignmentAttachmentUpdateRequest) => Promise<AssignmentAttachment>;
  deleteAttachment: (attachmentId: string) => Promise<void>;
  submitAssignment: (assignmentId: string, data: AssignmentSubmissionCreateRequest) => Promise<AssignmentSubmission>;
  listSubmissions: (assignmentId: string, query?: ListSubmissionsQuery) => Promise<AssignmentSubmission[]>;
  getSubmission: (submissionId: string) => Promise<AssignmentSubmission>;
  updateSubmission: (submissionId: string, data: AssignmentSubmissionUpdateRequest) => Promise<AssignmentSubmission>;
  deleteSubmission: (submissionId: string) => Promise<void>;
  mySubmissions: (query?: ListSubmissionsQuery) => Promise<AssignmentSubmission[]>;
  gradeSubmission: (submissionId: string, data: AssignmentGradeCreateRequest) => Promise<AssignmentGrade>;
  getSubmissionGrade: (submissionId: string) => Promise<AssignmentGrade>;
  updateGrade: (gradeId: string, data: AssignmentGradeUpdateRequest) => Promise<AssignmentGrade>;
  deleteGrade: (gradeId: string) => Promise<void>;
  getStudentGrades: (studentId: string, query?: ListSubmissionsQuery) => Promise<AssignmentGrade[]>;
  clearSelectedAssignment: () => void;
  clearSelectedSubmission: () => void;
  clearError: () => void;
};

export const useAssignmentsStore = create<AssignmentsState>()((set) => ({
  assignments: [],
  submissions: [],
  attachments: [],
  grades: [],
  pagination: null,
  selectedAssignment: null,
  selectedSubmission: null,
  isLoading: false,
  error: null,

  createAssignment: async (classId, data) => {
    const response = await assignmentsApi.createAssignment(classId, data);
    const assignment = unwrap(response, "Tao bai tap that bai");
    set((state) => ({ assignments: [assignment, ...state.assignments], selectedAssignment: assignment }));
    return assignment;
  },

  listClassAssignments: async (classId, query) => {
    const response = await assignmentsApi.listClassAssignments(classId, query);
    const assignments = unwrap(response, "Lay danh sach bai tap that bai");
    set({ assignments, pagination: response.pagination ?? null });
    return assignments;
  },

  getAssignment: async (assignmentId) => {
    const response = await assignmentsApi.getAssignment(assignmentId);
    const assignment = unwrap(response, "Lay thong tin bai tap that bai");
    set({ selectedAssignment: assignment });
    return assignment;
  },

  updateAssignment: async (assignmentId, data) => {
    const response = await assignmentsApi.updateAssignment(assignmentId, data);
    const assignment = unwrap(response, "Cap nhat bai tap that bai");
    set((state) => ({
      assignments: state.assignments.map((item) => (item.id === assignment.id ? assignment : item)),
      selectedAssignment: state.selectedAssignment?.id === assignment.id ? assignment : state.selectedAssignment,
    }));
    return assignment;
  },

  deleteAssignment: async (assignmentId) => {
    const response = await assignmentsApi.deleteAssignment(assignmentId);
    unwrap(response, "Xoa bai tap that bai");
    set((state) => ({
      assignments: state.assignments.filter((item) => item.id !== assignmentId),
      selectedAssignment: state.selectedAssignment?.id === assignmentId ? null : state.selectedAssignment,
    }));
  },

  publishAssignment: async (assignmentId) => {
    const response = await assignmentsApi.publishAssignment(assignmentId);
    const assignment = unwrap(response, "Xuat ban bai tap that bai");
    set((state) => ({
      assignments: state.assignments.map((item) => (item.id === assignment.id ? assignment : item)),
      selectedAssignment: state.selectedAssignment?.id === assignment.id ? assignment : state.selectedAssignment,
    }));
    return assignment;
  },

  closeAssignment: async (assignmentId) => {
    const response = await assignmentsApi.closeAssignment(assignmentId);
    const assignment = unwrap(response, "Dong bai tap that bai");
    set((state) => ({
      assignments: state.assignments.map((item) => (item.id === assignment.id ? assignment : item)),
      selectedAssignment: state.selectedAssignment?.id === assignment.id ? assignment : state.selectedAssignment,
    }));
    return assignment;
  },

  myAssignments: async (query) => {
    const response = await assignmentsApi.myAssignments(query);
    const assignments = unwrap(response, "Lay bai tap cua toi that bai");
    set({ assignments, pagination: response.pagination ?? null });
    return assignments;
  },

  createAttachment: async (assignmentId, data) => {
    const response = await assignmentsApi.createAttachment(assignmentId, data);
    const attachment = unwrap(response, "Tao tep dinh kem that bai");
    set((state) => ({ attachments: [...state.attachments, attachment] }));
    return attachment;
  },

  listAttachments: async (assignmentId) => {
    const response = await assignmentsApi.listAttachments(assignmentId);
    const attachments = unwrap(response, "Lay tep dinh kem that bai");
    set({ attachments });
    return attachments;
  },

  updateAttachment: async (attachmentId, data) => {
    const response = await assignmentsApi.updateAttachment(attachmentId, data);
    const attachment = unwrap(response, "Cap nhat tep dinh kem that bai");
    set((state) => ({
      attachments: state.attachments.map((item) => (item.id === attachment.id ? attachment : item)),
    }));
    return attachment;
  },

  deleteAttachment: async (attachmentId) => {
    const response = await assignmentsApi.deleteAttachment(attachmentId);
    unwrap(response, "Xoa tep dinh kem that bai");
    set((state) => ({ attachments: state.attachments.filter((item) => item.id !== attachmentId) }));
  },

  submitAssignment: async (assignmentId, data) => {
    const response = await assignmentsApi.submitAssignment(assignmentId, data);
    const submission = unwrap(response, "Nop bai tap that bai");
    set((state) => ({ submissions: [submission, ...state.submissions], selectedSubmission: submission }));
    return submission;
  },

  listSubmissions: async (assignmentId, query) => {
    const response = await assignmentsApi.listSubmissions(assignmentId, query);
    const submissions = unwrap(response, "Lay danh sach bai nop that bai");
    set({ submissions, pagination: response.pagination ?? null });
    return submissions;
  },

  getSubmission: async (submissionId) => {
    const response = await assignmentsApi.getSubmission(submissionId);
    const submission = unwrap(response, "Lay thong tin bai nop that bai");
    set({ selectedSubmission: submission });
    return submission;
  },

  updateSubmission: async (submissionId, data) => {
    const response = await assignmentsApi.updateSubmission(submissionId, data);
    const submission = unwrap(response, "Cap nhat bai nop that bai");
    set((state) => ({
      submissions: state.submissions.map((item) => (item.id === submission.id ? submission : item)),
      selectedSubmission: state.selectedSubmission?.id === submission.id ? submission : state.selectedSubmission,
    }));
    return submission;
  },

  deleteSubmission: async (submissionId) => {
    const response = await assignmentsApi.deleteSubmission(submissionId);
    unwrap(response, "Xoa bai nop that bai");
    set((state) => ({
      submissions: state.submissions.filter((item) => item.id !== submissionId),
      selectedSubmission: state.selectedSubmission?.id === submissionId ? null : state.selectedSubmission,
    }));
  },

  mySubmissions: async (query) => {
    const response = await assignmentsApi.mySubmissions(query);
    const submissions = unwrap(response, "Lay bai nop cua toi that bai");
    set({ submissions, pagination: response.pagination ?? null });
    return submissions;
  },

  gradeSubmission: async (submissionId, data) => {
    const response = await assignmentsApi.gradeSubmission(submissionId, data);
    const grade = unwrap(response, "Cham diem bai nop that bai");
    set((state) => ({ grades: [grade, ...state.grades] }));
    return grade;
  },

  getSubmissionGrade: async (submissionId) => {
    const response = await assignmentsApi.getSubmissionGrade(submissionId);
    const grade = unwrap(response, "Lay diem bai nop that bai");
    set((state) => ({ grades: [grade, ...state.grades.filter((item) => item.id !== grade.id)] }));
    return grade;
  },

  updateGrade: async (gradeId, data) => {
    const response = await assignmentsApi.updateGrade(gradeId, data);
    const grade = unwrap(response, "Cap nhat diem that bai");
    set((state) => ({ grades: state.grades.map((item) => (item.id === grade.id ? grade : item)) }));
    return grade;
  },

  deleteGrade: async (gradeId) => {
    const response = await assignmentsApi.deleteGrade(gradeId);
    unwrap(response, "Xoa diem that bai");
    set((state) => ({ grades: state.grades.filter((item) => item.id !== gradeId) }));
  },

  getStudentGrades: async (studentId, query) => {
    const response = await assignmentsApi.getStudentGrades(studentId, query);
    const grades = unwrap(response, "Lay diem hoc vien that bai");
    set({ grades, pagination: response.pagination ?? null });
    return grades;
  },

  clearSelectedAssignment: () => set({ selectedAssignment: null }),
  clearSelectedSubmission: () => set({ selectedSubmission: null }),
  clearError: () => set({ error: null }),
}));
