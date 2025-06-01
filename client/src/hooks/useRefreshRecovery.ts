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
  const { loadGameState, saveGameState, gamePhase } = useGameStore();
  
  // Save game state whenever it changes
  useEffect(() => {
    if (gamePhase === 'playing') {
      // Save game state automatically when in playing phase
      saveGameState();
    }
  }, [gamePhase, saveGameState]);
  
  // Try to load saved game state on page load/refresh
  useEffect(() => {
    // Attempt to recover from a refresh by loading saved state
    const params = new URLSearchParams(window.location.search);
    const autoRecover = params.get('autoRecover') === 'true';
    
    if (autoRecover) {
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
      if (gamePhase === 'playing') {
        // Save state before page unload/refresh
        saveGameState();
        
        // Add autoRecover param to URL so we know to try recovery on next load
        if (window.location.search.indexOf('autoRecover=true') === -1) {
          const separator = window.location.search ? '&' : '?';
          window.location.href = `${window.location.href}${separator}autoRecover=true`;
        }
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [gamePhase, saveGameState]);
}