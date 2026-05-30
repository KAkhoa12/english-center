import { create } from "zustand";

import type { ApiResponse } from "@/shared/types/response";

import { assignmentQuestionOptionsApi } from "./assignmentQuestionOptions.api";
import type {
  AssignmentQuestionOption,
  CreateAssignmentQuestionOptionRequest,
  UpdateAssignmentQuestionOptionRequest,
} from "./assignmentQuestionOptions.type";

const unwrap = <T>(response: ApiResponse<T>, fallbackMessage: string): T => {
  if (!response.success) throw new Error(response.message || fallbackMessage);
  return response.payload;
};

type AssignmentQuestionOptionsState = {
  options: AssignmentQuestionOption[];
  selectedOption: AssignmentQuestionOption | null;
  isLoading: boolean;
  error: string | null;

  createOption: (questionId: string, data: CreateAssignmentQuestionOptionRequest) => Promise<AssignmentQuestionOption>;
  listOptions: (questionId: string) => Promise<AssignmentQuestionOption[]>;
  updateOption: (optionId: string, data: UpdateAssignmentQuestionOptionRequest) => Promise<AssignmentQuestionOption>;
  deleteOption: (optionId: string) => Promise<void>;
  clearSelectedOption: () => void;
  clearError: () => void;
};

export const useAssignmentQuestionOptionsStore = create<AssignmentQuestionOptionsState>()((set) => ({
  options: [],
  selectedOption: null,
  isLoading: false,
  error: null,

  createOption: async (questionId, data) => {
    const response = await assignmentQuestionOptionsApi.createOption(questionId, data);
    const option = unwrap(response, "Tao lua chon cau hoi that bai");
    set((state) => ({ options: [...state.options, option], selectedOption: option }));
    return option;
  },

  listOptions: async (questionId) => {
    const response = await assignmentQuestionOptionsApi.listOptions(questionId);
    const options = unwrap(response, "Lay danh sach lua chon that bai");
    set({ options });
    return options;
  },

  updateOption: async (optionId, data) => {
    const response = await assignmentQuestionOptionsApi.updateOption(optionId, data);
    const option = unwrap(response, "Cap nhat lua chon that bai");
    set((state) => ({
      options: state.options.map((item) => (item.id === option.id ? option : item)),
      selectedOption: state.selectedOption?.id === option.id ? option : state.selectedOption,
    }));
    return option;
  },

  deleteOption: async (optionId) => {
    const response = await assignmentQuestionOptionsApi.deleteOption(optionId);
    unwrap(response, "Xoa lua chon that bai");
    set((state) => ({
      options: state.options.filter((item) => item.id !== optionId),
      selectedOption: state.selectedOption?.id === optionId ? null : state.selectedOption,
    }));
  },

  clearSelectedOption: () => set({ selectedOption: null }),
  clearError: () => set({ error: null }),
}));
