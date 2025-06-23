import { Location } from './schema';
import { getProductConfig, getUnlockedProducts, ReputationLevel, getReputationLevel } from './productConfig';

export interface MarketListing {
  productId: number;
  productName: string;
  category: string;
  basePrice: number;
  buyPrice: number;
  sellPrice: number;
  supply: number;
  demand: number;
  supplyDemandRatio: number;
  priceModifier: number;
  locationModifier: number;
  available: number;
  maxAvailable: number;
}

export interface SupplyDemandFactors {
  baseSupply: number;
  baseDemand: number;
  locationSupplyModifier: number;
  locationDemandModifier: number;
  seasonalModifier: number;
  economicEventModifier: number;
}

// Location-specific supply and demand modifiers
const LOCATION_MODIFIERS: Record<Location, Record<string, { supply: number; demand: number }>> = {
  [Location.Africa]: {
    'Raw Materials': { supply: 1.4, demand: 0.8 },
    'Precious Metals': { supply: 1.6, demand: 0.7 },
    'Textiles': { supply: 1.2, demand: 0.9 },
    'Food & Beverages': { supply: 1.1, demand: 1.0 },
    'Industrial': { supply: 0.6, demand: 1.3 },
    'Luxury Goods': { supply: 0.4, demand: 1.8 },
    'Construction': { supply: 0.8, demand: 1.4 },
    'Medical': { supply: 0.5, demand: 1.6 }
  },
  [Location.Antarctica]: {
    'Raw Materials': { supply: 0.3, demand: 2.0 },
    'Precious Metals': { supply: 0.2, demand: 1.2 },
    'Textiles': { supply: 0.2, demand: 2.2 },
    'Food & Beverages': { supply: 0.1, demand: 3.0 },
    'Industrial': { supply: 0.4, demand: 2.5 },
    'Luxury Goods': { supply: 0.3, demand: 1.8 },
    'Construction': { supply: 0.5, demand: 2.8 },
    'Medical': { supply: 0.2, demand: 3.2 }
  },
  [Location.Asia]: {
    'Raw Materials': { supply: 1.3, demand: 1.2 },
    'Precious Metals': { supply: 1.1, demand: 1.4 },
    'Textiles': { supply: 1.8, demand: 0.6 },
    'Food & Beverages': { supply: 1.2, demand: 1.1 },
    'Industrial': { supply: 1.6, demand: 0.8 },
    'Luxury Goods': { supply: 0.9, demand: 1.3 },
    'Construction': { supply: 1.4, demand: 1.0 },
    'Medical': { supply: 1.2, demand: 0.9 }
  },
  [Location.Oceania]: {
    'Raw Materials': { supply: 1.5, demand: 0.9 },
    'Precious Metals': { supply: 1.4, demand: 0.8 },
    'Textiles': { supply: 0.7, demand: 1.2 },
    'Food & Beverages': { supply: 1.3, demand: 0.8 },
    'Industrial': { supply: 0.9, demand: 1.1 },
    'Luxury Goods': { supply: 0.8, demand: 1.4 },
    'Construction': { supply: 1.1, demand: 1.2 },
    'Medical': { supply: 1.0, demand: 1.0 }
  },
  [Location.Europe]: {
    'Raw Materials': { supply: 0.8, demand: 1.2 },
    'Precious Metals': { supply: 0.9, demand: 1.3 },
    'Textiles': { supply: 1.1, demand: 1.0 },
    'Food & Beverages': { supply: 1.0, demand: 1.2 },
    'Industrial': { supply: 1.2, demand: 1.1 },
    'Luxury Goods': { supply: 1.4, demand: 1.0 },
    'Construction': { supply: 1.0, demand: 1.1 },
    'Medical': { supply: 1.3, demand: 0.9 }
  },
  [Location.NorthAmerica]: {
    'Raw Materials': { supply: 1.0, demand: 1.3 },
    'Precious Metals': { supply: 1.1, demand: 1.2 },
    'Textiles': { supply: 0.9, demand: 1.1 },
    'Food & Beverages': { supply: 1.2, demand: 1.0 },
    'Industrial': { supply: 1.3, demand: 1.0 },
    'Luxury Goods': { supply: 1.2, demand: 1.1 },
    'Construction': { supply: 1.1, demand: 1.2 },
    'Medical': { supply: 1.4, demand: 0.8 }
  },
  [Location.SouthAmerica]: {
    'Raw Materials': { supply: 1.6, demand: 0.7 },
    'Precious Metals': { supply: 1.8, demand: 0.6 },
    'Textiles': { supply: 1.3, demand: 0.8 },
    'Food & Beverages': { supply: 1.4, demand: 0.9 },
    'Industrial': { supply: 0.7, demand: 1.4 },
    'Luxury Goods': { supply: 0.6, demand: 1.6 },
    'Construction': { supply: 0.9, demand: 1.3 },
    'Medical': { supply: 0.8, demand: 1.5 }
  }
};

// Calculate supply and demand based on various factors
export function calculateSupplyDemand(
  productId: number,
  location: Location,
  gameDay: number,
  economicEvents: any[] = []
): SupplyDemandFactors {
  const config = getProductConfig(productId);
  if (!config) {
    throw new Error(`Product configuration not found for ID: ${productId}`);
  }

  const locationMod = LOCATION_MODIFIERS[location][config.category] || { supply: 1.0, demand: 1.0 };
  
  // Base supply and demand (can be adjusted per product)
  const baseSupply = config.baseSupply || 100;
  const baseDemand = config.baseDemand || 100;
  
  // Seasonal modifiers (simple sine wave based on game day)
  const seasonalCycle = Math.sin((gameDay / 31) * 2 * Math.PI);
  const seasonalModifier = 1.0 + (seasonalCycle * 0.2); // ±20% seasonal variation
  
  // Economic events modifier
  let economicEventModifier = 1.0;
  economicEvents.forEach(event => {
    if (event.affectedProducts?.includes(productId)) {
      economicEventModifier *= event.priceModifier || 1.0;
    }
  });
  
  return {
    baseSupply,
    baseDemand,
    locationSupplyModifier: locationMod.supply,
    locationDemandModifier: locationMod.demand,
    seasonalModifier,
    economicEventModifier
  };
}

