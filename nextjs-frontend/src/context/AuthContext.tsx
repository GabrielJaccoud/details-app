"use client";

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  nome: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<unknown>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_BASE_URL = 'https://details-bgwzccze7-gabriel-jaccouds-projects.vercel.app/api';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCurrentUser = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/me/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Falha ao buscar dados do usuário');
      }
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Erro ao buscar usuário atual:', error);
      localStorage.removeItem('access_token');
      localStorage.removeItem('token_type');
      setUser(null);
    }
  };

  useEffect(() => {
    // Verificar se estamos no lado do cliente antes de acessar localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        fetchCurrentUser(token);
      }
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: email,
          password: password,
        }).toString(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erro ao fazer login');
      }

      const data = await response.json();
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('token_type', data.token_type);
      await fetchCurrentUser(data.access_token);
      router.push('/');
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: name,
          email: email,
          senha: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erro ao registrar usuário');
      }
      return response.json();
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

