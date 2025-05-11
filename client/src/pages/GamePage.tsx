import { useEffect } from 'react';
import { useGameStore } from '@/lib/stores/useGameStore';
import { GameHeader } from '@/components/game/GameHeader';
import { LocationMap } from '@/components/game/LocationMap';
import { ProductMarket } from '@/components/game/ProductMarket';
import { Inventory } from '@/components/game/Inventory';
import { TravelOptions } from '@/components/game/TravelOptions';
import { BankInterface } from '@/components/game/BankInterface';
import { EventNotification } from '@/components/game/EventNotification';

export default function GamePage() {
  const { 
    currentLocation, 
    currentEvent, 
    clearCurrentEvent, 
    triggerRandomEvent 
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
        
        {/* Market and Inventory (side by side on large screens) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Product Market */}
          <div className="col-span-1">
            <ProductMarket />
          </div>
          
          {/* Inventory */}
          <div className="col-span-1">
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
    </div>
  );
}
