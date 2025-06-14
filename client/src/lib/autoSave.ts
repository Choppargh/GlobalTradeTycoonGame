/**
 * Auto-save utility for Global Trade Tycoon
 * 
 * This module provides functionality for automatically saving and restoring 
 * game state to prevent progress loss after unexpected app closures or refreshes.
 */

import { GameState } from "@shared/schema";
import { InventoryItem, ProductListing } from "@shared/schema";

// Constants
const CURRENT_VERSION = '1.0.0'; // Increment this when save format changes

// Generate user-specific storage keys
function getStorageKey(userId?: number): string {
  return userId ? `globalTradeTycoon_savedGame_user_${userId}` : 'globalTradeTycoon_savedGame_guest';
}

function getVersionKey(userId?: number): string {
  return userId ? `globalTradeTycoon_savedGameVersion_user_${userId}` : 'globalTradeTycoon_savedGameVersion_guest';
}

/**
 * Saves the current game state to localStorage with user isolation
 */
export function saveGameState(state: any, userId?: number): boolean {
  try {
    // Create serializable version of state (converting Sets to arrays)
    const serializableState = {
      ...state,
      boughtProducts: Array.from(state.boughtProducts || []),
      soldProducts: Array.from(state.soldProducts || []),
      // Include only essential data needed to restore game
      username: state.username,
      currentLocation: state.currentLocation,
      cash: state.cash,
      bankBalance: state.bankBalance,
      loanAmount: state.loanAmount,
      daysRemaining: state.daysRemaining,
      inventory: state.inventory,
      marketListings: state.marketListings,
      gamePhase: state.gamePhase
    };
    
    // Save state and version with user-specific keys
    localStorage.setItem(getStorageKey(userId), JSON.stringify(serializableState));
    localStorage.setItem(getVersionKey(userId), CURRENT_VERSION);
    
    console.log('Game state saved successfully');
    return true;
  } catch (err) {
    console.error('Failed to save game state:', err);
    return false;
  }
}

/**
 * Loads the saved game state from localStorage with user isolation
 */
export function loadGameState(userId?: number): {success: boolean, savedState?: any} {
  try {
    const savedVersion = localStorage.getItem(getVersionKey(userId));
    const savedStateJson = localStorage.getItem(getStorageKey(userId));
    
    if (!savedStateJson || !savedVersion) {
      console.log('No saved game state found');
      return { success: false };
    }
    
    if (savedVersion !== CURRENT_VERSION) {
      console.log('Saved game version mismatch - cannot load');
      return { success: false };
    }
    
    // Parse saved state
    const savedState = JSON.parse(savedStateJson);
    
    // Convert arrays back to Sets
    const restoredState = {
      ...savedState,
      boughtProducts: new Set(savedState.boughtProducts || []),
      soldProducts: new Set(savedState.soldProducts || [])
    };
    
    return { success: true, savedState: restoredState };
  } catch (err) {
    console.error('Failed to load saved game state:', err);
    return { success: false };
  }
}

/**
 * Clears any saved game state with user isolation
 */
export function clearSavedGameState(userId?: number): boolean {
  try {
    localStorage.removeItem(getStorageKey(userId));
    localStorage.removeItem(getVersionKey(userId));
    console.log('Saved game cleared successfully');
    return true;
  } catch (err) {
    console.error('Failed to clear saved game:', err);
    return false;
  }
}

/**
 * Handles auto-save for critical game actions
 */
export function withAutoSave<T extends (...args: any[]) => any>(
  action: T, 
  stateGetter: () => any,
  autoSaveEnabled: boolean = true
): T {
  return ((...args: any[]) => {
    // Execute the original action
    const result = action(...args);
    
    // Auto-save if enabled
    if (autoSaveEnabled) {
      setTimeout(() => {
        const currentState = stateGetter();
        saveGameState(currentState);
      }, 100);
    }
    
    return result;
  }) as T;
}