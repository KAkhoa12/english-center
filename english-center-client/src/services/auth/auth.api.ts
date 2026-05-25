import { apiClient } from "@/config/api-client";

import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  MeResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from "./auth.type";

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<LoginResponse, LoginRequest>(
      "/auth/login",
      data
    ),

  register: (data: RegisterRequest) =>
    apiClient.post<RegisterResponse, RegisterRequest>(
      "/auth/register",
      data
    ),

  me: () =>
    apiClient.get<MeResponse>("/auth/me"),

  refreshToken: (data: RefreshTokenRequest) =>
    apiClient.post<RefreshTokenResponse, RefreshTokenRequest>(
      "/auth/refresh-token",
      data
    ),
};
