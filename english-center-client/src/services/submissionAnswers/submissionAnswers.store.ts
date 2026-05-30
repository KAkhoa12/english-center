import { create } from "zustand";

import type { ApiResponse } from "@/shared/types/response";

import { submissionAnswersApi } from "./submissionAnswers.api";
import type {
  CreateSubmissionAnswerRequest,
  SubmissionAnswer,
  UpdateSubmissionAnswerRequest,
} from "./submissionAnswers.type";

const unwrap = <T>(response: ApiResponse<T>, fallbackMessage: string): T => {
  if (!response.success) throw new Error(response.message || fallbackMessage);
  return response.payload;
};

type SubmissionAnswersState = {
  answers: SubmissionAnswer[];
  selectedAnswer: SubmissionAnswer | null;
  isLoading: boolean;
  error: string | null;

  createAnswer: (submissionId: string, data: CreateSubmissionAnswerRequest) => Promise<SubmissionAnswer>;
  listAnswers: (submissionId: string) => Promise<SubmissionAnswer[]>;
  updateAnswer: (answerId: string, data: UpdateSubmissionAnswerRequest) => Promise<SubmissionAnswer>;
  deleteAnswer: (answerId: string) => Promise<void>;
  clearSelectedAnswer: () => void;
  clearError: () => void;
};

export const useSubmissionAnswersStore = create<SubmissionAnswersState>()((set) => ({
  answers: [],
  selectedAnswer: null,
  isLoading: false,
  error: null,

  createAnswer: async (submissionId, data) => {
    const response = await submissionAnswersApi.createAnswer(submissionId, data);
    const answer = unwrap(response, "Tao cau tra loi that bai");
    set((state) => ({ answers: [...state.answers, answer], selectedAnswer: answer }));
    return answer;
  },

  listAnswers: async (submissionId) => {
    const response = await submissionAnswersApi.listAnswers(submissionId);
    const answers = unwrap(response, "Lay danh sach cau tra loi that bai");
    set({ answers });
    return answers;
  },

  updateAnswer: async (answerId, data) => {
    const response = await submissionAnswersApi.updateAnswer(answerId, data);
    const answer = unwrap(response, "Cap nhat cau tra loi that bai");
    set((state) => ({
      answers: state.answers.map((item) => (item.id === answer.id ? answer : item)),
      selectedAnswer: state.selectedAnswer?.id === answer.id ? answer : state.selectedAnswer,
    }));
    return answer;
  },

  deleteAnswer: async (answerId) => {
    const response = await submissionAnswersApi.deleteAnswer(answerId);
    unwrap(response, "Xoa cau tra loi that bai");
    set((state) => ({
      answers: state.answers.filter((item) => item.id !== answerId),
      selectedAnswer: state.selectedAnswer?.id === answerId ? null : state.selectedAnswer,
    }));
  },

  clearSelectedAnswer: () => set({ selectedAnswer: null }),
  clearError: () => set({ error: null }),
}));
