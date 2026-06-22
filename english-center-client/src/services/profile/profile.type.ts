export type ProfileUser = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  avatar_presigned_url: string | null;
  status: string | null;
  is_verified: boolean | null;
};

export type ProfileStudent = {
  id: string;
  date_of_birth: string | null;
  gender: string | null;
  address: string | null;
  level: string | null;
  learning_goal: string | null;
  parent_name: string | null;
  parent_phone: string | null;
};

export type ProfileTeacher = {
  id: string;
  specialization: string | null;
  bio: string | null;
  experience_years: number;
  certificates: Record<string, unknown> | null;
  hourly_rate: number | null;
};

export type Profile = {
  user: ProfileUser;
  roles: string[];
  permissions: string[];
  student: ProfileStudent | null;
  teacher: ProfileTeacher | null;
};

export type ProfileUpdateRequest = {
  full_name?: string | null;
  phone?: string | null;
  date_of_birth?: string | null;
  gender?: string | null;
  address?: string | null;
  level?: string | null;
  learning_goal?: string | null;
  parent_name?: string | null;
  parent_phone?: string | null;
  specialization?: string | null;
  bio?: string | null;
  experience_years?: number | null;
  certificates?: Record<string, unknown> | null;
  hourly_rate?: number | null;
};