// Generate market prices based on supply and demand
export function calculateMarketPrices(
  productId: number,
  location: Location,
  gameDay: number,
  economicEvents: any[] = [],
  playerReputation: number = 0
): { buyPrice: number; sellPrice: number; supplyDemandRatio: number } {
  const config = getProductConfig(productId);
  if (!config) {
    throw new Error(`Product configuration not found for ID: ${productId}`);
  }

  const factors = calculateSupplyDemand(productId, location, gameDay, economicEvents);
  
  // Calculate actual supply and demand
  const actualSupply = factors.baseSupply * factors.locationSupplyModifier * factors.seasonalModifier;
  const actualDemand = factors.baseDemand * factors.locationDemandModifier * factors.seasonalModifier;
  
  // Supply/demand ratio affects pricing
  const supplyDemandRatio = actualSupply / actualDemand;
  
  // Price modifier based on supply/demand ratio
  // High demand (low ratio) = higher prices
  // High supply (high ratio) = lower prices
  let priceModifier = 1.0;
  if (supplyDemandRatio < 0.5) {
    priceModifier = 1.8; // High demand, low supply
  } else if (supplyDemandRatio < 0.8) {
    priceModifier = 1.4;
  } else if (supplyDemandRatio < 1.2) {
    priceModifier = 1.0; // Balanced
  } else if (supplyDemandRatio < 2.0) {
    priceModifier = 0.7;
  } else {
    priceModifier = 0.4; // High supply, low demand
  }
  
  // Apply economic events
  priceModifier *= factors.economicEventModifier;
  
  // Reputation affects pricing (better reputation = better prices)
  const reputationLevel = getReputationLevel(playerReputation);
  const reputationDiscount = {
    [ReputationLevel.Base]: 1.0,
    [ReputationLevel.Bronze]: 0.95,
    [ReputationLevel.Silver]: 0.90,
    [ReputationLevel.Gold]: 0.85
  }[reputationLevel];
  
  // Calculate final prices
  const buyPrice = Math.round(config.basePrice * priceModifier * reputationDiscount * 100) / 100;
  const sellPrice = Math.round(config.basePrice * priceModifier * 0.8 * 100) / 100; // 20% spread for selling
  
  return { buyPrice, sellPrice, supplyDemandRatio };
}

// Generate complete market for a location based on player reputation
export function generateMarketListings(
  location: Location,
  playerReputation: number,
  gameDay: number,
  economicEvents: any[] = []
): MarketListing[] {
  const unlockedProducts = getUnlockedProducts(playerReputation);
  
  return unlockedProducts.map((productId: number) => {
    const config = getProductConfig(productId);
    if (!config) return null;
    
    const { buyPrice, sellPrice, supplyDemandRatio } = calculateMarketPrices(
      productId,
      location,
      gameDay,
      economicEvents,
      playerReputation
    );
    
    // Calculate available quantity based on supply
    const factors = calculateSupplyDemand(productId, location, gameDay, economicEvents);
    const baseAvailable = Math.floor(factors.baseSupply * factors.locationSupplyModifier * 0.1); // 10% of supply
    const available = Math.max(1, Math.min(50, baseAvailable)); // Between 1-50 units
    
    return {
      productId,
      productName: config.name,
      category: config.category,
      basePrice: config.basePrice,
      buyPrice,
      sellPrice,
      supply: Math.round(factors.baseSupply * factors.locationSupplyModifier),
      demand: Math.round(factors.baseDemand * factors.locationDemandModifier),
      supplyDemandRatio,
      priceModifier: buyPrice / config.basePrice,
      locationModifier: LOCATION_MODIFIERS[location][config.category]?.supply || 1.0,
      available,
      maxAvailable: available
    };
  }).filter((listing): listing is MarketListing => listing !== null);
}

// Get market status description for UI
export function getMarketStatusDescription(supplyDemandRatio: number): {
  status: string;
  color: string;
  description: string;
} {
  if (supplyDemandRatio < 0.5) {
    return {
      status: 'High Demand',
      color: 'text-red-600',
      description: 'Prices are very high due to strong demand'
    };
  } else if (supplyDemandRatio < 0.8) {
    return {
      status: 'Good Demand',
      color: 'text-orange-600',
      description: 'Prices are above average'
    };
  } else if (supplyDemandRatio < 1.2) {
    return {
      status: 'Balanced',
      color: 'text-green-600',
      description: 'Supply and demand are balanced'
    };
  } else if (supplyDemandRatio < 2.0) {
    return {
      status: 'High Supply',
      color: 'text-blue-600',
      description: 'Prices are below average'
    };
  } else {
    return {
      status: 'Oversupply',
      color: 'text-purple-600',
      description: 'Prices are very low due to excess supply'
    };
  }
}

// Calculate shipping costs between locations
export function calculateShippingCost(
  fromLocation: Location,
  toLocation: Location,
  productValue: number
): number {
  if (fromLocation === toLocation) return 0;
  
  // Base shipping rate: 5-10% of product value
  const shippingRate = 0.05 + (Math.random() * 0.05);
  return Math.round(productValue * shippingRate * 100) / 100;
}