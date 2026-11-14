import { api, tokenStorage } from './api';
import type { AuthResponse, UserDto } from '@/types/api';

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/api/auth/login', { email, password });
    await tokenStorage.save(res.token);
    return res;
  },
  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/api/auth/register', { name, email, password });
    await tokenStorage.save(res.token);
    return res;
  },
  me: () => api.get<UserDto>('/api/auth/me'),
  logout: () => tokenStorage.clear(),
};
