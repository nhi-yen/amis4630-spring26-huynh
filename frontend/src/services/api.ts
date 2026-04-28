import axios from 'axios';

/**
 * Shared axios instance for all API calls.
 * - Request interceptor: attaches Bearer token from localStorage if present.
 * - Response interceptor: on 401, clears stored credentials and redirects to /login
 *   ONLY when a token was already stored (i.e. token expiry), not during login/register flows.
 */

export const TOKEN_KEY = 'auth_token';
export const USER_KEY = 'auth_user';

const defaultApiUrl = import.meta.env.PROD
  ? 'https://marketplace-backened-nhi2-gxb5gpcthkcqcja9.canadacentral-01.azurewebsites.net'
  : 'http://localhost:5000';
const configuredApiUrl = (import.meta.env.VITE_API_URL?.trim() || defaultApiUrl).trim();
const normalizedApiUrl = configuredApiUrl.replace(/\/+$/, '');
export const API_BASE_URL = `${normalizedApiUrl}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        // Token exists but was rejected — it has expired or is invalid.
        // Clear credentials and send user to login.
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        window.location.href = '/login';
      }
      // If no token was stored this is a login/register failure — let it propagate.
    }
    return Promise.reject(error);
  }
);

export default api;
