import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

export function InstallPrompt() {
  const [isOpen, setIsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the default browser prompt
      e.preventDefault();
      // Store the event for later use
      setDeferredPrompt(e);
      // Show our custom prompt
      setIsOpen(true);
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
    
    // Wait for the user to respond
    const choiceResult = await deferredPrompt.userChoice;
    
    // Reset the deferred prompt variable
    setDeferredPrompt(null);
    setIsOpen(false);

    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
  };

  const handleDismiss = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-neutral-900 border-2 border-amber-600 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-amber-500 text-xl">Install Global Trading Tycoon</DialogTitle>
          <DialogDescription className="text-gray-200">
            Install this game on your device to play offline and get a better experience. The game will be added to your home screen.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row justify-between mt-4">
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}