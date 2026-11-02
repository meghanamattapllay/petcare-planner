import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../api/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('petcare_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('petcare_token');
      const storedUser = localStorage.getItem('petcare_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        } catch (e) {
          localStorage.removeItem('petcare_token');
          localStorage.removeItem('petcare_user');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authService.login({ email, password });
      if (res.token) {
        localStorage.setItem('petcare_token', res.token);
        localStorage.setItem('petcare_user', JSON.stringify(res.user));
        setToken(res.token);
        setUser(res.user);
        return { success: true };
      }
      return { success: false, message: 'Invalid response from server' };
    } catch (err) {
      return { success: false, message: err.message || 'Login failed' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await authService.register({ name, email, password });
      if (res.token) {
        localStorage.setItem('petcare_token', res.token);
        localStorage.setItem('petcare_user', JSON.stringify(res.user));
        setToken(res.token);
        setUser(res.user);
        return { success: true };
      }
      return { success: false, message: 'Registration failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('petcare_token');
    localStorage.removeItem('petcare_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
