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
      {/* Mobile Layout */}
      <div className="flex md:hidden flex-col items-center justify-center min-h-screen space-y-6 px-4">
        <div className="mb-8">
          <img src="/images/GTC_Logo-512x512.png" alt="Global Trading Tycoon" className="w-64" />
        </div>
        
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
            onClick={() => window.location.href = '/leaderboard'}
            className="transition-transform hover:scale-105 focus:outline-none"
          >
            <img 
              src="/images/GTC_Leaderboard.png" 
              alt="Leaderboard" 
              style={{ width: '200px', height: 'auto', display: 'block', margin: '0 auto' }}
            />
          </button>
          
          <button 
            onClick={() => window.location.href = '/rules'}
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

      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen items-center justify-center">
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          width: '800px', 
          margin: '0 auto' 
        }}>
          {/* Logo Section */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img 
              src="/images/GTC_Logo.png" 
              alt="Global Trading Tycoon" 
              style={{ width: '280px', height: 'auto' }}
            />
          </div>
          
          {/* Buttons Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={() => window.location.href = '/game'}
              className="transition-transform hover:scale-105"
            >
              <img 
                src="/images/GTC_Play.png" 
                alt="Play" 
                style={{ width: '160px', height: 'auto' }}
              />
            </button>
            <button
              onClick={() => window.location.href = '/leaderboard'}
              className="transition-transform hover:scale-105"
            >
              <img 
                src="/images/GTC_Leaderboard.png" 
                alt="Leaderboard" 
                style={{ width: '160px', height: 'auto' }}
              />
            </button>
            <button
              onClick={() => window.location.href = '/rules'}
              className="transition-transform hover:scale-105"
            >
              <img 
                src="/images/GTC_Rules.png" 
                alt="Rules" 
                style={{ width: '160px', height: 'auto' }}
              />
            </button>
          </div>
        </div>
      </div>
      
      {/* Footer with legal links */}
      <footer className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="flex gap-4 text-sm">
          <a 
            href="/privacy" 
            className="text-white/80 hover:text-white underline bg-black/20 px-3 py-1 rounded backdrop-blur-sm"
          >
            Privacy Policy
          </a>
          <a 
            href="/terms" 
            className="text-white/80 hover:text-white underline bg-black/20 px-3 py-1 rounded backdrop-blur-sm"
          >
            Terms of Service
          </a>
        </div>
      </footer>
    </div>
  );
}