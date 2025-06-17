// React safety utilities to prevent bundling conflicts
import React from 'react';

// Explicitly export React hooks to prevent null reference errors
export const useState = React.useState;
export const useEffect = React.useEffect;
export const useCallback = React.useCallback;
export const useMemo = React.useMemo;
export const useRef = React.useRef;
export const useContext = React.useContext;

// Verify React is properly loaded
export const isReactLoaded = () => {
  return typeof React !== 'undefined' && 
         typeof React.useState === 'function' &&
         typeof React.useEffect === 'function';
};

// Safe hook wrapper that checks React availability
export function withReactSafety<T extends (...args: any[]) => any>(hookFn: T): T {
  return ((...args: any[]) => {
    if (!isReactLoaded()) {
      throw new Error('React hooks are not available. This indicates a bundling or import issue.');
    }
    return hookFn(...args);
  }) as T;
}