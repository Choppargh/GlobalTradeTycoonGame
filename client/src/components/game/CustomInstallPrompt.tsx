import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

// A simpler implementation that creates a fixed position overlay
export function CustomInstallPrompt() {
  const [isVisible, setIsVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent Chrome 76+ from automatically showing the prompt
      e.preventDefault();
      // Store the event for later use
      setDeferredPrompt(e);
      // Show our custom prompt
      setIsVisible(true);
      
      console.log('Install prompt intercepted');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Show the browser's install prompt
    deferredPrompt.prompt();
    
    try {
      // Wait for the user to respond
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User ${outcome === 'accepted' ? 'accepted' : 'declined'} the install prompt`);
    } catch (err) {
      console.error('Error with installation: ', err);
    }
    
    // Clear the deferred prompt
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-80 flex items-center justify-center p-4" data-state={isVisible ? "open" : "closed"}>
      <div className="bg-neutral-900 border-2 border-amber-600 rounded-lg p-6 max-w-md w-full shadow-xl">
        <div className="flex flex-col items-center mb-4">
          <img src="/images/GTC_Logo.png" alt="Global Trade Tycoon" className="w-36 h-auto" />
        </div>
        <h3 className="text-amber-500 text-xl font-bold mb-2 text-center">Install Global Trading Tycoon</h3>
        <p className="text-gray-200 mb-6">
          Install this game on your device to play offline and get a better experience. The game will be added to your home screen.
        </p>
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handleDismiss}
            className="border-amber-500 text-amber-500 hover:bg-amber-950"
          >
            Later
          </Button>
          <Button 
            onClick={handleInstall}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            Install Now
          </Button>
        </div>
      </div>
    </div>
  );
}