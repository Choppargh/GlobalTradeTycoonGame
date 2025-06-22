import React from 'react';
import { ImprovedAuthPage } from '@/components/auth/ImprovedAuthPage';
import { DisplayNameSetup } from '@/components/auth/DisplayNameSetup';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { InstallPrompt } from '@/components/ui/InstallPrompt';
// Cache bust 12:52
import { useAuth } from '@/hooks/useAuth';
import { useGameStore } from '@/lib/stores/useGameStore';

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

  const handleChangeDisplayName = () => {
    setShowDisplayNameSetup(true);
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
      <div className="lg:hidden min-h-screen flex flex-col items-center justify-between p-4 pb-20">
        {/* Mobile User Avatar */}
        <div className="absolute top-4 right-4 z-10">
          <UserAvatar onChangeDisplayName={handleChangeDisplayName} />
        </div>
        
        {/* Logo and buttons centered */}
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <div className="text-center">
            <img src="/images/GTC_Logo-512x512.png" alt="Global Trading Tycoon" className="w-48 mx-auto mb-6" />
          </div>
          
          <div className="flex flex-col gap-3 w-full max-w-[200px]">
            <button 
              onClick={() => {
                // Start a new game which forces base selection
                const { startNewGame } = useGameStore.getState();
                startNewGame();
                window.location.href = '/game';
              }}
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

      {/* Desktop User Avatar */}
      <div className="hidden lg:block absolute top-4 right-4 z-10">
        <UserAvatar onChangeDisplayName={handleChangeDisplayName} />
      </div>
      
      {/* Footer with legal links - positioned differently for mobile vs desktop */}
      <footer className="absolute bottom-4 left-1/2 transform -translate-x-1/2 lg:bottom-4">
        <div className="flex gap-2 lg:gap-4 text-xs lg:text-sm">
          <a 
            href="/privacy" 
            className="text-white/80 hover:text-white underline bg-black/20 px-2 lg:px-3 py-1 rounded backdrop-blur-sm"
          >
            Privacy Policy
          </a>
          <a 
            href="/terms" 
            className="text-white/80 hover:text-white underline bg-black/20 px-2 lg:px-3 py-1 rounded backdrop-blur-sm"
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

      {/* PWA Install Prompt */}
      <InstallPrompt />
    </div>
  );
}