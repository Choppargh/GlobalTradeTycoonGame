import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';
import { LeaderboardEntry } from '@/types/game';
import { User } from '@/hooks/useAuth';
import { useGameStore } from '@/lib/stores/useGameStore';
import { AuthModal } from '@/components/auth/AuthModal';
import { UserProfile } from '@/components/auth/UserProfile';
import { Button } from '@/components/ui/button';
import { Leaderboard } from './Leaderboard';

interface WelcomeScreenProps {
  navigate?: (path: string) => void;
}

interface WelcomeScreenState {
  activeScreen: 'welcome' | 'leaderboard' | 'rules' | 'play';
  showAuthModal: boolean;
  authMode: 'login' | 'register';
  hasSavedGame: boolean;
  savedGameInfo: any;
  user: User | null;
  isAuthenticated: boolean;
}

export class WelcomeScreen extends React.Component<WelcomeScreenProps, WelcomeScreenState> {
  constructor(props: WelcomeScreenProps) {
    super(props);
    this.state = {
      activeScreen: 'welcome',
      showAuthModal: false,
      authMode: 'login',
      hasSavedGame: false,
      savedGameInfo: null,
      user: null,
      isAuthenticated: false
    };
  }

  async componentDidMount() {
    // Get user data
    try {
      const response = await fetch('/auth/status');
      const data = await response.json();
      this.setState({
        user: data.user || null,
        isAuthenticated: Boolean(data.isAuthenticated && data.user)
      });
    } catch (err) {
      console.error('Failed to get user data:', err);
    }

    // Check for saved games
    try {
      const savedGame = localStorage.getItem('globalTradeTycoon_savedGame');
      if (savedGame) {
        const gameData = JSON.parse(savedGame);
        if (gameData && gameData.username && gameData.daysRemaining) {
          this.setState({
            hasSavedGame: true,
            savedGameInfo: {
              username: gameData.username,
              days: 31 - gameData.daysRemaining,
              cash: gameData.cash + gameData.bankBalance
            }
          });
        }
      }
    } catch (err) {
      console.error('Error checking for saved games:', err);
    }
  }

  handleLoadGame = () => {
    const { loadGameState } = useGameStore.getState();
    const success = loadGameState();
    if (success) {
      console.log('Game loaded successfully!');
      if (this.props.navigate) {
        this.props.navigate('/game');
      } else {
        window.location.href = '/game';
      }
    } else {
      console.error('Failed to load saved game.');
    }
  };

  handleStartNewGame = () => {
    const { user } = this.state;
    if (user && user.username) {
      const { setUsername, startGame } = useGameStore.getState();
      setUsername(user.username);
      startGame();
      if (this.props.navigate) {
        this.props.navigate('/game');
      } else {
        window.location.href = '/game';
      }
    } else {
      console.error('Cannot start game: user not authenticated or missing username');
    }
  };

  handleClearSavedGame = () => {
    const { clearSavedGameState } = useGameStore.getState();
    clearSavedGameState();
    this.setState({
      hasSavedGame: false,
      savedGameInfo: null
    });
    console.log('Saved game cleared.');
  };

  handleShowLogin = () => {
    this.setState({
      authMode: 'login',
      showAuthModal: true
    });
  };

  handleShowRegister = () => {
    this.setState({
      authMode: 'register',
      showAuthModal: true
    });
  };

