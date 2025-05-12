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
  
  // Random events now happen only when traveling to a new location
  // No need for periodic checks anymore
  
  if (!currentLocation) {
    return <div>Loading game...</div>;
  }

  return (
    <div className="min-h-screen p-4 space-y-4 pb-8 overflow-x-hidden scrollbar-hide"
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
