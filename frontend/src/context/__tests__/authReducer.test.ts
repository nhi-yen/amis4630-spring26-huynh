import { describe, expect, it } from 'vitest';
import { authReducer, initialAuthState } from '../../contexts/AuthContext';
import type { AuthUser } from '../../types/auth';

const mockUser: AuthUser = {
  email: 'user@example.com',
  userId: 'user-123',
  roles: ['Customer'],
};

describe('authReducer', () => {
  it('login success updates state correctly', () => {
    const next = authReducer(initialAuthState, {
      type: 'LOGIN_SUCCESS',
      payload: {
        user: mockUser,
        token: 'jwt-token',
      },
    });

    expect(next.user).toEqual(mockUser);
    expect(next.token).toBe('jwt-token');
  });

  it('logout clears user/token', () => {
    const authenticatedState = {
      user: mockUser,
      token: 'jwt-token',
    };

    const next = authReducer(authenticatedState, {
      type: 'LOGOUT',
    });

    expect(next.user).toBeNull();
    expect(next.token).toBeNull();
  });

  it('restore session loads user/token', () => {
    const next = authReducer(initialAuthState, {
      type: 'RESTORE_SESSION',
      payload: {
        user: mockUser,
        token: 'restored-token',
      },
    });

    expect(next.user).toEqual(mockUser);
    expect(next.token).toBe('restored-token');
  });

  it('clear corrupt storage resets state', () => {
    const authenticatedState = {
      user: mockUser,
      token: 'jwt-token',
    };

    const next = authReducer(authenticatedState, {
      type: 'CLEAR_CORRUPT_STORAGE',
    });

    expect(next.user).toBeNull();
    expect(next.token).toBeNull();
  });
});