import React from 'react';
import { useGameStore } from '@/lib/stores/useGameStore';
import GamePage from './GamePage';
import { GameOver } from '@/components/game/GameOver';
import { WelcomeScreen } from '@/components/game/WelcomeScreen';

export default function HomePage() {
  const gameStore = useGameStore();
  const gamePhase = gameStore?.gamePhase || 'intro';
  
  return (
    <div className="min-h-screen">
      {gamePhase === 'intro' && <WelcomeScreen />}
      {gamePhase === 'playing' && <GamePage />}
      {gamePhase === 'game-over' && <GameOver />}
    </div>
  );
}
