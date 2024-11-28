import { useState, useEffect } from 'react';
import { User } from '../types';
import { apiClient } from '../utils/api';

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [initialized, setInitialized] = useState(() => {
    return localStorage.getItem('initialized') === 'true';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (username: string, password: string) => {
    const user = await apiClient.login(username, password);
    setUser(user);
    return user;
  };

  const register = async (username: string, password: string) => {
    const user = await apiClient.register(username, password);
    setUser(user);
    return user;
  };

  const initialize = async (dataPath: string) => {
    await apiClient.initialize(dataPath);
    setInitialized(true);
    localStorage.setItem('initialized', 'true');
  };

  const logout = () => {
    setUser(null);
  };

  return {
    user,
    initialized,
    login,
    register,
    logout,
    initialize
  };
}