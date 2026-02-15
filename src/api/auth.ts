import apiClient from './client';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
} from '../types/auth';
import { UserRole } from '../types/auth';

export const login = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const payload: LoginRequest = { email, password };
  const response = await apiClient.post<AuthResponse>('/users/login', payload);
  return response.data;
};

export const register = async (
  email: string,
  password: string,
  organizationId: string,
  role?: UserRole,
): Promise<AuthResponse> => {
  const payload: RegisterRequest = { email, password, organizationId, role };
  const response = await apiClient.post<AuthResponse>(
    '/users/register',
    payload,
  );
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<User>('/users/me');
  return response.data;
};
