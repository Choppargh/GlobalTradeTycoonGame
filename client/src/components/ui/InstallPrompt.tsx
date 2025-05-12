import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter 
} from './dialog';

// Define the interface for the BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Declare global for TypeScript
declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export function InstallPrompt() {
  // Only show on mobile devices
  const [isMobile, setIsMobile] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isAlreadyInstalled, setIsAlreadyInstalled] = useState(false);

  // Check if the user is on a mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      setIsMobile(
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
      );
    };

    checkMobile();
  }, []);

  // Check if the app is already installed
  useEffect(() => {
    // Check if app is running in standalone mode (installed PWA)
    if (window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone === true) {
      setIsAlreadyInstalled(true);
    }
  }, []);

  // Handle the beforeinstallprompt event
  useEffect(() => {
    // Don't capture install prompt if already installed or not on mobile
    if (isAlreadyInstalled) return;

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // Prevent Chrome from automatically showing the prompt
      e.preventDefault();
      
      // Save the event for later use
      setDeferredPrompt(e);
      
      // Only show for mobile users after a delay
      if (isMobile) {
        setTimeout(() => {
          setShowPrompt(true);
        }, 5000); // 5 second delay
      }
    };

    // Add event listener
    try {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    } catch (err) {
      console.error('Error setting up install prompt listener:', err);
    }

    // Cleanup
    return () => {
      try {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      } catch (err) {
        console.error('Error removing install prompt listener:', err);
      }
    };
  }, [isMobile, isAlreadyInstalled]);

  // Handle installing the PWA
  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.log('No installation prompt available');
      return;
    }

    try {
      // Show the install prompt
      await deferredPrompt.prompt();

      // Wait for the user to respond
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setIsAlreadyInstalled(true);
      } else {
        console.log('User dismissed the install prompt');
      }
    } catch (err) {
      console.error('Error during installation:', err);
    }

    // Reset the deferred prompt - it can only be used once
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  // Don't render anything if already installed or no prompt to show
  if (isAlreadyInstalled || !showPrompt) {
    return null;
  }

  return (
    <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Install Global Trade Tycoon</DialogTitle>
          <DialogDescription>
            Install the game on your device to play offline and get a better experience!
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center my-4">
          <img 
            src="/icons/icon-192x192.png" 
            alt="Global Trade Tycoon"
            className="w-24 h-24" 
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowPrompt(false)}>
            Later
          </Button>
          <Button onClick={handleInstallClick}>
            Install Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}