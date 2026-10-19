import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: { email: string; password: string; requiredRole?: 'founder' | 'admin' }) => Promise<{ success: boolean; message: string; user: User }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isFounder: boolean;
  isAdmin: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('weengineers_token'));
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    const savedToken = localStorage.getItem('weengineers_token');
    if (!savedToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.getMe();
      if (res.success && res.user) {
        setUser(res.user);
      } else {
        localStorage.removeItem('weengineers_token');
        setUser(null);
        setToken(null);
      }
    } catch (err) {
      console.warn('Failed to restore session:', err);
      localStorage.removeItem('weengineers_token');
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (credentials: { email: string; password: string; requiredRole?: 'founder' | 'admin' }) => {
    const res = await api.login(credentials);
    if (res.success && res.token && res.user) {
      localStorage.setItem('weengineers_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.warn('Error during logout:', err);
    } finally {
      localStorage.removeItem('weengineers_token');
      setToken(null);
      setUser(null);
    }
  };

  const isFounder = user?.role === 'founder';
  const isAdmin = user?.role === 'admin' || user?.role === 'founder';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        refreshUser,
        isFounder,
        isAdmin,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
