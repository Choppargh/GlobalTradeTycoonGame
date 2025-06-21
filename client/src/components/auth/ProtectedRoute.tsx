// Force refresh
import { useAuth } from '@/hooks/useAuth';
import { Loading } from '@/components/ui/loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loading isLoading={true} />;
  }

  if (!isAuthenticated) {
    // Redirect to homepage with auth modal visible
    window.location.href = '/?showAuth=true';
    return null;
  }

  return <>{children}</>;
}