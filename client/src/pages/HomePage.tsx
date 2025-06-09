import React, { useState, useEffect } from 'react';
import { ImprovedAuthPage } from '@/components/auth/ImprovedAuthPage';
import { WelcomeScreen } from '@/components/game/WelcomeScreen';

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/auth/status');
        const data = await response.json();
        
        setUser(data.user || null);
        setIsAuthenticated(Boolean(data.isAuthenticated && data.user));
      } catch (err) {
        console.error('Auth check failed:', err);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading...</h2>
        </div>
      </div>
    );
  }

  // Show dashboard (WelcomeScreen) for authenticated users
  if (isAuthenticated) {
    return <WelcomeScreen />;
  }

  // Show auth page for non-authenticated users
  return (
    <div className="min-h-screen">
      <ImprovedAuthPage />
    </div>
  );
}