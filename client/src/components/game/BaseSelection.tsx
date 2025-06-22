import React, { useState } from 'react';
import { Location, BASE_BONUSES } from '@shared/schema';

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
  const [selectedBase, setSelectedBase] = useState<Location | null>(null);

  const handleConfirmSelection = () => {
    if (selectedBase) {
      onBaseSelected(selectedBase);
    }
  };

  return (
    <div className="min-h-screen p-4" style={{
      backgroundImage: `url('/images/GTC_Background_Portrait.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-4">
            Choose Your Home Base
          </h1>
          <p className="text-xl text-white/90 drop-shadow-md max-w-2xl mx-auto">
            Select your starting region to establish your trading empire. Your home base provides 
            a 5% discount on all goods and your first office and warehouse.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Object.entries(LOCATION_DESCRIPTIONS).map(([location, info]) => (
            <div
              key={location}
              onClick={() => setSelectedBase(location as Location)}
              className={`bg-white/95 backdrop-blur-sm rounded-3xl shadow-lg p-6 cursor-pointer transition-all duration-200 ${
                selectedBase === location 
                  ? 'ring-4 ring-amber-500 transform scale-105' 
                  : 'hover:shadow-xl hover:transform hover:scale-102'
              }`}
            >
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {info.title}
                </h3>
                <div className="text-2xl mb-2">
                  {location === Location.Africa && '🌍'}
                  {location === Location.Asia && '🏯'}
                  {location === Location.Europe && '🏛️'}
                  {location === Location.NorthAmerica && '🏢'}
                  {location === Location.SouthAmerica && '🌴'}
                  {location === Location.Oceania && '🏝️'}
                  {location === Location.Antarctica && '🧊'}
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {info.description}
              </p>
              
              <div className="border-t pt-4">
                <div className="text-sm font-semibold text-amber-600 mb-2">
                  {info.bonus}
                </div>
                <div className="text-xs text-gray-500 mb-3">
                  Key Products: {info.products.join(', ')}
                </div>
                <div className="text-xs text-green-600 font-medium">
                  5% discount on all goods
                </div>
              </div>
              
              {selectedBase === location && (
                <div className="mt-4 text-center">
                  <div className="inline-block bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Selected
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedBase && (
          <div className="text-center">
            <button
              onClick={handleConfirmSelection}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-8 rounded-2xl text-lg shadow-lg transition-colors"
            >
              Start Trading in {LOCATION_DESCRIPTIONS[selectedBase].title}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}