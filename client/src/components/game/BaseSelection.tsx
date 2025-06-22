import React, { useState } from 'react';
import { Location, BASE_BONUSES } from '@shared/schema';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface BaseSelectionProps {
  onBaseSelected: (homeBase: Location) => void;
}

const LOCATION_DESCRIPTIONS = {
  [Location.Africa]: {
    title: "African Trading Hub",
    description: "Rich in agricultural products and natural resources. Perfect for food commodity trading.",
    bonus: "Food Products Bonus",
    products: ["Coffee", "Spices", "Gold", "Diamonds"]
  },
  [Location.Asia]: {
    title: "Asian Tech Center", 
    description: "Technology and manufacturing powerhouse. Ideal for electronics and industrial goods.",
    bonus: "Technology Bonus",
    products: ["Electronics", "Tea", "Silk", "Rice"]
  },
  [Location.Europe]: {
    title: "European Financial District",
    description: "Luxury goods and financial services. Great for high-value commodity trading.",
    bonus: "Luxury Goods Bonus", 
    products: ["Silver", "Cotton", "Wheat", "Gas"]
  },
  [Location.NorthAmerica]: {
    title: "North American Trade Hub",
    description: "Advanced financial markets and energy sector. Excellent for oil and gas trading.",
    bonus: "Financial Services Bonus",
    products: ["Oil", "Corn", "Copper", "Electronics"]
  },
  [Location.SouthAmerica]: {
    title: "South American Resource Center",
    description: "Abundant natural resources and mining operations. Perfect for raw materials.",
    bonus: "Natural Resources Bonus",
    products: ["Copper", "Coffee", "Gold", "Oil"]
  },
  [Location.Oceania]: {
    title: "Oceanic Trade Network",
    description: "Strategic island trading posts with excellent maritime connections.",
    bonus: "Maritime Trade Bonus",
    products: ["Gold", "Wheat", "Cotton", "Gas"]
  },
  [Location.Antarctica]: {
    title: "Antarctic Research Station",
    description: "Advanced research facilities with unique trading opportunities.",
    bonus: "Research & Development Bonus",
    products: ["Gas", "Oil", "Electronics", "Silver"]
  }
};

export function BaseSelection({ onBaseSelected }: BaseSelectionProps) {
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [pendingSelection, setPendingSelection] = useState<Location | null>(null);

  const handleLocationClick = (location: Location) => {
    setPendingSelection(location);
    setConfirmationOpen(true);
  };

  const handleConfirmSelection = () => {
    if (pendingSelection) {
      onBaseSelected(pendingSelection);
    }
    setConfirmationOpen(false);
  };

  const handleCancelSelection = () => {
    setPendingSelection(null);
    setConfirmationOpen(false);
  };

  return (
    <div className="min-h-screen p-4" style={{
      backgroundImage: `url('/images/GTC_Background_Portrait.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 bg-white/90 backdrop-blur-sm px-6 py-4 rounded-3xl shadow-lg mb-6 mx-auto inline-block">
            Choose Your Home Base
          </h1>
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-lg p-6 mx-4">
            <p className="text-lg text-gray-800 max-w-2xl mx-auto">
              Select your starting region to establish your trading empire. Your home base provides 
              a 5% discount on all goods and your first office and warehouse.
            </p>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-lg overflow-hidden">
          <div className="divide-y divide-gray-200">
            {Object.entries(LOCATION_DESCRIPTIONS).map(([location, info]) => (
              <div
                key={location}
                onClick={() => handleLocationClick(location as Location)}
                className="p-6 cursor-pointer hover:bg-amber-50 transition-colors duration-200 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="text-3xl">
                    {location === Location.Africa && '🌍'}
                    {location === Location.Asia && '🏯'}
                    {location === Location.Europe && '🏛️'}
                    {location === Location.NorthAmerica && '🏢'}
                    {location === Location.SouthAmerica && '🌴'}
                    {location === Location.Oceania && '🏝️'}
                    {location === Location.Antarctica && '🧊'}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {info.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {info.description}
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs">
                      <span className="text-amber-600 font-semibold">{info.bonus}</span>
                      <span className="text-gray-500">Products: {info.products.join(', ')}</span>
                      <span className="text-green-600 font-medium">5% discount</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-amber-500 text-xl">
                  →
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
        <DialogContent className="bg-white rounded-3xl shadow-xl max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 text-center">
              Confirm Your Home Base
            </DialogTitle>
          </DialogHeader>
          
          {pendingSelection && (
            <div className="py-4">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">
                  {pendingSelection === Location.Africa && '🌍'}
                  {pendingSelection === Location.Asia && '🏯'}
                  {pendingSelection === Location.Europe && '🏛️'}
                  {pendingSelection === Location.NorthAmerica && '🏢'}
                  {pendingSelection === Location.SouthAmerica && '🌴'}
                  {pendingSelection === Location.Oceania && '🏝️'}
                  {pendingSelection === Location.Antarctica && '🧊'}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {LOCATION_DESCRIPTIONS[pendingSelection].title}
                </h3>
              </div>
              
              <p className="text-gray-600 text-center mb-4">
                Start your trading empire in {LOCATION_DESCRIPTIONS[pendingSelection].title}? 
                You'll receive a 5% discount on all goods and starting infrastructure.
              </p>
            </div>
          )}
          
          <DialogFooter className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleCancelSelection}
              className="flex-1 rounded-2xl"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmSelection}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}