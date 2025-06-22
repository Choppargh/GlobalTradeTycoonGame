// Permanent fix for useState bundling issues - v4.0
import { React, useState, useEffect, useCallback } from '@/lib/react-stable';

export interface User {
  id: number;
  username: string;
  email: string;
  displayName: string;
  avatar: string | null;
  provider?: string;
}

export function useAuth() {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const checkAuthStatus = React.useCallback(async () => {
    try {
      const response = await fetch('/auth/me', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = React.useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.message || 'Login failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = React.useCallback(async () => {
    try {
      await fetch('/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    checkAuthStatus,
  };
}