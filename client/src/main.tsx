import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Enhanced service worker registration with aggressive cache busting
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    // First, unregister any existing service workers to force fresh registration
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (let registration of registrations) {
        await registration.unregister();
        console.log('Service Worker unregistered to force cache refresh');
      }
    } catch (e) {
      console.log('Error during service worker unregistration:', e);
    }

    // Register with unique cache-busting query parameter
    const swUrl = `/serviceWorker.js?v=${Date.now()}`;
    navigator.serviceWorker.register(swUrl)
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
        
        // Check for updates every minute (more aggressive for development)
        setInterval(() => {
          registration.update();
          console.log('Checking for Service Worker updates...');
        }, 60 * 1000);
        
        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            console.log('New service worker being installed');
            newWorker.addEventListener('statechange', () => {
              console.log('Service worker state changed:', newWorker.state);
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('New version is available!');
                // Automatically reload to get the new version
                window.location.reload();
              }
            });
          }
        });
      })
      .catch(error => {
        console.log('Service Worker registration failed:', error);
      });
    
    // When a new service worker takes control, refresh the page
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Service worker controller changed');
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
