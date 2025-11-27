import { api } from './client';

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'viewer';
  };
  token: string;
}

export const loginRequest = async (payload: { email: string; password: string }) => {
  const { data } = await api.post<{ success: boolean; data: AuthResponse }>('/api/auth/login', payload);
  return data.data;
};

export const signupRequest = async (payload: { name: string; email: string; password: string }) => {
  const { data } = await api.post<{ success: boolean; data: AuthResponse }>('/api/auth/signup', payload);
  return data.data;
};

