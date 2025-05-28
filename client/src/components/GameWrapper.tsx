import React, { useEffect, useState } from "react";
import GamePage from "../pages/GamePage";
import { useGameStore } from "../lib/stores/useGameStore";

interface GameWrapperProps {
  username: string;
}

export function GameWrapper({ username }: GameWrapperProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const store = useGameStore();

  useEffect(() => {
    const initializeGame = async () => {
      try {
        // Set the username first
        store.setUsername(username);
        
        // Try to load existing game state, if not found, start new game
        const hasExistingGame = store.loadGameState();
        if (!hasExistingGame) {
          store.startGame();
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Game initialization error:', error);
        // Still try to show the game even if there's an error
        setIsInitialized(true);
      }
    };

    if (!isInitialized) {
      initializeGame();
    }
  }, [username, isInitialized]);

  if (!isInitialized) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f4d03f 0%, #e67e22 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ textAlign: 'center', color: '#8b4513' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px dashed #e67e22',
            borderRadius: '50%',
            animation: 'spin 2s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Loading game...</h2>
        </div>
      </div>
    );
  }

  return <GamePage />;
}