import type { SortOrder, UserRef } from "@/shared/types/response";

export type AssignmentStatus = string;
export type SubmissionStatus = string;
export type GradingMethod = string;

export type AssignmentTypeRef = {
  id: string;
  code: string;
  name: string;
};

export type AssignmentAttachment = {
  id: string;
  assignment_id?: string;
  submission_id?: string;
  title: string | null;
  description?: string | null;
  attachment_type?: string;
  file_bucket: string | null;
  file_object_name: string | null;
  external_url?: string | null;
  original_filename?: string | null;
  content_type?: string | null;
  file_size?: number | null;
  order_index?: number;
  presigned_url: string | null;
};

export type AssignmentGrade = {
  id: string;
  submission_id: string;
  assignment_id: string;
  student_id: string;
  score: number | null;
  max_score: number;
  feedback: string | null;
  rubric: Record<string, unknown> | null;
  grading_method: GradingMethod;
  ai_grading_result_id: string | null;
  graded_by: string | null;
  graded_at: string | null;
};

export type AssignmentSubmission = {
  id: string;
  assignment_id: string;
  student_id: string;
  user_id: string;
  content: string | null;
  status: SubmissionStatus;
  submitted_at: string | null;
  is_late: boolean;
  attempt_number: number;
  student: UserRef;
  assignment: { id: string; title: string; max_score: number };
  attachments: AssignmentAttachment[];
  grade: AssignmentGrade | null;
};

export type Assignment = {
  id: string;
  class_id: string | null;
  session_id: string | null;
  lesson_id: string | null;
  title: string;
  description: string | null;
  instruction: string | null;
  assignment_type_id: string;
  assignment_type: AssignmentTypeRef | null;
  status: AssignmentStatus;
  max_score: number;
  due_at: string | null;
  allow_late_submission: boolean;
  class: { id: string; name: string } | null;
  session: { id: string; title: string } | null;
  lesson: { id: string; title: string } | null;
  created_at: string;
  updated_at: string;
  attachments?: AssignmentAttachment[];
  my_submission?: AssignmentSubmission | null;
  submission_count?: number;
  graded_count?: number;
};

export type AssignmentCreateRequest = {
  session_id?: string | null;
  lesson_id?: string | null;
  title: string;
  description?: string | null;
  instruction?: string | null;
  assignment_type_id: string;
  status?: AssignmentStatus;
  max_score?: number;
  due_at?: string | null;
  allow_late_submission?: boolean;
};

export type AssignmentUpdateRequest = {
  session_id?: string | null;
  lesson_id?: string | null;
  title?: string | null;
  description?: string | null;
  instruction?: string | null;
  assignment_type_id?: string | null;
  status?: AssignmentStatus | null;
  max_score?: number | null;
  due_at?: string | null;
  allow_late_submission?: boolean | null;
};

export type AssignmentAttachmentCreateRequest = {
  title?: string | null;
  description?: string | null;
  attachment_type: string;
  file_bucket?: string | null;
  file_object_name?: string | null;
  external_url?: string | null;
  content_type?: string | null;
  file_size?: number | null;
  order_index?: number;
};

export type AssignmentAttachmentUpdateRequest = Partial<AssignmentAttachmentCreateRequest>;

export type SubmissionAttachmentCreateRequest = {
  title?: string | null;
  file_bucket: string;
  file_object_name: string;
  original_filename?: string | null;
  content_type?: string | null;
  file_size?: number | null;
};

export type AssignmentSubmissionCreateRequest = {
  content?: string | null;
  status?: SubmissionStatus;
  attachments?: SubmissionAttachmentCreateRequest[] | null;
};

export type AssignmentSubmissionUpdateRequest = {
  content?: string | null;
  status?: SubmissionStatus | null;
};

export type AssignmentGradeCreateRequest = {
  score?: number | null;
  feedback?: string | null;
  rubric?: Record<string, unknown> | null;
  grading_method?: GradingMethod;
};

export type AssignmentGradeUpdateRequest = AssignmentGradeCreateRequest;

export type ListAssignmentsQuery = {
  page?: number;
  page_size?: number;
  search?: string;
  sort_by?: string;
  sort_order?: SortOrder;
  status?: AssignmentStatus;
  assignment_type_id?: string;
  session_id?: string;
  lesson_id?: string;
  due_from?: string;
  due_to?: string;
};

export type ListSubmissionsQuery = {
  page?: number;
  page_size?: number;
  search?: string;
  status?: SubmissionStatus;
  is_late?: boolean;
  graded?: boolean;
};
