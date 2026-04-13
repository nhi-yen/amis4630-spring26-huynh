import React, { createContext, useContext, useEffect, useCallback, useReducer } from 'react';
import type { AuthUser } from '../types/auth';
import { loginApi, registerApi } from '../services/authApi';
import { TOKEN_KEY, USER_KEY } from '../services/api';

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
}

export type AuthAction =
  | {
      type: 'LOGIN_SUCCESS';
      payload: {
        user: AuthUser;
        token: string;
      };
    }
  | {
      type: 'LOGOUT';
    }
  | {
      type: 'RESTORE_SESSION';
      payload: {
        user: AuthUser;
        token: string;
      };
    }
  | {
      type: 'CLEAR_CORRUPT_STORAGE';
    };

export const initialAuthState: AuthState = {
  user: null,
  token: null,
};

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
      };
    case 'RESTORE_SESSION':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
      };
    case 'CLEAR_CORRUPT_STORAGE':
      return {
        ...state,
        user: null,
        token: null,
      };
  }
};

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  // Load persisted credentials on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    if (storedToken && storedUser) {
      try {
        dispatch({
          type: 'RESTORE_SESSION',
          payload: {
            token: storedToken,
            user: JSON.parse(storedUser) as AuthUser,
          },
        });
      } catch {
        // Corrupt storage — wipe it to stay consistent
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        dispatch({ type: 'CLEAR_CORRUPT_STORAGE' });
      }
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await loginApi(email, password);
    const authUser: AuthUser = {
      email: data.email,
      userId: data.userId,
      roles: data.roles,
    };
    localStorage.setItem(TOKEN_KEY, data.accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(authUser));
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: {
        user: authUser,
        token: data.accessToken,
      },
    });
  }, []);

  const register = useCallback(
    async (email: string, password: string, confirmPassword: string) => {
      await registerApi(email, password, confirmPassword);
      // Registration does not auto-login; caller navigates to /login.
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    dispatch({ type: 'LOGOUT' });
    window.location.assign('/');
  }, []);

  const value: AuthContextType = {
    user: state.user,
    token: state.token,
    isAuthenticated: state.token !== null && state.user !== null,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
