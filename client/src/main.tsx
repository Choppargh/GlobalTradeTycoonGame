import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Simple service worker registration with safety checks
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Use a simpler service worker registration approach
    navigator.serviceWorker.register('/serviceWorker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
        
        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 5 * 60 * 1000);
      })
      .catch(error => {
        console.log('Service Worker registration failed:', error);
      });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
