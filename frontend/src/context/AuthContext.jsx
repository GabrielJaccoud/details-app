import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

const API_BASE_URL = 'https://8000-i83ezger1yrrrpsdax61j-e54c7ca7.manusvm.computer';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCurrentUser = async (token) => {
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
    const token = localStorage.getItem('access_token');
    if (token) {
      fetchCurrentUser(token);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
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
    await fetchCurrentUser(data.access_token); // Buscar dados reais do usuário
    navigate('/');
  };

  const register = async (name, email, password) => {
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
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


