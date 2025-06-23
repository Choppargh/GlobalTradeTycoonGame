/**
 * React Hook Stability Module
 * Prevents useState corruption during HMR by creating stable hook references
 */

import * as ReactModule from 'react';

// Create stable references to React hooks that won't be corrupted by HMR
const stableHooks = {
  useState: ReactModule.useState,
  useEffect: ReactModule.useEffect,
  useCallback: ReactModule.useCallback,
  useMemo: ReactModule.useMemo,
  useRef: ReactModule.useRef,
  useContext: ReactModule.useContext,
  useReducer: ReactModule.useReducer,
  useLayoutEffect: ReactModule.useLayoutEffect,
  useImperativeHandle: ReactModule.useImperativeHandle,
  useDebugValue: ReactModule.useDebugValue
};

// Validation function to ensure hooks are still valid
function validateHook(hookName: string, hook: any) {
  if (!hook || typeof hook !== 'function') {
    console.error(`React hook ${hookName} is corrupted. Attempting recovery...`);
    // Force page reload as last resort
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
    throw new Error(`React hooks corrupted - page reload required`);
  }
  return hook;
}

// Export wrapped hooks with validation
export const useState = <T>(initialState: T | (() => T)) => {
  const hook = validateHook('useState', stableHooks.useState);
  return hook(initialState);
};

export const useEffect = (effect: React.EffectCallback, deps?: React.DependencyList) => {
  const hook = validateHook('useEffect', stableHooks.useEffect);
  return hook(effect, deps);
};

export const useCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T => {
  const hook = validateHook('useCallback', stableHooks.useCallback);
  return hook(callback, deps);
};

export const useMemo = <T>(factory: () => T, deps: React.DependencyList): T => {
  const hook = validateHook('useMemo', stableHooks.useMemo);
  return hook(factory, deps);
};

export const useRef = <T>(initialValue: T): React.MutableRefObject<T> => {
  const hook = validateHook('useRef', stableHooks.useRef);
  return hook(initialValue);
};

export const useContext = <T>(context: React.Context<T>): T => {
  const hook = validateHook('useContext', stableHooks.useContext);
  return hook(context);
};

export const useReducer = <R extends React.Reducer<any, any>>(
  reducer: R,
  initialState: React.ReducerState<R>,
  initializer?: React.ReducerStateWithoutAction<R>
) => {
  const hook = validateHook('useReducer', stableHooks.useReducer);
  return hook(reducer, initialState, initializer);
};

export const useLayoutEffect = (effect: React.EffectCallback, deps?: React.DependencyList) => {
  const hook = validateHook('useLayoutEffect', stableHooks.useLayoutEffect);
  return hook(effect, deps);
};

// Debug utilities for development
if (import.meta.env.DEV) {
  // Monitor hook stability in development
  let hookCheckInterval: NodeJS.Timeout;
  
  const checkHookStability = () => {
    try {
      Object.entries(stableHooks).forEach(([name, hook]) => {
        if (!hook || typeof hook !== 'function') {
          console.warn(`Hook ${name} became unstable, refreshing references...`);
          // Attempt to restore from ReactModule
          (stableHooks as any)[name] = (ReactModule as any)[name];
        }
      });
    } catch (error) {
      console.error('Hook stability check failed:', error);
    }
  };

  // Check hook stability every 5 seconds in development
  hookCheckInterval = setInterval(checkHookStability, 5000);
  
  // Clean up on module disposal
  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      if (hookCheckInterval) {
        clearInterval(hookCheckInterval);
      }
    });
  }
}

export default {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useContext,
  useReducer,
  useLayoutEffect
};