import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { getSecureItem, setSecureItem, removeSecureItem } from '../utils/storage';
import { authService } from '../services/authService';

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const performLogout = async () => {
    setToken(null);
    setUser(null);
    await removeSecureItem('auth_token');
    await removeSecureItem('user_data');
    await removeSecureItem('bypassed-token-override');
    await removeSecureItem('dummyToken');
    await removeSecureItem('mockToken');
  };

  const restoreSession = async () => {
    try {
      setIsLoading(true);
      
      // Cleanup legacy bypassed tokens
      const bypassed = await getSecureItem('bypassed-token-override');
      if (bypassed) {
        await performLogout();
        setIsLoading(false);
        return;
      }
      
      const storedToken = await getSecureItem('auth_token');
      const storedUser = await getSecureItem('user_data');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } else {
        await performLogout();
      }
    } catch (error) {
      console.error('Failed to restore session:', error);
      await performLogout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    restoreSession();
    
    // Listen for 401 Unauthorized API responses
    const subscription = DeviceEventEmitter.addListener('onSessionExpired', async () => {
      console.log('Session expired, logging out automatically');
      await performLogout();
    });
    
    return () => {
      subscription.remove();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const data = await authService.login(email, password);
    if (data.token && data.user) {
      setToken(data.token);
      setUser(data.user);
      await setSecureItem('auth_token', data.token);
      await setSecureItem('user_data', JSON.stringify(data.user));
    } else {
      throw new Error('Invalid login response from server');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await authService.register(name, email, password);
    if (data.token && data.user) {
      setToken(data.token);
      setUser(data.user);
      await setSecureItem('auth_token', data.token);
      await setSecureItem('user_data', JSON.stringify(data.user));
    } else {
      throw new Error('Invalid registration response from server');
    }
  };

  const logout = async () => {
    await performLogout();
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    restoreSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
