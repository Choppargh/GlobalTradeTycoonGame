import { Location, ProductListing, PRODUCTS } from "@shared/schema";

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
