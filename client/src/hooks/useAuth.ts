// Use safe React imports to prevent bundling conflicts
import { useState, useEffect, useCallback, isReactLoaded } from '@/utils/reactSafe';

export interface User {
  id: number;
  username: string;
  email: string;
  displayName: string;
  avatar: string | null;
  provider?: string;
}

export function useAuth() {
  // Verify React is available before using hooks
  if (!isReactLoaded()) {
    throw new Error('React hooks not available - check React import configuration');
  }

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthStatus = useCallback(async () => {
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
      console.error('Auth check error:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const updateDisplayName = useCallback(async (newDisplayName: string): Promise<boolean> => {
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
        return true;
      }
      return false;
    } catch (error) {
      console.error('Display name update error:', error);
      return false;
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