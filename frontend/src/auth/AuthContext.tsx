import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, api, type AuthUser, refreshAccessToken, setAccessToken, setUnauthorizedHandler } from '../api';

type LoginInput = {
  email: string;
  password: string;
  rememberMe: boolean;
  expectedRole?: 'admin' | 'engineer';
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (input: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const clearSession = useCallback(() => {
    setAccessToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(clearSession);
    return () => setUnauthorizedHandler(null);
  }, [clearSession]);

  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      const token = await refreshAccessToken();
      if (!isMounted) {
        return;
      }

      if (!token) {
        clearSession();
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get<{ user: AuthUser }>(`${API_BASE_URL}/auth/me`);
        if (isMounted) {
          setUser(response.data.user);
        }
      } catch {
        if (isMounted) {
          clearSession();
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, [clearSession]);

  const login = useCallback(async (input: LoginInput) => {
    const { expectedRole, ...credentials } = input;
    const response = await api.post<{ accessToken: string; user: AuthUser }>(`${API_BASE_URL}/auth/login`, credentials, {
      headers: expectedRole ? { 'X-Expected-Role': expectedRole } : undefined,
    });

    if (expectedRole && response.data.user.role !== expectedRole) {
      throw new Error('Invalid role for selected workspace');
    }

    setAccessToken(response.data.accessToken);
    setUser(response.data.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post(`${API_BASE_URL}/auth/logout`);
    } finally {
      clearSession();
      navigate('/login', { replace: true });
    }
  }, [clearSession, navigate]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      logout,
    }),
    [isLoading, login, logout, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
