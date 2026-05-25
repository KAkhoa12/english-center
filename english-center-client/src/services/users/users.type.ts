
export type UserStatus = "active" | "inactive" | "suspended" | string;

export type User = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  status: UserStatus;
  is_verified: boolean;
};

export type CreateUserRequest = {
  full_name: string;
  email: string;
  phone?: string | null;
  password: string;
  avatar_url?: string | null;
  status?: UserStatus;
  role_ids?: string[] | null;
};

export type UpdateUserRequest = {
  full_name?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  status?: UserStatus | null;
  is_verified?: boolean | null;
};

export type AssignUserRolesRequest = {
  role_ids: string[];
};

export type ListUsersQuery = {
  page?: number;
  page_size?: number;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
};
