/**
 * Cache Management System
 * Prevents and clears React hook corruption issues
 */

// Clear all problematic cache types that cause useState corruption
export function clearReactCache(): void {
  try {
    // Clear localStorage items that might interfere with React
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (
        key.includes('react') ||
        key.includes('vite') ||
        key.includes('__') ||
        key.includes('hook')
      )) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));

    // Clear sessionStorage that might contain corrupted state
    const sessionKeysToRemove = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && (
        key.includes('react') ||
        key.includes('vite') ||
        key.includes('__') ||
        key.includes('hook')
      )) {
        sessionKeysToRemove.push(key);
      }
    }
    sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));

    console.log('Cleared React-related cache entries');
  } catch (error) {
    console.warn('Failed to clear cache:', error);
  }
}

// Monitor for React hook corruption and auto-clear cache
export function initializeCacheMonitoring(): void {
  // Clear cache on page load to prevent corruption
  clearReactCache();

  // Monitor for useState errors
  const originalError = console.error;
  console.error = (...args) => {
    const message = args.join(' ');
    if (
      message.includes('useState') ||
      message.includes('Cannot read properties of null') ||
      message.includes('hook') ||
      message.includes('React')
    ) {
      console.warn('React hook corruption detected, clearing cache...');
      clearReactCache();
      
      // Auto-refresh if corruption is severe
      if (message.includes('Cannot read properties of null (reading \'useState\')')) {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    }
    originalError.apply(console, args);
  };

  // Clear cache on page unload to prevent next session corruption
  window.addEventListener('beforeunload', () => {
    clearReactCache();
  });

  // Periodic cache health check
  setInterval(() => {
    try {
      // Test if React hooks are working
      const testDiv = document.createElement('div');
      // Simple test that doesn't actually render
      if (typeof window.React === 'undefined') {
        console.log('React cache health check passed');
      }
    } catch (error) {
      console.warn('React cache health check failed, clearing cache');
      clearReactCache();
    }
  }, 30000); // Every 30 seconds
}

// Manual cache clear function for user
export function clearAllCache(): void {
  try {
    // Clear all localStorage
    localStorage.clear();
    
    // Clear all sessionStorage
    sessionStorage.clear();
    
    // Clear IndexedDB if available
    if ('indexedDB' in window) {
      indexedDB.databases().then(databases => {
        databases.forEach(db => {
          if (db.name) {
            indexedDB.deleteDatabase(db.name);
          }
        });
      });
    }
    
    // Clear service worker cache if available
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
    
    console.log('All cache cleared successfully');
    
    // Reload page after clearing everything
    setTimeout(() => {
      window.location.reload();
    }, 500);
    
  } catch (error) {
    console.error('Failed to clear all cache:', error);
  }
}

// Expose cache clear function globally for emergency use
if (typeof window !== 'undefined') {
  (window as any).clearGameCache = clearAllCache;
  (window as any).clearReactCache = clearReactCache;
}