  render() {
    const { activeScreen, showAuthModal, authMode, hasSavedGame, savedGameInfo, user, isAuthenticated } = this.state;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
        style={{
          backgroundImage: `url('/images/GTC_Background_Portrait.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 1
        }}
      >
        {/* Authentication Section */}
        <div className="absolute top-4 right-4 z-20">
          {isAuthenticated && user ? (
            <UserProfile user={user} />
          ) : (
            <div className="flex gap-2">
              <Button 
                onClick={this.handleShowLogin}
                variant="outline" 
                className="bg-white/90 hover:bg-white"
              >
                Login
              </Button>
              <Button 
                onClick={this.handleShowRegister}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>

        {/* Authentication Modal */}
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => this.setState({ showAuthModal: false })}
          defaultMode={authMode}
        />

        {/* Main Content */}
        {activeScreen === 'welcome' && (
          <div className="flex flex-col items-center space-y-6 z-10 relative px-4">
            {/* Logo */}
            <div className="mb-8">
              <img src="/images/GTC_Logo.png" alt="Global Trading Tycoon" className="w-64 sm:w-80" />
            </div>
            
            {/* Navigation Buttons - Mobile Optimized */}
            <div className="flex flex-col gap-4 w-full max-w-xs sm:max-w-sm">
              <button 
                onClick={() => {
                  if (isAuthenticated && user && user.username) {
                    // Show game options screen (continue/new game)
                    this.setState({ activeScreen: 'play' });
                  } else {
                    console.error('Cannot start game: user not authenticated or missing username');
                  }
                }}
                className="transition-transform hover:scale-105 focus:outline-none"
                disabled={!isAuthenticated}
              >
                <img 
                  src="/images/GTC_Play.png" 
                  alt="Play" 
                  style={{ width: '200px', height: 'auto', maxWidth: '100%' }}
                  className={!isAuthenticated ? 'opacity-50' : ''} 
                />
              </button>
              
              <button 
                onClick={() => this.setState({ activeScreen: 'leaderboard' })}
                className="transition-transform hover:scale-105 focus:outline-none"
              >
                <img 
                  src="/images/GTC_Leaderboard.png" 
                  alt="Leaderboard" 
                  style={{ width: '200px', height: 'auto', maxWidth: '100%' }}
                />
              </button>
              
              <button 
                onClick={() => this.setState({ activeScreen: 'rules' })}
                className="transition-transform hover:scale-105 focus:outline-none"
              >
                <img 
                  src="/images/GTC_Rules.png" 
                  alt="Rules" 
                  style={{ width: '200px', height: 'auto', maxWidth: '100%' }}
                />
              </button>
            </div>
          </div>
        )}

        {activeScreen === 'play' && (
          <div className="bg-white/90 rounded-lg p-8 max-w-xl w-full mx-4 z-10 relative">
            <h2 className="text-2xl font-bold text-tycoon-navy mb-6 text-center">Game Options</h2>
            
            {/* Show saved game option if available */}
            {hasSavedGame && savedGameInfo && (
              <div className="mb-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-amber-800 mb-2">Continue Your Game?</h3>
                <div className="text-sm text-amber-700 mb-4">
                  <p>Trader: <span className="font-medium">{savedGameInfo.username}</span></p>
                  <p>Day: <span className="font-medium">{savedGameInfo.days} / 31</span></p>
                  <p>Balance: <span className="font-medium">${savedGameInfo.cash.toLocaleString()}</span></p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={this.handleLoadGame}
                    className="flex-1 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
                  >
                    Continue Game
                  </button>
                  <button 
                    onClick={this.handleClearSavedGame}
                    className="py-2 px-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
            
            <div className={hasSavedGame ? "border-t border-gray-200 pt-6" : ""}>
              {hasSavedGame && (
                <h3 className="text-lg font-semibold text-tycoon-navy mb-4">Start a New Game</h3>
              )}
              <p className="text-center text-gray-600 mb-4">Playing as: <span className="font-medium text-tycoon-navy">{user?.username}</span></p>
              <button 
                onClick={this.handleStartNewGame}
                className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Start New Game
              </button>
            </div>
            
            <button 
              onClick={() => this.setState({ activeScreen: 'welcome' })}
              className="mt-4 w-full py-2 bg-tycoon-navy text-white rounded hover:bg-opacity-90 transition-colors"
            >
              Back
            </button>
          </div>
        )}

        {activeScreen === 'leaderboard' && (
          <LeaderboardScreen onBack={() => this.setState({ activeScreen: 'welcome' })} />
        )}

        {activeScreen === 'rules' && (
          <RulesScreen onBack={() => this.setState({ activeScreen: 'welcome' })} />
        )}
      </div>
    );
  }
}

// Helper components for leaderboard and rules
class LeaderboardScreen extends React.Component<{ onBack: () => void }, { leaderboardData: LeaderboardEntry[] }> {
  constructor(props: { onBack: () => void }) {
    super(props);
    this.state = {
      leaderboardData: []
    };
  }

  async componentDidMount() {
    try {
      const response = await fetch('/api/scores');
      if (response.ok) {
        const data = await response.json();
        this.setState({ leaderboardData: data });
      }
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    }
  }

  render() {
    const { onBack } = this.props;
    const { leaderboardData } = this.state;

    return (
      <div className="bg-white/90 rounded-lg p-6 max-w-xl w-full mx-4 z-10 relative">
        <h2 className="text-2xl font-bold text-tycoon-navy mb-4 text-center">Leaderboard</h2>
        <div className="overflow-y-auto max-h-[60vh]">
          <Leaderboard scores={leaderboardData} />
        </div>
        <button 
          onClick={onBack}
          className="mt-4 w-full py-2 bg-tycoon-navy text-white rounded hover:bg-opacity-90 transition-colors"
        >
          Back
        </button>
      </div>
    );
  }
}

function RulesScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="bg-white/90 rounded-lg p-6 max-w-xl w-full mx-4 z-10 relative max-h-[80vh] overflow-y-auto">
      <h2 className="text-2xl font-bold text-tycoon-navy mb-4 text-center">How to Play</h2>
      <div className="space-y-4 text-sm text-gray-700">
        <div>
          <h3 className="font-semibold text-tycoon-navy mb-2">Objective</h3>
          <p>Build your trading empire by buying and selling products across different locations within 31 days.</p>
        </div>
        
        <div>
          <h3 className="font-semibold text-tycoon-navy mb-2">Getting Started</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>You start with $2,500 cash</li>
            <li>Buy products at low prices</li>
            <li>Travel to locations where they sell for more</li>
            <li>Manage your cash and bank account</li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold text-tycoon-navy mb-2">Banking</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Deposit money to earn 0.25% daily interest</li>
            <li>Take loans when you need more cash</li>
            <li>Loan interest: 0.5% daily</li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold text-tycoon-navy mb-2">Travel & Events</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Each travel takes 1 day</li>
            <li>Random events can affect prices</li>
            <li>Some travels have risks that may cost money</li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold text-tycoon-navy mb-2">Winning</h3>
          <p>Maximize your net worth (cash + bank - loans) by day 31 to climb the leaderboard!</p>
        </div>
      </div>
      
      <button 
        onClick={onBack}
        className="mt-6 w-full py-2 bg-tycoon-navy text-white rounded hover:bg-opacity-90 transition-colors"
      >
        Back
      </button>
    </div>
  );
}