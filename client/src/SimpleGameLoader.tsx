import React, { useState, useEffect } from 'react';
import { useGameStore } from './lib/stores/useGameStore';
import GamePage from './pages/GamePage';

interface SimpleGameLoaderProps {
  username: string;
}

export function SimpleGameLoader({ username }: SimpleGameLoaderProps) {
  const [gameReady, setGameReady] = useState(false);
  const store = useGameStore();

  useEffect(() => {
    let mounted = true;

    const initGame = async () => {
      try {
        // Set username
        store.setUsername(username);
        
        // Wait a bit for store to update
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Load existing game or start new
        const hasExisting = store.loadGameState();
        if (!hasExisting) {
          store.startGame();
        }
        
        if (mounted) {
          setGameReady(true);
        }
      } catch (error) {
        console.error('Game initialization error:', error);
        if (mounted) {
          setGameReady(true); // Still show the game
        }
      }
    };

    initGame();
    
    return () => {
      mounted = false;
    };
  }, [username]);

  if (!gameReady) {
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
          <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Starting your trading empire...</h2>
        </div>
      </div>
    );
  }

  return <GamePage />;
}