import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ImprovedAuthPage } from '@/components/auth/ImprovedAuthPage';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/game';
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Checking authentication...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ImprovedAuthPage />
    </div>
  );
}
