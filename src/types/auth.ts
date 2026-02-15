export const UserRole = {
  ADMIN: 'Admin',
  MEMBER: 'Member',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface User {
  id: string;
  email: string;
  role: UserRole;
  organizationId: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  organizationId: string;
  role?: UserRole;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    organizationId: string,
    role?: UserRole,
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
