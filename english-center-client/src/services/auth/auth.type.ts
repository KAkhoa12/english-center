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
  phone: string | null;
  password: string;
  avatar_url: string | null;
  date_of_birth: string | null;
  gender: string | null;
  address: string | null;
  level: string | null;
  learning_goal: string | null;
  parent_name: string | null;
  parent_phone: string | null;
}

export type RegisterResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: {
    id: string;
    full_name: string;
    email: string;
    phone: string | null;
    avatar_url: string | null;
    status: string;
    is_verified: boolean;
  };
  student: {
    id: string;
    date_of_birth: string | null;
    gender: string | null;
    address: string | null;
    level: string | null;
    learning_goal: string | null;
    parent_name: string | null;
    parent_phone: string | null;
  };
  roles: string[];
  permissions: string[];
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
