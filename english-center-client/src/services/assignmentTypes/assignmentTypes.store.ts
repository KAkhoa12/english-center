import { create } from "zustand";

import type { ApiResponse, Pagination } from "@/shared/types/response";

import { assignmentTypesApi } from "./assignmentTypes.api";
import type {
  AssignmentType,
  AssignmentTypeCreateRequest,
  AssignmentTypeUpdateRequest,
  ListAssignmentTypesQuery,
} from "./assignmentTypes.type";

const unwrap = <T>(response: ApiResponse<T>, fallbackMessage: string): T => {
  if (!response.success) throw new Error(response.message || fallbackMessage);
  return response.payload;
};

type AssignmentTypesState = {
  assignmentTypes: AssignmentType[];
  pagination: Pagination | null;
  selectedAssignmentType: AssignmentType | null;
  isLoading: boolean;
  error: string | null;

  listAssignmentTypes: (query?: ListAssignmentTypesQuery) => Promise<AssignmentType[]>;
  getAssignmentType: (assignmentTypeId: string) => Promise<AssignmentType>;
  createAssignmentType: (data: AssignmentTypeCreateRequest) => Promise<AssignmentType>;
  updateAssignmentType: (assignmentTypeId: string, data: AssignmentTypeUpdateRequest) => Promise<AssignmentType>;
  deleteAssignmentType: (assignmentTypeId: string) => Promise<void>;
  clearSelectedAssignmentType: () => void;
  clearError: () => void;
};

export const useAssignmentTypesStore = create<AssignmentTypesState>()((set) => ({
  assignmentTypes: [],
  pagination: null,
  selectedAssignmentType: null,
  isLoading: false,
  error: null,

  listAssignmentTypes: async (query) => {
    const response = await assignmentTypesApi.listAssignmentTypes(query);
    const assignmentTypes = unwrap(response, "Lay danh sach loai bai tap that bai");
    set({ assignmentTypes, pagination: response.pagination ?? null });
    return assignmentTypes;
  },

  getAssignmentType: async (assignmentTypeId) => {
    const response = await assignmentTypesApi.getAssignmentType(assignmentTypeId);
    const assignmentType = unwrap(response, "Lay loai bai tap that bai");
    set({ selectedAssignmentType: assignmentType });
    return assignmentType;
  },

  createAssignmentType: async (data) => {
    const response = await assignmentTypesApi.createAssignmentType(data);
    const created = unwrap(response, "Tao loai bai tap that bai");
    set((state) => ({ assignmentTypes: [created, ...state.assignmentTypes], selectedAssignmentType: created }));
    return created;
  },

  updateAssignmentType: async (assignmentTypeId, data) => {
    const response = await assignmentTypesApi.updateAssignmentType(assignmentTypeId, data);
    const updated = unwrap(response, "Cap nhat loai bai tap that bai");
    set((state) => ({
      assignmentTypes: state.assignmentTypes.map((item) => (item.id === updated.id ? updated : item)),
      selectedAssignmentType: state.selectedAssignmentType?.id === updated.id ? updated : state.selectedAssignmentType,
    }));
    return updated;
  },

  deleteAssignmentType: async (assignmentTypeId) => {
    const response = await assignmentTypesApi.deleteAssignmentType(assignmentTypeId);
    unwrap(response, "Xoa loai bai tap that bai");
    set((state) => ({
      assignmentTypes: state.assignmentTypes.filter((item) => item.id !== assignmentTypeId),
      selectedAssignmentType: state.selectedAssignmentType?.id === assignmentTypeId ? null : state.selectedAssignmentType,
    }));
  },

  clearSelectedAssignmentType: () => set({ selectedAssignmentType: null }),
  clearError: () => set({ error: null }),
}));
