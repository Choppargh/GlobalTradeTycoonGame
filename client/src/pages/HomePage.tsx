import React from 'react';
import { ImprovedAuthPage } from '@/components/auth/ImprovedAuthPage';
import { DisplayNameSetup } from '@/components/auth/DisplayNameSetup';
import { useAuth } from '@/hooks/useAuth';

export default function HomePage() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const [showDisplayNameSetup, setShowDisplayNameSetup] = React.useState(false);
  const [showAuthModal, setShowAuthModal] = React.useState(false);

  React.useEffect(() => {
    // Check if redirected from protected route
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('showAuth') === 'true') {
      setShowAuthModal(true);
      // Clean up URL
      window.history.replaceState({}, '', '/');
    }
  }, []);

  React.useEffect(() => {
    // Show display name setup for OAuth users who just signed in
    if (isAuthenticated && user && user.provider !== 'local' && !localStorage.getItem(`displayNameSetup_${user.id}`)) {
      setShowDisplayNameSetup(true);
    }
  }, [isAuthenticated, user]);

  const handleDisplayNameSetupComplete = () => {
    if (user) {
      localStorage.setItem(`displayNameSetup_${user.id}`, 'completed');
    }
    setShowDisplayNameSetup(false);
  };

  const handleLogout = async () => {
    await logout();
  };

  // Show auth page for unauthenticated users or when auth modal is requested
  if (!isAuthenticated || showAuthModal) {
    return <ImprovedAuthPage />;
  }

  // Loading state
  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: 'url("/images/GTC_Background.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: 'url("/images/GTC_Background.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen flex flex-col items-center justify-center p-4 gap-8">
        <div className="text-center">
          <img src="/images/GTC_Logo-512x512.png" alt="Global Trading Tycoon" className="w-64 mx-auto mb-8" />
        </div>
        
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <button 
            onClick={() => window.location.href = '/game'}
            className="transition-transform hover:scale-105 focus:outline-none"
          >
            <img 
              src="/images/GTC_Play.png" 
              alt="Play" 
              className="w-full"
            />
          </button>
          
          <button 
            onClick={() => window.location.href = '/leaderboard'}
            className="transition-transform hover:scale-105 focus:outline-none"
          >
            <img 
              src="/images/GTC_Leaderboard.png" 
              alt="Leaderboard" 
              className="w-full"
            />
          </button>
          
          <button 
            onClick={() => window.location.href = '/rules'}
            className="transition-transform hover:scale-105 focus:outline-none"
          >
            <img 
              src="/images/GTC_Rules.png" 
              alt="Rules" 
              className="w-full"
            />
          </button>
        </div>
        
        {/* User info and logout button for mobile */}
        <div className="text-center text-white">
          <p className="mb-2">Welcome, {user?.displayName || user?.username}</p>
          <button 
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white text-sm"
          >
            Logout
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

      {/* User info and logout button for desktop */}
      <div className="hidden lg:block absolute top-4 right-4">
        <div className="text-white text-right">
          <p className="mb-2">Welcome, {user?.displayName || user?.username}</p>
          <button 
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white text-sm"
          >
            Logout
          </button>
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

      {/* Display Name Setup Modal */}
      <DisplayNameSetup
        isOpen={showDisplayNameSetup}
        onComplete={handleDisplayNameSetupComplete}
        currentDisplayName={user?.displayName || user?.username || ''}
      />
    </div>
  );
}