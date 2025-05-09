import { Location, ProductListing, PRODUCTS, InventoryItem } from "@shared/schema";

// Base price ranges for products (min, max)
const PRODUCT_PRICE_RANGES: Record<number, [number, number]> = {
  1: [50, 120],     // Coffee
  2: [30, 90],      // Tea  
  3: [80, 200],     // Spices
  4: [800, 1500],   // Gold
  5: [400, 800],    // Silver
  6: [2000, 5000],  // Diamonds
  7: [150, 350],    // Silk
  8: [40, 100],     // Cotton
  9: [80, 190],     // Copper
  10: [300, 700],   // Oil
  11: [200, 450],   // Gas
  12: [30, 80],     // Corn
  13: [40, 90],     // Wheat
  14: [35, 85],     // Rice
  15: [500, 1200]   // Electronics
};

// Location price modifiers (makes certain products cheaper/more expensive in different regions)
const LOCATION_PRICE_MODIFIERS: Record<Location, Record<number, number>> = {
  [Location.Africa]: {
    1: 0.8,   // Coffee cheaper in Africa
    3: 0.85,  // Spices cheaper
    6: 0.9,   // Diamonds cheaper
    10: 1.2,  // Oil more expensive
    14: 1.1   // Rice more expensive
  },
  [Location.Antarctica]: {
    // Everything more expensive in Antarctica due to scarcity
    1: 1.5,
    2: 1.5,
    3: 1.5,
    4: 1.3, 
    5: 1.3,
    6: 1.3,
    7: 1.5,
    8: 1.5,
    9: 1.3,
    10: 1.5,
    11: 1.5,
    12: 1.6,
    13: 1.6,
    14: 1.6,
    15: 1.4
  },
  [Location.Asia]: {
    7: 0.75,  // Silk cheaper in Asia
    8: 0.8,   // Cotton cheaper
    14: 0.7,  // Rice cheaper
    15: 0.85  // Electronics cheaper
  },
  [Location.Europe]: {
    4: 1.1,   // Gold more expensive
    5: 1.1,   // Silver more expensive
    10: 1.2,  // Oil more expensive
    11: 1.15  // Gas more expensive
  },
  [Location.NorthAmerica]: {
    12: 0.8,  // Corn cheaper in North America
    13: 0.85, // Wheat cheaper
    15: 0.9   // Electronics cheaper
  },
  [Location.Oceania]: {
    2: 0.9,   // Tea cheaper in Oceania
    9: 0.85,  // Copper cheaper
    10: 1.1   // Oil more expensive
  },
  [Location.SouthAmerica]: {
    1: 0.75,  // Coffee cheaper in South America
    3: 0.9,   // Spices cheaper
    12: 0.9   // Corn cheaper
  }
};

