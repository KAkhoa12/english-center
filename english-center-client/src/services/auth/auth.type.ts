export type LoginRequest = {
  email: string;
  password: string;
}

export type LoginResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: {
    id: string;
    full_name: string;
    email: string;
  };
  roles: string[];
  permissions: string[];
}

export type RegisterRequest = {
  full_name: string;
  email: string;
  password: string;
}

export type RegisterResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: {
    id: string;
    full_name: string;
    email: string;
    status: string;
    is_verified: boolean;
  };
  student: {
    id: string;
  };
  roles: string[];
  permissions: string[];
}

export type ResetPasswordRequest = {
  token: string;
  password: string;
}

export type RefreshTokenRequest = {
  refresh_token: string;
}

export type RefreshTokenResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export type MeResponse = {
  user: {
    id: string;
    full_name: string;
    email: string;
  };
  roles: string[];
  permissions: string[];
}
