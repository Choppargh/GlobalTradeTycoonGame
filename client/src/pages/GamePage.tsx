import { useState, useEffect } from 'react';
import { useGameStore } from '@/lib/stores/useGameStore';
import { GameHeader } from '@/components/game/GameHeader';
import { BuyTab } from '@/components/game/BuyTab';
import { SellTab } from '@/components/game/SellTab';
import { TravelOptions } from '@/components/game/TravelOptions';
import { BankInterface } from '@/components/game/BankInterface';
import { EventNotification } from '@/components/game/EventNotification';
import { TravelRiskNotification } from '@/components/game/TravelRiskNotification';
import { GameOver } from '@/components/game/GameOver';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function GamePage() {
  const [activeTab, setActiveTab] = useState("buy");

  const { 
    currentLocation, 
    gamePhase,
    currentEvent, 
    clearCurrentEvent, 
    isTravelRiskDialogOpen,
    travelRiskMessage,
    clearTravelRiskDialog,
    startGame,
    loadGameState
  } = useGameStore();

  // Auto-initialize game on first load
  useEffect(() => {
    const initializeGame = async () => {
      if (!currentLocation) {
        // First refresh user info to get userId, then try to load saved game
        await useGameStore.getState().refreshUserInfo();
        const hasExistingGame = loadGameState();
        if (!hasExistingGame) {
          await startGame();
        }
      }
    };
    
    initializeGame();
  }, [currentLocation, startGame, loadGameState]);

  // Check for game over state first
  if (gamePhase === 'game-over') {
    return <GameOver />;
  }

  // Basic game state loading
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

        {/* Buy and Sell Tabs - Tabbed on mobile, side-by-side on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          {/* Tabbed interface on mobile, hidden on desktop */}
          <div className="block lg:hidden w-full">
            <Tabs defaultValue="buy" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 w-full bg-amber-50 border-b border-amber-200 rounded-t-3xl">
                <TabsTrigger 
                  value="buy" 
                  className="text-base font-medium data-[state=active]:bg-orange-200 data-[state=active]:text-orange-800 rounded-tl-3xl rounded-br-none"
                >
                  Buy
                </TabsTrigger>
                <TabsTrigger 
                  value="sell" 
                  className="text-base font-medium data-[state=active]:bg-emerald-200 data-[state=active]:text-emerald-800 rounded-tr-3xl rounded-bl-none"
                >
                  Sell
                </TabsTrigger>
              </TabsList>
              <TabsContent value="buy" className="mt-0 pt-0 border-0 rounded-b-3xl">
                <BuyTab />
              </TabsContent>
              <TabsContent value="sell" className="mt-0 pt-0 border-0 rounded-b-3xl">
                <SellTab />
              </TabsContent>
            </Tabs>
          </div>

          {/* Desktop layout - side by side, hidden on mobile */}
          <div className="hidden lg:block col-span-1">
            <BuyTab />
          </div>
          <div className="hidden lg:block col-span-1">
            <SellTab />
          </div>
        </div>
      </div>

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