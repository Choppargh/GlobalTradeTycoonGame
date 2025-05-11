import { useEffect, useState } from 'react';
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

export default function GamePage() {
  const [activeTab, setActiveTab] = useState("market");
  const { 
    currentLocation, 
    currentEvent, 
    clearCurrentEvent, 
    triggerRandomEvent,
    isTravelRiskDialogOpen,
    travelRiskMessage,
    clearTravelRiskDialog
  } = useGameStore();
  
  // Check for random events periodically
  useEffect(() => {
    if (!currentLocation) return;
    
    // Try to trigger a random event every 10-15 seconds (for testing)
    const eventCheckInterval = setInterval(() => {
      if (!currentEvent) {
        triggerRandomEvent();
      }
    }, Math.random() * 5000 + 10000); // Between 10-15 seconds for testing
    
    return () => clearInterval(eventCheckInterval);
  }, [currentLocation, currentEvent, triggerRandomEvent]);
  
  if (!currentLocation) {
    return <div>Loading game...</div>;
  }

  return (
    <div className="min-h-screen p-4 space-y-4 pb-8 overflow-y-auto"
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
      <div className="grid grid-cols-1 gap-4">
        {/* Travel Options or Game Completion - Full Width */}
        <div className="w-full">
          <TravelOptions />
        </div>
        
        {/* Market and Inventory - Tabbed on mobile, side-by-side on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Tabbed interface on mobile, hidden on desktop */}
          <div className="block lg:hidden w-full">
            <Tabs defaultValue="market" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 w-full mb-2">
                <TabsTrigger 
                  value="market" 
                  className="text-base font-medium"
                >
                  Market
                </TabsTrigger>
                <TabsTrigger 
                  value="inventory" 
                  className="text-base font-medium"
                >
                  Inventory
                </TabsTrigger>
              </TabsList>
              <TabsContent value="market" className="mt-0 pt-2">
                <ProductMarket />
              </TabsContent>
              <TabsContent value="inventory" className="mt-0 pt-2">
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
