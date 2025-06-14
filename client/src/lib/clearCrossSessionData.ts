/**
 * Emergency fix for cross-session data contamination
 * Clears all existing game data and implements user-specific storage
 */

export function clearAllGameData() {
  // Clear all existing game data keys
  const keysToRemove = [];
  
  // Find all localStorage keys related to the game
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('globalTradeTycoon')) {
      keysToRemove.push(key);
    }
  }
  
  // Remove all found keys
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
    console.log('Cleared contaminated storage key:', key);
  });
  
  console.log('All cross-session game data cleared');
}

// Auto-clear contaminated data on import
if (typeof window !== 'undefined') {
  clearAllGameData();
}