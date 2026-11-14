import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '@/services/auth.service';
import { tokenStorage } from '@/services/api';
import type { UserDto } from '@/types/api';

type AuthState = {
  user: UserDto | null;
  token: string | null;
  isLoading: boolean;
};

type AuthContextValue = AuthState & {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
  });

  const refreshUser = async () => {
    try {
      const user = await authService.me();
      setState((prev) => ({ ...prev, user }));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    (async () => {
      const token = await tokenStorage.get();
      if (token) {
        try {
          const user = await authService.me();
          setState({ user, token, isLoading: false });
        } catch {
          await tokenStorage.clear();
          setState({ user: null, token: null, isLoading: false });
        }
      } else {
        setState({ user: null, token: null, isLoading: false });
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authService.login(email, password);
    setState({ user: res.user, token: res.token, isLoading: false });
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await authService.register(name, email, password);
    setState({ user: res.user, token: res.token, isLoading: false });
  };

  const logout = async () => {
    await authService.logout();
    setState({ user: null, token: null, isLoading: false });
  };

  return (
    <AuthContext.Provider
      value={{ ...state, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}
