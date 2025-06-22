// Anti-corruption React hooks with automatic recovery
import * as React from 'react';
import { stableUseState, stableUseEffect, stableUseCallback, validateReactHooks } from '@/lib/react-imports';

// Validate hooks on every function call
function safeUseState<T>(initialValue: T) {
  if (!validateReactHooks()) {
    console.error('React hooks corrupted, forcing reload');
    window.location.reload();
  }
  return stableUseState(initialValue);
}

function safeUseEffect(effect: React.EffectCallback, deps?: React.DependencyList) {
  if (!validateReactHooks()) {
    console.error('React hooks corrupted, forcing reload');
    window.location.reload();
  }
  return stableUseEffect(effect, deps);
}

function safeUseCallback<T extends (...args: any[]) => any>(callback: T, deps: React.DependencyList): T {
  if (!validateReactHooks()) {
    console.error('React hooks corrupted, forcing reload');
    window.location.reload();
  }
  return stableUseCallback(callback, deps);
}

export interface User {
  id: number;
  username: string;
  email: string;
  displayName: string;
  avatar: string | null;
  provider?: string;
}

export function useAuth() {
  const [user, setUser] = safeUseState<User | null>(null);
  const [isLoading, setIsLoading] = safeUseState(true);
  const [isAuthenticated, setIsAuthenticated] = safeUseState(false);

  const checkAuthStatus = safeUseCallback(async () => {
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

  safeUseEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = safeUseCallback(async (email: string, password: string) => {
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

  const logout = safeUseCallback(async () => {
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