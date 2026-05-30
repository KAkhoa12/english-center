export type SubmissionAnswerMedia = {
  id: string;
  bucket: string;
  object_name: string;
  original_filename: string | null;
  content_type: string | null;
  size: number | null;
};

export type SubmissionAnswer = {
  id: string;
  submission_id: string;
  question_id: string;
  answer_text: string | null;
  selected_option_ids: string[] | null;
  is_correct: boolean | null;
  score: number | null;
  media: SubmissionAnswerMedia[];
};

export type CreateSubmissionAnswerRequest = {
  question_id: string;
  answer_text?: string | null;
  selected_option_ids?: string[] | null;
  media_ids?: string[] | null;
};

export type UpdateSubmissionAnswerRequest = {
  answer_text?: string | null;
  selected_option_ids?: string[] | null;
  media_ids?: string[] | null;
  is_correct?: boolean | null;
  score?: number | null;
};
