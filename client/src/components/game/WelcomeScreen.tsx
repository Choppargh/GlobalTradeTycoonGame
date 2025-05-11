import React, { useState } from 'react';
import { UsernameForm } from './UsernameForm';
import { Leaderboard } from './Leaderboard';
import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';
import { LeaderboardEntry } from '@/types/game';

export function WelcomeScreen() {
  const [activeScreen, setActiveScreen] = useState<'welcome' | 'play' | 'leaderboard' | 'rules'>('welcome');

  const { data: leaderboardData = [] } = useQuery<LeaderboardEntry[]>({
    queryKey: ['/scores'],
    queryFn: getQueryFn<LeaderboardEntry[]>({
      on401: 'returnNull',
    }),
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url('/images/GTC_Background_Portrait.png')`,
        backgroundSize: 'contain',
        backgroundPosition: 'center top',
        backgroundRepeat: 'repeat-y',
        backgroundAttachment: 'fixed',
        backgroundColor: '#000'
      }}
    >

      {activeScreen === 'welcome' && (
        <div className="flex flex-col items-center justify-center max-w-xl mx-auto p-6 space-y-10">
          <img src="/images/GTC_Logo.png" alt="Global Trading Tycoon" className="w-80 mx-auto" />
          
          <div className="flex flex-col space-y-6 w-64">
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
        <div className="bg-white/90 rounded-lg p-8 max-w-xl w-full mx-4">
          <h2 className="text-2xl font-bold text-tycoon-navy mb-6 text-center">Enter Your Trading Name</h2>
          <UsernameForm />
          <button 
            onClick={() => setActiveScreen('welcome')}
            className="mt-4 w-full py-2 bg-tycoon-navy text-white rounded hover:bg-opacity-90 transition-colors"
          >
            Back
          </button>
        </div>
      )}

      {activeScreen === 'leaderboard' && (
        <div className="bg-white/90 rounded-lg p-6 max-w-xl w-full mx-4">
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
        <div className="bg-white/90 rounded-lg p-6 max-w-xl w-full mx-4">
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