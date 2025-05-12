import { useEffect, useState, useCallback } from 'react';
import { useGameStore } from '@/lib/stores/useGameStore';
import { GameHeader } from '@/components/game/GameHeader';
import { LocationMap } from '@/components/game/LocationMap';
import { ProductMarket } from '@/components/game/ProductMarket';
import { Inventory } from '@/components/game/Inventory';
import { TravelOptions } from '@/components/game/TravelOptions';
import { BankInterface } from '@/components/game/BankInterface';
import { EventNotification } from '@/components/game/EventNotification';
import { TravelRiskNotification } from '@/components/game/TravelRiskNotification';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from '@/hooks/use-is-mobile';
import { toast } from 'sonner';

export default function GamePage() {
  const [activeTab, setActiveTab] = useState("market");
  const [isStandalone, setIsStandalone] = useState(false);
  const isMobile = useIsMobile();
  
  const { 
    currentLocation, 
    currentEvent, 
    clearCurrentEvent, 
    triggerRandomEvent,
    isTravelRiskDialogOpen,
    travelRiskMessage,
    clearTravelRiskDialog,
    saveGameState,
    username
  } = useGameStore();
  
  // Auto-save game state every 30 seconds
  useEffect(() => {
    if (!currentLocation || !username) return;
    
    const saveInterval = setInterval(() => {
      try {
        saveGameState();
        // Only show toast in standalone mode to avoid disturbing regular web users
        if (isStandalone) {
          toast.success("Game progress saved", {
            duration: 2000,
            position: "bottom-center"
          });
        }
      } catch (err) {
        console.error("Failed to auto-save game:", err);
      }
    }, 30000);
    
    return () => clearInterval(saveInterval);
  }, [currentLocation, username, saveGameState, isStandalone]);
  
  // Check if app is running in standalone mode (installed PWA)
  useEffect(() => {
    // Check if the app is running as installed PWA
    const isRunningStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                               (window.navigator as any).standalone || 
                               document.referrer.includes('android-app://');
    
    setIsStandalone(isRunningStandalone);
  }, []);
  
  // Handle back button for better PWA experience
  useEffect(() => {
    const handleBackButton = (e: PopStateEvent) => {
      // Prevent default back button behavior when in standalone mode
      if (isStandalone) {
        e.preventDefault();
        // Ask for confirmation
        if (confirm('Do you want to exit the game? All unsaved progress will be lost.')) {
          // In PWA, close isn't reliable, so redirect to home
          window.location.href = '/';
        } else {
          // Push a new state to prevent back action
          window.history.pushState(null, '', window.location.pathname);
        }
      }
    };
    
    // Listen for back button press
    window.addEventListener('popstate', handleBackButton);
    // Push a state on component mount
    if (isStandalone) {
      window.history.pushState(null, '', window.location.pathname);
    }
    
    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [isStandalone]);
  
  // Track screen orientation for better mobile experience
  useEffect(() => {
    const handleOrientationChange = () => {
      if (isMobile && window.screen.orientation.type.includes('landscape')) {
        toast.info("Rotate your device for the best experience", {
          duration: 3000,
          position: "top-center"
        });
      }
    };
    
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // Check on initial load
    if (isMobile && window.screen.orientation.type.includes('landscape')) {
      toast.info("Rotate your device for the best experience", {
        duration: 3000,
        position: "top-center"
      });
    }
    
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [isMobile]);
  
  if (!currentLocation) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-dashed rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-amber-700">Loading game...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-2 sm:p-4 space-y-3 sm:space-y-4 pb-8 overflow-x-hidden scrollbar-hide"
      style={{
        backgroundImage: `url('/images/GTC_Background_Portrait.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Game Header with stats */}
      <GameHeader />
      
      {/* Main Game Grid - On smaller screens everything stacks */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {/* Travel Options or Game Completion - Full Width */}
        <div className="w-full">
          <TravelOptions />
        </div>
        
        {/* Market and Inventory - Tabbed on mobile, side-by-side on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          {/* Tabbed interface on mobile, hidden on desktop */}
          <div className="block lg:hidden w-full">
            <Tabs defaultValue="market" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 w-full bg-amber-50 border-b border-amber-200">
                <TabsTrigger 
                  value="market" 
                  className="text-base font-medium data-[state=active]:bg-amber-100 data-[state=active]:text-amber-800 rounded-b-none"
                >
                  Market
                </TabsTrigger>
                <TabsTrigger 
                  value="inventory" 
                  className="text-base font-medium data-[state=active]:bg-amber-100 data-[state=active]:text-amber-800 rounded-b-none"
                >
                  Inventory
                </TabsTrigger>
              </TabsList>
              <TabsContent value="market" className="mt-0 pt-0 border border-amber-200 border-t-0 rounded-t-none">
                <ProductMarket />
              </TabsContent>
              <TabsContent value="inventory" className="mt-0 pt-0 border border-amber-200 border-t-0 rounded-t-none">
                <Inventory />
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Desktop layout - side by side, hidden on mobile */}
          <div className="hidden lg:block col-span-1">
            <ProductMarket />
          </div>
          <div className="hidden lg:block col-span-1">
            <Inventory />
          </div>
        </div>
      </div>
      
      {/* Save Game button (only visible in standalone PWA mode) */}
      {isStandalone && (
        <div className="fixed bottom-4 right-4 z-40">
          <button 
            onClick={() => {
              saveGameState();
              toast.success("Game progress saved", {
                duration: 2000,
                position: "bottom-center"
              });
            }}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-full shadow-lg flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h1a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h1v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
            </svg>
            Save
          </button>
        </div>
      )}
      
      {/* Bank Modal (shows when needed) */}
      <BankInterface />
      
      {/* Random Event Notification */}
      <EventNotification 
        event={currentEvent} 
        onClose={clearCurrentEvent} 
      />
      
      {/* Travel Risk Notification */}
      <TravelRiskNotification
        isOpen={isTravelRiskDialogOpen}
        message={travelRiskMessage}
        onClose={clearTravelRiskDialog}
      />
    </div>
  );
}
