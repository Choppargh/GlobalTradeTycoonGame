import { useGameStore } from '@/lib/stores/useGameStore';
import { GameHeader } from '@/components/game/GameHeader';
import { LocationMap } from '@/components/game/LocationMap';
import { ProductMarket } from '@/components/game/ProductMarket';
import { Inventory } from '@/components/game/Inventory';
import { TravelOptions } from '@/components/game/TravelOptions';
import { BankInterface } from '@/components/game/BankInterface';

export default function GamePage() {
  const { currentLocation } = useGameStore();
  
  if (!currentLocation) {
    return <div>Loading game...</div>;
  }

  return (
    <div className="min-h-screen p-4 space-y-4 bg-background pb-8 overflow-y-auto">
      {/* Game Header with stats */}
      <GameHeader />
      
      {/* Main Game Grid - On smaller screens everything stacks */}
      <div className="grid grid-cols-1 gap-4">
        {/* Travel Options - Full Width */}
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
    </div>
  );
}
