import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loginRequest, signupRequest } from '../services/auth';
import { setAuthToken } from '../services/client';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'viewer';
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAdmin: boolean;
  login: (payload: { email: string; password: string }) => Promise<void>;
  signup: (payload: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = 'taskops_auth';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as { user: AuthUser; token: string };
      setUser(parsed.user);
      setToken(parsed.token);
      setAuthToken(parsed.token);
    }
  }, []);

  const persist = (payload: { user: AuthUser; token: string }) => {
    setUser(payload.user);
    setToken(payload.token);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    setAuthToken(payload.token);
  };

  const login = async (payload: { email: string; password: string }) => {
    const data = await loginRequest(payload);
    persist(data);
  };

  const signup = async (payload: { name: string; email: string; password: string }) => {
    const data = await signupRequest(payload);
    persist(data);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
    setAuthToken(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAdmin: user?.role === 'admin',
      login,
      signup,
      logout,
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};

