import { create } from "zustand";

import type { ApiResponse } from "@/shared/types/response";

import { assignmentQuestionsApi } from "./assignmentQuestions.api";
import type {
  AssignmentQuestion,
  CreateAssignmentQuestionRequest,
  UpdateAssignmentQuestionRequest,
} from "./assignmentQuestions.type";

const unwrap = <T>(response: ApiResponse<T>, fallbackMessage: string): T => {
  if (!response.success) throw new Error(response.message || fallbackMessage);
  return response.payload;
};

type AssignmentQuestionsState = {
  questions: AssignmentQuestion[];
  questionsByAssignmentId: Record<string, AssignmentQuestion[]>;
  selectedQuestion: AssignmentQuestion | null;
  isLoading: boolean;
  error: string | null;

  createQuestion: (assignmentId: string, data: CreateAssignmentQuestionRequest) => Promise<AssignmentQuestion>;
  listQuestions: (assignmentId: string) => Promise<AssignmentQuestion[]>;
  updateQuestion: (questionId: string, data: UpdateAssignmentQuestionRequest) => Promise<AssignmentQuestion>;
  deleteQuestion: (questionId: string) => Promise<void>;
  clearSelectedQuestion: () => void;
  clearError: () => void;
};

export const useAssignmentQuestionsStore = create<AssignmentQuestionsState>()((set) => ({
  questions: [],
  questionsByAssignmentId: {},
  selectedQuestion: null,
  isLoading: false,
  error: null,

  createQuestion: async (assignmentId, data) => {
    const response = await assignmentQuestionsApi.createQuestion(assignmentId, data);
    const question = unwrap(response, "Tao cau hoi bai tap that bai");
    set((state) => ({
      questions: [...state.questions, question],
      questionsByAssignmentId: {
        ...state.questionsByAssignmentId,
        [assignmentId]: [...(state.questionsByAssignmentId[assignmentId] ?? []), question],
      },
      selectedQuestion: question,
    }));
    return question;
  },

  listQuestions: async (assignmentId) => {
    const response = await assignmentQuestionsApi.listQuestions(assignmentId);
    const questions = unwrap(response, "Lay danh sach cau hoi that bai");
    set((state) => ({
      questions,
      questionsByAssignmentId: {
        ...state.questionsByAssignmentId,
        [assignmentId]: questions,
      },
    }));
    return questions;
  },

  updateQuestion: async (questionId, data) => {
    const response = await assignmentQuestionsApi.updateQuestion(questionId, data);
    const question = unwrap(response, "Cap nhat cau hoi that bai");
    set((state) => ({
      questions: state.questions.map((item) => (item.id === question.id ? question : item)),
      questionsByAssignmentId: Object.fromEntries(
        Object.entries(state.questionsByAssignmentId).map(([assignmentId, items]) => [
          assignmentId,
          items.map((item) => (item.id === question.id ? question : item)),
        ]),
      ),
      selectedQuestion: state.selectedQuestion?.id === question.id ? question : state.selectedQuestion,
    }));
    return question;
  },

  deleteQuestion: async (questionId) => {
    const response = await assignmentQuestionsApi.deleteQuestion(questionId);
    unwrap(response, "Xoa cau hoi that bai");
    set((state) => ({
      questions: state.questions.filter((item) => item.id !== questionId),
      questionsByAssignmentId: Object.fromEntries(
        Object.entries(state.questionsByAssignmentId).map(([assignmentId, items]) => [
          assignmentId,
          items.filter((item) => item.id !== questionId),
        ]),
      ),
      selectedQuestion: state.selectedQuestion?.id === questionId ? null : state.selectedQuestion,
    }));
  },

  clearSelectedQuestion: () => set({ selectedQuestion: null }),
  clearError: () => set({ error: null }),
}));
