export type AssignmentQuestionOption = {
  id: string;
  question_id: string;
  option_text: string;
  is_correct: boolean;
  order_index: number;
};

export type CreateAssignmentQuestionOptionRequest = {
  option_text: string;
  is_correct?: boolean;
  order_index?: number;
};

export type UpdateAssignmentQuestionOptionRequest = {
  option_text?: string | null;
  is_correct?: boolean | null;
  order_index?: number | null;
};
