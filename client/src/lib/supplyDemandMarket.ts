import { Location } from '@shared/schema';
import { generateMarketListings, MarketListing } from '@shared/marketLogic';
import { getProductConfig } from '@shared/productConfig';

export interface GameMarketState {
  currentLocation: Location;
  playerReputation: number;
  gameDay: number;
  economicEvents: any[];
}

export function generateSupplyDemandMarket(state: GameMarketState): any[] {
  // Generate market listings using supply/demand system
  const marketListings = generateMarketListings(
    state.currentLocation,
    state.playerReputation,
    state.gameDay,
    state.economicEvents
  );

  // Convert to the format expected by existing game logic
  return marketListings.map(listing => ({
    id: listing.productId,
    productId: listing.productId,
    productName: listing.productName,
    price: listing.buyPrice,
    sellPrice: listing.sellPrice,
    available: listing.available,
    location: state.currentLocation,
    category: listing.category,
    supplyDemandRatio: listing.supplyDemandRatio,
    marketStatus: getMarketStatus(listing.supplyDemandRatio)
  }));
}

function getMarketStatus(supplyDemandRatio: number): string {
  if (supplyDemandRatio < 0.5) return 'High Demand';
  if (supplyDemandRatio < 0.8) return 'Good Demand';
  if (supplyDemandRatio < 1.2) return 'Balanced';
  if (supplyDemandRatio < 2.0) return 'High Supply';
  return 'Oversupply';
}

export function calculateDynamicPrice(
  productId: number,
  basePrice: number,
  location: Location,
  gameDay: number,
  playerReputation: number = 0
): { buyPrice: number; sellPrice: number } {
  const config = getProductConfig(productId);
  if (!config) {
    return { buyPrice: basePrice, sellPrice: basePrice * 0.8 };
  }

  // Use market logic for price calculations
  try {
    const marketListings = generateMarketListings(location, playerReputation, gameDay, []);
    const listing = marketListings.find(l => l.productId === productId);
    
    if (listing) {
      return {
        buyPrice: listing.buyPrice,
        sellPrice: listing.sellPrice
      };
    }
  } catch (error) {
    console.warn('Error calculating dynamic price:', error);
  }

  // Fallback to base price
  return { buyPrice: basePrice, sellPrice: basePrice * 0.8 };
}

export function getAllAvailableProducts(
  location: Location,
  playerReputation: number,
  gameDay: number
): MarketListing[] {
  return generateMarketListings(location, playerReputation, gameDay, []);
}