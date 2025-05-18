/**
 * Auto-save utility for Global Trade Tycoon
 * 
 * This module provides functionality for automatically saving and restoring 
 * game state to prevent progress loss after unexpected app closures or refreshes.
 */

import { GameState } from "@shared/schema";
import { InventoryItem, ProductListing } from "@shared/schema";

// Constants
const STORAGE_KEY = 'globalTradeTycoon_savedGame';
const VERSION_KEY = 'globalTradeTycoon_savedGameVersion';
const CURRENT_VERSION = '1.0.0'; // Increment this when save format changes

/**
 * Saves the current game state to localStorage
 */
export function saveGameState(state: any): boolean {
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
    
    // Save state and version
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializableState));
    localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
    
    console.log('Game state saved successfully');
    return true;
  } catch (err) {
    console.error('Failed to save game state:', err);
    return false;
  }
}

/**
 * Loads the saved game state from localStorage
 */
export function loadGameState(): {success: boolean, savedState?: any} {
  try {
    const savedVersion = localStorage.getItem(VERSION_KEY);
    const savedStateJson = localStorage.getItem(STORAGE_KEY);
    
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
 * Clears any saved game state
 */
export function clearSavedGameState(): boolean {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(VERSION_KEY);
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