// Generate a random price within a range
function getRandomPrice(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

// Generate a random demand multiplier (1.01 to 1.25)
function getRandomDemandMultiplier(): number {
  return 1 + (Math.random() * 0.24 + 0.01);
}

// Generate a random quantity available
function getRandomQuantity(productId: number): number {
  // Rarer items have lower quantities
  if (productId === 6) { // Diamonds
    return Math.floor(Math.random() * 10) + 1;
  } else if ([4, 5, 10, 15].includes(productId)) { // Gold, Silver, Oil, Electronics
    return Math.floor(Math.random() * 20) + 5;
  } else {
    return Math.floor(Math.random() * 50) + 10;
  }
}

// Generate market listings for a location
export function generateMarketListings(location: Location): ProductListing[] {
  // Determine how many products to show (3-12)
  const numProducts = Math.floor(Math.random() * 10) + 3;
  
  // Choose random products
  const productIndices = new Set<number>();
  while (productIndices.size < numProducts) {
    const randomIndex = Math.floor(Math.random() * PRODUCTS.length);
    productIndices.add(PRODUCTS[randomIndex].id);
  }
  
  // Generate listings for the selected products
  return Array.from(productIndices).map(productId => {
    const [minPrice, maxPrice] = PRODUCT_PRICE_RANGES[productId];
    
    // Apply location modifier if exists
    const modifier = LOCATION_PRICE_MODIFIERS[location][productId] || 1.0;
    
    const basePrice = getRandomPrice(minPrice, maxPrice);
    const marketPrice = Math.round(basePrice * modifier * 100) / 100;
    
    return {
      productId,
      name: PRODUCTS.find(p => p.id === productId)?.name || "",
      marketPrice,
      demandMultiplier: getRandomDemandMultiplier(),
      available: getRandomQuantity(productId)
    };
  });
}

// Calculate total net worth
export function calculateNetWorth(cash: number, bankBalance: number, inventory: any[], loanAmount: number): number {
  const inventoryValue = inventory.reduce(
    (total, item) => total + (item.quantity * item.purchasePrice),
    0
  );
  
  return cash + bankBalance + inventoryValue - loanAmount;
}

// Random events system
export type GameEvent = {
  id: string;
  title: string;
  description: string;
  type: 'price_change' | 'inventory_boost' | 'cash_bonus' | 'market_crash' | 'market_boom';
  affectedProducts?: number[];  // Product IDs affected
  modifier?: number;  // Price multiplier or quantity modifier
  cashAmount?: number; // For cash bonus events
  location?: Location; // If the event is location-specific
}

// Define possible random events
export const GAME_EVENTS: GameEvent[] = [
  {
    id: 'coffee_shortage',
    title: 'Coffee Shortage',
    description: 'A drought in major coffee-producing regions has caused coffee prices to soar worldwide!',
    type: 'price_change',
    affectedProducts: [1], // Coffee
    modifier: 1.5 // 50% price increase
  },
  {
    id: 'tea_surplus',
    title: 'Tea Surplus',
    description: 'Exceptional harvest conditions have led to a glut of tea supply, driving prices down.',
    type: 'price_change',
    affectedProducts: [2], // Tea
    modifier: 0.7 // 30% price decrease
  },
  {
    id: 'oil_crisis',
    title: 'Oil Crisis',
    description: 'Political tensions have disrupted oil supply chains, causing a dramatic price spike!',
    type: 'price_change',
    affectedProducts: [10], // Oil
    modifier: 1.8 // 80% price increase
  },
  {
    id: 'tech_innovation',
    title: 'Technology Breakthrough',
    description: 'A new manufacturing process has made electronics cheaper to produce.',
    type: 'price_change',
    affectedProducts: [15], // Electronics
    modifier: 0.6 // 40% price decrease
  },
  {
    id: 'precious_metals_boom',
    title: 'Precious Metals Boom',
    description: 'Investor panic has caused a run on precious metals!',
    type: 'price_change',
    affectedProducts: [4, 5], // Gold, Silver
    modifier: 1.4 // 40% price increase
  },
  {
    id: 'agriculture_subsidy',
    title: 'Agricultural Subsidies',
    description: 'Government subsidies have temporarily lowered prices on agricultural goods.',
    type: 'price_change',
    affectedProducts: [12, 13, 14], // Corn, Wheat, Rice
    modifier: 0.75 // 25% price decrease
  },
  {
    id: 'diamond_discovery',
    title: 'Major Diamond Discovery',
    description: 'A significant new diamond deposit has been discovered, increasing global supply.',
    type: 'price_change',
    affectedProducts: [6], // Diamonds
    modifier: 0.8 // 20% price decrease
  },
  {
    id: 'shipping_disruption',
    title: 'Shipping Disruption',
    description: 'A major shipping lane is blocked, causing price increases across multiple goods.',
    type: 'price_change',
    affectedProducts: [1, 3, 7, 8, 15], // Coffee, Spices, Silk, Cotton, Electronics
    modifier: 1.3 // 30% price increase
  },
  {
    id: 'market_crash',
    title: 'Market Crash',
    description: 'A sudden financial panic has caused markets to crash! All prices have dropped significantly.',
    type: 'market_crash',
    modifier: 0.6 // 40% decrease on all products
  },
  {
    id: 'market_boom',
    title: 'Market Boom',
    description: 'Optimistic economic forecasts have driven up prices across all markets!',
    type: 'market_boom',
    modifier: 1.35 // 35% increase on all products
  },
  {
    id: 'inventory_windfall',
    title: 'Unexpected Inventory',
    description: 'You found additional inventory you didn\'t know you had!',
    type: 'inventory_boost',
    modifier: 1.2 // 20% increase in all inventory quantities
  },
  {
    id: 'cash_finding',
    title: 'Found Money',
    description: 'You found a hidden envelope with cash inside!',
    type: 'cash_bonus',
    cashAmount: 500 // $500 bonus
  },
  {
    id: 'asia_textile_boom',
    title: 'Asian Textile Boom',
    description: 'High demand for textiles in Asia has driven up silk and cotton prices.',
    type: 'price_change',
    affectedProducts: [7, 8], // Silk, Cotton
    modifier: 1.4, // 40% price increase
    location: Location.Asia
  },
  {
    id: 'europe_energy_crisis',
    title: 'European Energy Crisis',
    description: 'An energy shortage in Europe has caused gas prices to skyrocket.',
    type: 'price_change',
    affectedProducts: [11], // Gas
    modifier: 1.7, // 70% price increase
    location: Location.Europe
  }
];

// Generate a random event
export function generateRandomEvent(currentLocation: Location, daysRemaining: number = 0): GameEvent | null {
  // No events on the last day
  if (daysRemaining <= 1) {
    return null;
  }
  
  // 30% chance of a random event happening (more frequent for testing)
  if (Math.random() > 0.3) return null;
  
  // Filter events by location if needed
  const eligibleEvents = GAME_EVENTS.filter(event => !event.location || event.location === currentLocation);
  
  // Choose a random event
  const randomIndex = Math.floor(Math.random() * eligibleEvents.length);
  return eligibleEvents[randomIndex];
}

// Apply a random event to market listings
export function applyEventToMarket(
  event: GameEvent, 
  marketListings: ProductListing[],
  oldMarketListings?: ProductListing[]
): { listings: ProductListing[], priceChanges: Record<number, 'increase' | 'decrease' | null> } {
  let updatedListings = [...marketListings];
  let priceChanges: Record<number, 'increase' | 'decrease' | null> = {};
  
  // Initialize all products to null (no change)
  marketListings.forEach(listing => {
    priceChanges[listing.productId] = null;
  });
  
  switch (event.type) {
    case 'price_change':
      if (event.affectedProducts && event.modifier) {
        updatedListings = updatedListings.map(listing => {
          if (event.affectedProducts?.includes(listing.productId)) {
            // If we have old listings to compare with
            if (oldMarketListings) {
              const oldListing = oldMarketListings.find(old => old.productId === listing.productId);
              if (oldListing) {
                const oldPrice = oldListing.marketPrice;
                const newPrice = Math.round(listing.marketPrice * event.modifier! * 100) / 100;
                priceChanges[listing.productId] = newPrice > oldPrice ? 'increase' : 'decrease';
              }
            } else {
              // If no old listings, just determine based on modifier
              priceChanges[listing.productId] = event.modifier && event.modifier > 1 ? 'increase' : 'decrease';
            }
            
            return {
              ...listing,
              marketPrice: Math.round(listing.marketPrice * event.modifier! * 100) / 100
            };
          }
          return listing;
        });
      }
      break;
      
    case 'market_crash':
    case 'market_boom':
      if (event.modifier) {
        updatedListings = updatedListings.map(listing => {
          // Determine price change direction
          if (oldMarketListings) {
            const oldListing = oldMarketListings.find(old => old.productId === listing.productId);
            if (oldListing) {
              const oldPrice = oldListing.marketPrice;
              const newPrice = Math.round(listing.marketPrice * event.modifier! * 100) / 100;
              priceChanges[listing.productId] = newPrice > oldPrice ? 'increase' : 'decrease';
            }
          } else {
            priceChanges[listing.productId] = event.type === 'market_boom' ? 'increase' : 'decrease';
          }
          
          return {
            ...listing,
            marketPrice: Math.round(listing.marketPrice * event.modifier! * 100) / 100
          };
        });
      }
      break;
      
    default:
      break;
  }
  
  return { listings: updatedListings, priceChanges };
}

// Apply inventory boost event
export function applyEventToInventory(event: GameEvent, inventory: InventoryItem[]): InventoryItem[] {
  if (event.type !== 'inventory_boost' || !event.modifier) return inventory;
  
  return inventory.map(item => ({
    ...item,
    quantity: Math.ceil(item.quantity * event.modifier!)
  }));
}
