import { create } from "zustand";

import type { ApiResponse, Pagination } from "@/shared/types/response";

import { classSessionsApi } from "./classSessions.api";
import type {
  ClassSession,
  CreateClassSessionRequest,
  ListClassSessionsQuery,
  ListMySessionsQuery,
  UpdateClassSessionRequest,
} from "./classSessions.type";

const unwrap = <T>(response: ApiResponse<T>, fallbackMessage: string): T => {
  if (!response.success) throw new Error(response.message || fallbackMessage);
  return response.payload;
};

type ClassSessionsState = {
  sessions: ClassSession[];
  pagination: Pagination | null;
  selectedSession: ClassSession | null;
  isLoading: boolean;
  error: string | null;

  createSession: (classId: string, data: CreateClassSessionRequest) => Promise<ClassSession>;
  listSessions: (classId: string, query?: ListClassSessionsQuery) => Promise<ClassSession[]>;
  mySessions: (query?: ListMySessionsQuery) => Promise<ClassSession[]>;
  getSession: (sessionId: string) => Promise<ClassSession>;
  updateSession: (sessionId: string, data: UpdateClassSessionRequest) => Promise<ClassSession>;
  deleteSession: (sessionId: string) => Promise<void>;
  clearSelectedSession: () => void;
  clearError: () => void;
};

export const useClassSessionsStore = create<ClassSessionsState>()((set) => ({
  sessions: [],
  pagination: null,
  selectedSession: null,
  isLoading: false,
  error: null,

  createSession: async (classId, data) => {
    const response = await classSessionsApi.createSession(classId, data);
    const session = unwrap(response, "Tao buoi hoc that bai");
    set((state) => ({ sessions: [session, ...state.sessions], selectedSession: session }));
    return session;
  },

  listSessions: async (classId, query) => {
    const response = await classSessionsApi.listSessions(classId, query);
    const sessions = unwrap(response, "Lay danh sach buoi hoc that bai");
    set({ sessions, pagination: response.pagination ?? null });
    return sessions;
  },

  mySessions: async (query) => {
    const response = await classSessionsApi.mySessions(query);
    const sessions = unwrap(response, "Lay danh sach buoi hoc cua toi that bai");
    set({ sessions, pagination: response.pagination ?? null });
    return sessions;
  },

  getSession: async (sessionId) => {
    const response = await classSessionsApi.getSession(sessionId);
    const session = unwrap(response, "Lay thong tin buoi hoc that bai");
    set({ selectedSession: session });
    return session;
  },

  updateSession: async (sessionId, data) => {
    const response = await classSessionsApi.updateSession(sessionId, data);
    const session = unwrap(response, "Cap nhat buoi hoc that bai");
    set((state) => ({
      sessions: state.sessions.map((item) => (item.id === session.id ? session : item)),
      selectedSession: state.selectedSession?.id === session.id ? session : state.selectedSession,
    }));
    return session;
  },

  deleteSession: async (sessionId) => {
    const response = await classSessionsApi.deleteSession(sessionId);
    unwrap(response, "Xoa buoi hoc that bai");
    set((state) => ({
      sessions: state.sessions.filter((item) => item.id !== sessionId),
      selectedSession: state.selectedSession?.id === sessionId ? null : state.selectedSession,
    }));
  },

  clearSelectedSession: () => set({ selectedSession: null }),
  clearError: () => set({ error: null }),
}));
