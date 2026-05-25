import { create } from "zustand";
import { persist } from "zustand/middleware";

import { authApi } from "./auth.api";
import type { LoginRequest, LoginResponse, MeResponse } from "./auth.type";

type AuthState = {
  me: MeResponse | null;

  accessToken: string | null;
  refreshToken: string | null;

  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (data: LoginRequest) => Promise<LoginResponse>;
  fetchMe: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  logout: () => Promise<void>;
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
      error: null,

      login: async (data) => {
        try {
          set({ isLoading: true, error: null });

          const response = await authApi.login(data);

          set({
            me: response,
            accessToken: response.access_token,
            refreshToken: response.refresh_token ?? null,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return response;
        } catch {
          set({
            me: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: "Đăng nhập thất bại",
          });

          throw new Error("Đăng nhập thất bại");
        }
      },

      fetchMe: async () => {
        try {
          set({ isLoading: true, error: null });

          const user = await authApi.me();

          set({
            me : user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch {
          set({
            me: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
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

        try {
          set({ isLoading: true, error: null });

          const user = await authApi.me();

          set({
            me:user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return true;
        } catch {
          if (!refreshToken) {
            await get().logout();
            return false;
          }

          try {
            const tokenResponse = await authApi.refreshToken({
              refresh_token: refreshToken,
            });

            set({
              accessToken: tokenResponse.access_token,
              refreshToken: tokenResponse.refresh_token ?? refreshToken,
            });

            const user = await authApi.me();

            set({
              me:user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            return true;
          } catch {
            await get().logout();
            return false;
          }
        }
      },

      logout: async () => {
        set({
          me: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
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
    }
  )
);
