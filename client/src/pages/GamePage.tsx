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
      
      {/* Main Game Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left Column - Map and Travel */}
        <div className="space-y-4 col-span-1">
          {/* World Map */}
          <LocationMap currentLocation={currentLocation} />
          
          {/* Travel Options */}
          <TravelOptions />
        </div>
        
        {/* Right Column - Market and Inventory */}
        <div className="col-span-1 md:col-span-2 space-y-4">
          {/* Product Market */}
          <ProductMarket />
          
          {/* Inventory */}
          <Inventory />
        </div>
      </div>
      
      {/* Bank Modal (shows when needed) */}
      <BankInterface />
    </div>
  );
}
