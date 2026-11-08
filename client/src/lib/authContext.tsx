'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { IUser, ICustomPersona, ISavedAudit } from './types';
import {
  loginUser,
  registerUser,
  loginDemoUser,
  fetchCurrentUser,
  createCustomPersona as apiCreatePersona,
  saveAuditToWorkspace as apiSaveAudit,
} from './api';

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register';
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  demoLogin: () => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  addCustomPersona: (persona: {
    name: string;
    role: string;
    viewportSize: string;
    focusArea: string;
    color: string;
  }) => Promise<void>;
  saveAudit: (audit: {
    slug: string;
    url: string;
    title: string;
    overallGrade: string;
    usability?: number;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  const openAuthModal = (tab: 'login' | 'register' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Restore auth from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('personapulse_token');
    if (savedToken) {
      setToken(savedToken);
      fetchCurrentUser(savedToken)
        .then((res) => {
          if (res.success && res.user) {
            setUser(res.user);
          } else {
            localStorage.removeItem('personapulse_token');
            setToken(null);
            setUser(null);
          }
        })
        .catch(() => {
          localStorage.removeItem('personapulse_token');
          setToken(null);
          setUser(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await loginUser(email, password);
    if (res.success && res.token) {
      localStorage.setItem('personapulse_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setIsAuthModalOpen(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await registerUser(name, email, password);
    if (res.success && res.token) {
      localStorage.setItem('personapulse_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setIsAuthModalOpen(false);
    }
  };

  const demoLogin = async () => {
    const res = await loginDemoUser();
    if (res.success && res.token) {
      localStorage.setItem('personapulse_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setIsAuthModalOpen(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('personapulse_token');
    setToken(null);
    setUser(null);
  };

  const refreshUser = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetchCurrentUser(token);
      if (res.success && res.user) {
        setUser(res.user);
      }
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  }, [token]);

  const addCustomPersona = async (personaData: {
    name: string;
    role: string;
    viewportSize: string;
    focusArea: string;
    color: string;
  }) => {
    if (!token) throw new Error('Must be logged in to create custom personas');
    const res = await apiCreatePersona(token, personaData);
    if (res.success && res.customPersonas) {
      setUser((prev) => (prev ? { ...prev, customPersonas: res.customPersonas } : null));
    }
  };

  const saveAudit = async (auditData: {
    slug: string;
    url: string;
    title: string;
    overallGrade: string;
    usability?: number;
  }) => {
    if (!token) throw new Error('Must be logged in to save audits');
    const res = await apiSaveAudit(token, auditData);
    if (res.success && res.savedAudits) {
      setUser((prev) => (prev ? { ...prev, savedAudits: res.savedAudits } : null));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        demoLogin,
        logout,
        refreshUser,
        addCustomPersona,
        saveAudit,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
