// Backup of useAuth with completely clean implementation
import { useState, useCallback, useEffect } from 'react';

export interface User {
  id: number;
  username: string;
  email: string;
  displayName: string;
  avatar: string | null;
  provider?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await fetch('/auth/me', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
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

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const updateDisplayName = useCallback(async (newDisplayName: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/auth/update-display-name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ displayName: newDisplayName })
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        return { success: true };
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        return { success: false, error: errorData.message || 'Failed to update trader name' };
      }
    } catch (error) {
      console.error('Display name update error:', error);
      return { success: false, error: 'Network error occurred' };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = '/';
    }
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    checkAuthStatus,
    updateDisplayName,
    logout
  };
}