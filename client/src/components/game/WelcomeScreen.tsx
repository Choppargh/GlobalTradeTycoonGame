import React, { useState, useEffect } from 'react';
import { UsernameForm } from './UsernameForm';
import { Leaderboard } from './Leaderboard';
import { SimpleAuth } from '../auth/SimpleAuth';
import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';
import { LeaderboardEntry } from '@/types/game';
import { useGameStore } from '@/lib/stores/useGameStore';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function WelcomeScreen() {
  const [activeScreen, setActiveScreen] = useState<'welcome' | 'play' | 'leaderboard' | 'rules'>('welcome');
  const [hasSavedGame, setHasSavedGame] = useState(false);
  const [savedGameInfo, setSavedGameInfo] = useState<{username: string, days: number, cash: number} | null>(null);
  
  const { loadGameState, clearSavedGameState } = useGameStore();
  const { isAuthenticated, user, login } = useAuth();

  // Check for saved games on component mount
  useEffect(() => {
    try {
      const savedGame = localStorage.getItem('globalTradeTycoon_savedGame');
      if (savedGame) {
        const gameData = JSON.parse(savedGame);
        if (gameData && gameData.username && gameData.daysRemaining) {
          setHasSavedGame(true);
          setSavedGameInfo({
            username: gameData.username,
            days: 31 - gameData.daysRemaining,
            cash: gameData.cash + gameData.bankBalance
          });
        }
      }
    } catch (err) {
      console.error('Error checking for saved games:', err);
    }
  }, []);

  const { data: leaderboardData = [] } = useQuery<LeaderboardEntry[]>({
    queryKey: ['/api/scores'],
    queryFn: getQueryFn<LeaderboardEntry[]>({
      on401: 'returnNull',
    }),
  });
  
  const handleLoadGame = () => {
    const success = loadGameState();
    if (success) {
      toast.success('Game loaded successfully!');
    } else {
      toast.error('Failed to load saved game.');
    }
  };
  
  const handleClearSavedGame = () => {
    clearSavedGameState();
    setHasSavedGame(false);
    setSavedGameInfo(null);
    toast.success('Saved game cleared.');
  };

  const handleAuthSuccess = (username: string) => {
    // Start the game with the authenticated username
    const { startGame } = useGameStore.getState();
    startGame(username);
  };

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


      {activeScreen === 'welcome' && (
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-between max-w-5xl w-full mx-auto p-6 gap-8">
          {/* Logo on the left on desktop, centered on mobile */}
          <div className="flex justify-center md:justify-start">
            <img src="/images/GTC_Logo.png" alt="Global Trading Tycoon" className="w-40 sm:w-60 md:w-80" />
          </div>
          
          {/* Buttons on the right on desktop, centered below on mobile */}
          <div className="flex flex-col space-y-4 md:space-y-6 w-32 sm:w-48 md:w-64">
            <button 
              onClick={() => setActiveScreen('play')} 
              className="transition-transform hover:scale-105 focus:outline-none"
            >
              <img src="/images/GTC_Play.png" alt="Play" className="w-full" />
            </button>
            
            <button 
              onClick={() => setActiveScreen('leaderboard')} 
              className="transition-transform hover:scale-105 focus:outline-none"
            >
              <img src="/images/GTC_Leaderboard.png" alt="Leaderboard" className="w-full" />
            </button>
            
            <button 
              onClick={() => setActiveScreen('rules')} 
              className="transition-transform hover:scale-105 focus:outline-none"
            >
              <img src="/images/GTC_Rules.png" alt="Rules" className="w-full" />
            </button>
          </div>
        </div>
      )}

      {activeScreen === 'play' && (
        <>
          <>
            <SimpleAuth onAuthSuccess={handleAuthSuccess} />
            <button 
              onClick={() => setActiveScreen('welcome')}
              className="mt-4 py-2 px-6 bg-tycoon-navy text-white rounded hover:bg-opacity-90 transition-colors"
            >
              Back
            </button>
          </>
            <div className="bg-white/90 rounded-lg p-8 max-w-xl w-full mx-4 z-10 relative">
              <h2 className="text-2xl font-bold text-tycoon-navy mb-6 text-center">Welcome, {user?.username}!</h2>
              
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
                      onClick={handleLoadGame}
                      className="flex-1 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
                    >
                      Continue Game
                    </button>
                    <button 
                      onClick={handleClearSavedGame}
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
                <UsernameForm />
              </div>
              
              <button 
                onClick={() => setActiveScreen('welcome')}
                className="mt-4 w-full py-2 bg-tycoon-navy text-white rounded hover:bg-opacity-90 transition-colors"
              >
                Back
              </button>
            </div>
          )}
        </>
      )}

      {activeScreen === 'leaderboard' && (
        <div className="bg-white/90 rounded-lg p-6 max-w-xl w-full mx-4 z-10 relative">
          <h2 className="text-2xl font-bold text-tycoon-navy mb-4 text-center">Leaderboard</h2>
          <div className="overflow-y-auto max-h-[60vh]">
            <Leaderboard scores={leaderboardData} />
          </div>
          <button 
            onClick={() => setActiveScreen('welcome')}
            className="mt-4 w-full py-2 bg-tycoon-navy text-white rounded hover:bg-opacity-90 transition-colors"
          >
            Back
          </button>
        </div>
      )}

      {activeScreen === 'rules' && (
        <div className="bg-white/90 rounded-lg p-6 max-w-xl w-full mx-4 z-10 relative">
          <h2 className="text-2xl font-bold text-tycoon-navy mb-4 text-center">Game Rules</h2>
          <div className="overflow-y-auto max-h-[60vh] text-tycoon-navy space-y-4">
            <p>Welcome to Global Trading Tycoon, the trading simulation where your goal is to build wealth through strategic buying and selling!</p>
            
            <h3 className="text-xl font-bold">How to Play:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>You start with a $2,000 loan and 31 days to make as much profit as possible.</li>
              <li>Travel between 7 global locations, each with unique market conditions.</li>
              <li>Buy products at market price and sell them at the higher demand price for profit.</li>
              <li>Use the bank to deposit cash (earning 3% interest), withdraw funds, or take loans (with 5% fee).</li>
              <li>Travel costs 1 day and increases your loan by 5%.</li>
              <li>Watch out for random events that can affect prices and inventory!</li>
            </ul>
            
            <h3 className="text-xl font-bold">Game Rules:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>You cannot buy and sell the same product on the same day in the same location.</li>
              <li>Your final score is based on your banked cash at the end of 31 days.</li>
              <li>The maximum loan amount is $10,000.</li>
            </ul>
            
            <p className="font-bold">Good luck, and may your trades be profitable!</p>
          </div>
          <button 
            onClick={() => setActiveScreen('welcome')}
            className="mt-4 w-full py-2 bg-tycoon-navy text-white rounded hover:bg-opacity-90 transition-colors"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}