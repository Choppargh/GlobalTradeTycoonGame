import React from 'react';
import { ImprovedAuthPage } from '@/components/auth/ImprovedAuthPage';

export default function HomePage() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/auth/status', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          const authenticated = Boolean(data.isAuthenticated && data.user);
          setIsAuthenticated(authenticated);
          setUser(data.user || null);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

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

  // Always show auth page first - user must authenticate before accessing dashboard
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen">
        <ImprovedAuthPage />
      </div>
    );
  }

  // Authenticated dashboard
  return (
    <div className="min-h-screen" style={{
      backgroundImage: `url('/images/GTC_Background_Portrait.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="flex flex-col items-center justify-center min-h-screen space-y-6 px-4">
        <div className="mb-8">
          <img src="/images/GTC_Logo.png" alt="Global Trading Tycoon" className="w-64 sm:w-80" />
        </div>
        
        {user && (
          <div className="text-center mb-4">
            <p className="text-white text-lg font-semibold">Welcome back, {user.username || user.email}!</p>
          </div>
        )}
        
        <div className="flex flex-col items-center gap-4 w-full">
          <button 
            onClick={() => window.location.href = '/game'}
            className="transition-transform hover:scale-105 focus:outline-none"
          >
            <img 
              src="/images/GTC_Play.png" 
              alt="Play" 
              style={{ width: '200px', height: 'auto', display: 'block', margin: '0 auto' }}
            />
          </button>
          
          <button 
            onClick={() => {}}
            className="transition-transform hover:scale-105 focus:outline-none"
          >
            <img 
              src="/images/GTC_Leaderboard.png" 
              alt="Leaderboard" 
              style={{ width: '200px', height: 'auto', display: 'block', margin: '0 auto' }}
            />
          </button>
          
          <button 
            onClick={() => {}}
            className="transition-transform hover:scale-105 focus:outline-none"
          >
            <img 
              src="/images/GTC_Rules.png" 
              alt="Rules" 
              style={{ width: '200px', height: 'auto', display: 'block', margin: '0 auto' }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}