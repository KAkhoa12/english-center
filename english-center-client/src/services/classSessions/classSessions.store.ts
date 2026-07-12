import { create } from "zustand";

import type { ApiResponse, Pagination } from "@/shared/types/response";

import { classSessionsApi } from "./classSessions.api";
import type {
  ClassSession,
  BulkCreateClassSessionsRequest,
  CreateClassSessionRequest,
  ListAllSessionsQuery,
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
  createSessionsBulk: (classId: string, data: BulkCreateClassSessionsRequest) => Promise<ClassSession[]>;
  listSessions: (classId: string, query?: ListClassSessionsQuery) => Promise<ClassSession[]>;
  listAllSessions: (query?: ListAllSessionsQuery) => Promise<ClassSession[]>;
  mySessions: (query?: ListMySessionsQuery) => Promise<ClassSession[]>;
  getSession: (sessionId: string) => Promise<ClassSession>;
  updateSession: (sessionId: string, data: UpdateClassSessionRequest) => Promise<ClassSession>;
  deleteSession: (sessionId: string) => Promise<void>;
  getMySessionDetail: (sessionId: string) => Promise<ClassSession>;
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

  createSessionsBulk: async (classId, data) => {
    const response = await classSessionsApi.createSessionsBulk(classId, data);
    const created = unwrap(response, "Tao lich hoc tu dong that bai");
    set((state) => ({ sessions: [...created, ...state.sessions] }));
    return created;
  },

  listSessions: async (classId, query) => {
    set({ isLoading: true, error: null });
    const response = await classSessionsApi.listSessions(classId, query);
    const sessions = unwrap(response, "Lay danh sach buoi hoc that bai");
    set({ sessions, pagination: response.pagination ?? null, isLoading: false });
    return sessions;
  },

  listAllSessions: async (query) => {
    set({ isLoading: true, error: null });
    const response = await classSessionsApi.listAllSessions(query);
    const sessions = unwrap(response, "Lay danh sach lich hoc that bai");
    set({ sessions, pagination: response.pagination ?? null, isLoading: false });
    return sessions;
  },

  mySessions: async (query) => {
    set({ isLoading: true, error: null });
    const response = await classSessionsApi.mySessions(query);
    const sessions = unwrap(response, "Lay danh sach buoi hoc cua toi that bai");
    set({ sessions, pagination: response.pagination ?? null, isLoading: false });
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

  getMySessionDetail: async (sessionId) => {
    const response = await classSessionsApi.getMySessionDetail(sessionId);
    const session = unwrap(response, "Lay thong tin buoi hoc that bai");
    set({ selectedSession: session });
    return session;
  },

  clearSelectedSession: () => set({ selectedSession: null }),
  clearError: () => set({ error: null }),
}));
