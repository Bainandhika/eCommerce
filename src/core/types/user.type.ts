export interface User {
  user_id: string;
  email: string | null;
  password: string | null;
  address: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CreateUserInput {
  email: string;
  password: string;
  address?: string | null;
}

export interface UpdateUserInput {
  email?: string;
  password?: string;
  address?: string | null;
}