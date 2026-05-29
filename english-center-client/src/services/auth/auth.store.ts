import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { ApiResponse } from "@/shared/types/response";
import { authApi } from "./auth.api";
import type {
  LoginRequest,
  LoginResponse,
  MeResponse,
  RegisterRequest,
  RegisterResponse,
} from "./auth.type";

type AuthState = {
  me: MeResponse | null;

  accessToken: string | null;
  refreshToken: string | null;

  isAuthenticated: boolean;
  isLoading: boolean;
  message: string | null;
  error: string | null;

  login: (data: LoginRequest) => Promise<ApiResponse<LoginResponse>>;
  register: (data: RegisterRequest) => Promise<ApiResponse<RegisterResponse>>;
  fetchMe: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  logout: () => Promise<void>;
  clearMessage: () => void;
  clearError: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      me: null,

      accessToken: null,
      refreshToken: null,

      isAuthenticated: false,
      isLoading: false,
      message: null,
      error: null,

      login: async (data) => {
        set({ isLoading: true, message: null, error: null });

        const response = await authApi.login(data);

        if (response.success) {
          const info = response.payload;

          set({
            me: {
              user: info.user,
              roles: info.roles,
              permissions: info.permissions,
            },
            accessToken: info.access_token,
            refreshToken: info.refresh_token ?? null,
            isAuthenticated: true,
            isLoading: false,
            message: response.message,
            error: null,
          });

          return response;
        }

        set({
          me: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          message: response.message,
          error: response.message,
        });

        return response;
      },

      register: async (data) => {
        set({ isLoading: true, message: null, error: null });

        const response = await authApi.register(data);

        if (response.success) {
          const info = response.payload;

          set({
            me: {
              user: {
                id: info.user.id,
                full_name: info.user.full_name,
                email: info.user.email,
              },
              roles: info.roles,
              permissions: info.permissions,
            },
            accessToken: info.access_token,
            refreshToken: info.refresh_token ?? null,
            isAuthenticated: true,
            isLoading: false,
            message: response.message,
            error: null,
          });

          return response;
        }

        set({
          me: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          message: response.message,
          error: response.message,
        });

        return response;
      },

      fetchMe: async () => {
        set({ isLoading: true, message: null, error: null });

        const response = await authApi.me();

        if (response.success) {
          set({
            me: response.payload,
            isAuthenticated: true,
            isLoading: false,
            message: response.message,
            error: null,
          });
          return;
        }

        set({
          me: null,
          isAuthenticated: false,
          isLoading: false,
          message: response.message,
          error: response.message,
        });
      },

      checkAuth: async () => {
        const { accessToken, refreshToken } = get();

        if (!accessToken && !refreshToken) {
          set({
            me: null,
            isAuthenticated: false,
            isLoading: false,
          });

          return false;
        }

        set({ isLoading: true, message: null, error: null });

        const meResponse = await authApi.me();

        if (meResponse.success) {
          set({
            me: meResponse.payload,
            isAuthenticated: true,
            isLoading: false,
            message: meResponse.message,
            error: null,
          });

          return true;
        }

        if (!refreshToken) {
          await get().logout();
          return false;
        }

        const tokenResponse = await authApi.refreshToken({
          refresh_token: refreshToken,
        });

        if (!tokenResponse.success) {
          await get().logout();
          return false;
        }

        set({
          accessToken: tokenResponse.payload.access_token,
          refreshToken: tokenResponse.payload.refresh_token ?? refreshToken,
        });

        const refreshedMeResponse = await authApi.me();

        if (!refreshedMeResponse.success) {
          await get().logout();
          return false;
        }

        set({
          me: refreshedMeResponse.payload,
          isAuthenticated: true,
          isLoading: false,
          message: refreshedMeResponse.message,
          error: null,
        });

        return true;
      },

      logout: async () => {
        set({
          me: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          message: null,
          error: null,
        });
      },

      clearMessage: () => {
        set({ message: null });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        me: state.me,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
