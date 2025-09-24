import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Role = 'USER' | 'ADMIN' | null;

type AuthState = {
  token: string | null;
  role: Role;
  user: { id?: number; email?: string; fullName?: string } | null;
};

type AuthContextType = AuthState & {
  login: (data: { email: string; password: string }) => Promise<{ role: Role } | void>;
  signup: (data: { fullName: string; email: string; password: string; phone?: string; role?: Role | string }) => Promise<{ role: Role } | void>;
  logout: () => void;
  isAdmin: boolean;
  isUser: boolean;
  isAuthenticated: boolean;
  hasRole: (role: Role) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(() => {
    const token = localStorage.getItem('auth_token');
    const role = (localStorage.getItem('auth_role') as Role) || null;
    const userRaw = localStorage.getItem('auth_user');
    const user = userRaw ? JSON.parse(userRaw) : null;
    return { token, role, user };
  });

  useEffect(() => {
    if (state.token) localStorage.setItem('auth_token', state.token);
    else localStorage.removeItem('auth_token');
    if (state.role) localStorage.setItem('auth_role', state.role);
    else localStorage.removeItem('auth_role');
    if (state.user) localStorage.setItem('auth_user', JSON.stringify(state.user));
    else localStorage.removeItem('auth_user');
  }, [state]);

  const login = async ({ email, password }: { email: string; password: string }) => {
    const res = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || 'Login failed');
    }
    const data = await res.json();
    setState({ token: data.token || null, role: (data.role as Role) || null, user: data || null });
    return { role: (data.role as Role) || null };
  };

  const signup = async ({ fullName, email, password, phone, role }: { fullName: string; email: string; password: string; phone?: string; role?: Role | string }) => {
    const res = await fetch('http://localhost:8080/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password, phone, role }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || 'Signup failed');
    }
    const data = await res.json();
    setState({ token: data.token || null, role: (data.role as Role) || null, user: data || null });
    return { role: (data.role as Role) || null };
  };

  const logout = () => {
    setState({ token: null, role: null, user: null });
  };

  const value = useMemo(() => ({
    ...state,
    login,
    signup,
    logout,
    isAdmin: state.role === 'ADMIN',
    isUser: state.role === 'USER',
    isAuthenticated: !!state.token,
    hasRole: (role: Role) => state.role === role
  }), [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};


