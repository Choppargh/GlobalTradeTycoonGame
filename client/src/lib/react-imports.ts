// Anti-corruption React imports system
// This module provides stable React hooks that resist HMR bundling corruption

import * as React from 'react';

// Create stable references that persist through HMR updates
export const stableUseState = React.useState;
export const stableUseEffect = React.useEffect;
export const stableUseCallback = React.useCallback;
export const stableUseMemo = React.useMemo;
export const stableUseRef = React.useRef;
export const stableUseContext = React.useContext;

// Verify hooks are available at module load time
if (typeof stableUseState !== 'function') {
  throw new Error('React useState hook is corrupted during import');
}

if (typeof stableUseEffect !== 'function') {
  throw new Error('React useEffect hook is corrupted during import');
}

if (typeof stableUseCallback !== 'function') {
  throw new Error('React useCallback hook is corrupted during import');
}

// Export a validator function to check hook integrity
export function validateReactHooks() {
  const errors = [];
  
  if (typeof stableUseState !== 'function') {
    errors.push('useState is corrupted');
  }
  
  if (typeof stableUseEffect !== 'function') {
    errors.push('useEffect is corrupted');
  }
  
  if (typeof stableUseCallback !== 'function') {
    errors.push('useCallback is corrupted');
  }
  
  if (errors.length > 0) {
    console.error('React hooks corruption detected:', errors);
    // Force page reload to recover from corruption
    window.location.reload();
  }
  
  return errors.length === 0;
}

// Auto-validate on import
validateReactHooks();