// Permanent React hooks stability fix
// This module ensures React hooks are always available and properly imported
import React from 'react';

// Re-export React hooks with stable references to prevent bundling issues
export const useState = React.useState;
export const useEffect = React.useEffect;
export const useCallback = React.useCallback;
export const useMemo = React.useMemo;
export const useRef = React.useRef;
export const useContext = React.useContext;
export const useReducer = React.useReducer;

// Export React itself for consistent imports
export { React };
export default React;