import { isAxiosError } from 'axios';
import api from './api';

export interface LoginResponse {
  accessToken: string;
  email: string;
  userId: string;
  roles: string[];
}

/**
 * Authenticate with email + password.
 * Throws a plain Error with the backend's ProblemDetails message on failure.
 */
export async function loginApi(email: string, password: string): Promise<LoginResponse> {
  try {
    const response = await api.post<LoginResponse>('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const detail =
        error.response?.data?.detail ??
        error.response?.data?.title ??
        'Login failed. Please try again.';
      throw new Error(detail);
    }
    throw error;
  }
}

/**
 * Register a new user.
 * Throws a plain Error with the backend's ProblemDetails message on failure.
 */
export async function registerApi(
  email: string,
  password: string,
  confirmPassword: string
): Promise<void> {
  try {
    await api.post('/auth/register', { email, password, confirmPassword });
  } catch (error) {
    if (isAxiosError(error)) {
      const detail =
        error.response?.data?.detail ??
        error.response?.data?.title ??
        'Registration failed. Please try again.';
      throw new Error(detail);
    }
    throw error;
  }
}
