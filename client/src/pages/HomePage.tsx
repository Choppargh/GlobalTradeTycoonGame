import { ImprovedAuthPage } from '@/components/auth/ImprovedAuthPage';
import { WelcomeScreen } from '@/components/game/WelcomeScreen';
import { useAuth } from '@/hooks/useAuth';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();

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
