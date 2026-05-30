export type AssignmentQuestionOption = {
  id: string;
  question_id: string;
  option_text: string;
  is_correct: boolean;
  order_index: number;
};

export type AssignmentQuestion = {
  id: string;
  assignment_id: string;
  question_type: string;
  question_text: string;
  score: number;
  order_index: number;
  is_required: boolean;
  options: AssignmentQuestionOption[];
};

export type CreateAssignmentQuestionRequest = {
  question_type: string;
  question_text: string;
  score?: number;
  order_index?: number;
  is_required?: boolean;
};

export type UpdateAssignmentQuestionRequest = {
  question_type?: string | null;
  question_text?: string | null;
  score?: number | null;
  order_index?: number | null;
  is_required?: boolean | null;
};
