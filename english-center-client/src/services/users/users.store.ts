import { create } from "zustand";

import type { ApiResponse, Pagination } from "@/shared/types/response";

import { usersApi } from "./users.api";
import type {
  AssignUserRolesRequest,
  CreateUserRequest,
  ListUsersQuery,
  UpdateUserRequest,
  User,
} from "./users.type";

const unwrap = <T>(response: ApiResponse<T>, fallbackMessage: string): T => {
  if (!response.success) throw new Error(response.message || fallbackMessage);
  return response.payload;
};

type UsersState = {
  users: User[];
  pagination: Pagination | null;
  selectedUser: User | null;
  isLoading: boolean;
  error: string | null;

  createUser: (data: CreateUserRequest) => Promise<User>;
  listUsers: (query?: ListUsersQuery) => Promise<User[]>;
  getUser: (userId: string) => Promise<User>;
  updateUser: (userId: string, data: UpdateUserRequest) => Promise<User>;
  deleteUser: (userId: string) => Promise<void>;
  assignUserRoles: (userId: string, data: AssignUserRolesRequest) => Promise<void>;
  removeUserRole: (userId: string, roleId: string) => Promise<void>;
  clearSelectedUser: () => void;
  clearError: () => void;
};

export const useUsersStore = create<UsersState>()((set) => ({
  users: [],
  pagination: null,
  selectedUser: null,
  isLoading: false,
  error: null,

  createUser: async (data) => {
    const response = await usersApi.createUser(data);
    const user = unwrap(response, "Tao nguoi dung that bai");
    set((state) => ({ users: [user, ...state.users], selectedUser: user }));
    return user;
  },

  listUsers: async (query) => {
    const response = await usersApi.listUsers(query);
    const users = unwrap(response, "Lay danh sach nguoi dung that bai");
    set({ users, pagination: response.pagination ?? null });
    return users;
  },

  getUser: async (userId) => {
    const response = await usersApi.getUser(userId);
    const user = unwrap(response, "Lay thong tin nguoi dung that bai");
    set({ selectedUser: user });
    return user;
  },

  updateUser: async (userId, data) => {
    const response = await usersApi.updateUser(userId, data);
    const user = unwrap(response, "Cap nhat nguoi dung that bai");
    set((state) => ({
      users: state.users.map((item) => (item.id === user.id ? user : item)),
      selectedUser: state.selectedUser?.id === user.id ? user : state.selectedUser,
    }));
    return user;
  },

  deleteUser: async (userId) => {
    const response = await usersApi.deleteUser(userId);
    unwrap(response, "Xoa nguoi dung that bai");
    set((state) => ({
      users: state.users.filter((item) => item.id !== userId),
      selectedUser: state.selectedUser?.id === userId ? null : state.selectedUser,
    }));
  },

  assignUserRoles: async (userId, data) => {
    const response = await usersApi.assignUserRoles(userId, data);
    unwrap(response, "Gan vai tro nguoi dung that bai");
  },

  removeUserRole: async (userId, roleId) => {
    const response = await usersApi.removeUserRole(userId, roleId);
    unwrap(response, "Xoa vai tro nguoi dung that bai");
  },

  clearSelectedUser: () => set({ selectedUser: null }),
  clearError: () => set({ error: null }),
}));
