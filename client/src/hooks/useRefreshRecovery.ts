import { useEffect } from 'react';
import { useGameStore } from '@/lib/stores/useGameStore';

/**
 * Custom hook to handle page refresh recovery
 * 
 * This hook ensures the game state can be recovered after a page refresh,
 * particularly useful for Android environments where pull-to-refresh actions
 * can cause the app to restart unexpectedly.
 */
export function useRefreshRecovery() {
  const { gamePhase, saveGameState, loadGameState } = useGameStore((state) => ({
    gamePhase: state.gamePhase,
    saveGameState: state.saveGameState,
    loadGameState: state.loadGameState
  }));
  
  // Save game state whenever it changes
  useEffect(() => {
    if (gamePhase === 'playing' && saveGameState) {
      // Save game state automatically when in playing phase
      saveGameState();
    }
  }, [gamePhase, saveGameState]);
  
  // Try to load saved game state on page load/refresh
  useEffect(() => {
    // Attempt to recover from a refresh by loading saved state
    const params = new URLSearchParams(window.location.search);
    const autoRecover = params.get('autoRecover') === 'true';
    
    if (autoRecover && loadGameState) {
      // If autoRecover flag is present, try to load the game state
      const success = loadGameState();
      
      // Remove the query param to prevent infinite loading attempts
      if (window.history && window.history.replaceState) {
        const newUrl = window.location.pathname + window.location.hash;
        window.history.replaceState(null, '', newUrl);
      }
      
      if (!success) {
        console.log('Failed to recover game state after refresh');
      }
    }
  }, [loadGameState]);
  
  // Add event listener for unload/refresh events
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (gamePhase === 'playing' && saveGameState) {
        // Save state before page unload/refresh
        saveGameState();
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [gamePhase, saveGameState]);
}