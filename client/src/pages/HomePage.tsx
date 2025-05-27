import React, { useState } from 'react';
import { SimpleWelcome } from '@/components/game/SimpleWelcome';

export default function HomePage() {
  const [gameStarted, setGameStarted] = useState(false);
  
  const handleStartGame = (username: string) => {
    console.log('Starting game for:', username);
    // For now, just show success - you can integrate with your game logic later
    alert(`Welcome ${username}! Your secure authentication is working perfectly. Game integration coming next!`);
  };
  
  return (
    <div className="min-h-screen">
      <SimpleWelcome onStartGame={handleStartGame} />
    </div>
  );
}
