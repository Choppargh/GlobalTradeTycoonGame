/**
 * Product Configuration System
 * Central configuration for all product attributes, storage, and unlock requirements
 */

export enum ReputationLevel {
  Base = "base",
  Bronze = "bronze", 
  Silver = "silver",
  Gold = "gold"
}

export interface ProductConfig {
  id: number;
  name: string;
  basePriceRange: [number, number];
  storageUnits: number; // How many storage units this product takes
  unlockLevel: ReputationLevel; // Minimum reputation level required
  category: 'agricultural' | 'luxury' | 'industrial' | 'consumer' | 'beverages' | 'textiles' | 'precious' | 'energy';
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  quantityRange: [number, number]; // Min/max quantities available in markets
}

export const PRODUCT_CONFIGS: ProductConfig[] = [
  // Base Level Products (Available from start)
  { id: 1, name: "Coffee", basePriceRange: [50, 120], storageUnits: 1, unlockLevel: ReputationLevel.Base, category: 'agricultural', rarity: 'common', quantityRange: [10, 60] },
  { id: 2, name: "Tea", basePriceRange: [30, 90], storageUnits: 1, unlockLevel: ReputationLevel.Base, category: 'agricultural', rarity: 'common', quantityRange: [10, 60] },
  { id: 3, name: "Spices", basePriceRange: [80, 200], storageUnits: 1, unlockLevel: ReputationLevel.Base, category: 'agricultural', rarity: 'uncommon', quantityRange: [10, 60] },
  { id: 8, name: "Cotton", basePriceRange: [40, 100], storageUnits: 2, unlockLevel: ReputationLevel.Base, category: 'textiles', rarity: 'common', quantityRange: [10, 60] },
  { id: 12, name: "Corn", basePriceRange: [30, 80], storageUnits: 3, unlockLevel: ReputationLevel.Base, category: 'agricultural', rarity: 'common', quantityRange: [10, 60] },
  { id: 13, name: "Wheat", basePriceRange: [40, 90], storageUnits: 3, unlockLevel: ReputationLevel.Base, category: 'agricultural', rarity: 'common', quantityRange: [10, 60] },
  { id: 14, name: "Rice", basePriceRange: [35, 85], storageUnits: 2, unlockLevel: ReputationLevel.Base, category: 'agricultural', rarity: 'common', quantityRange: [10, 60] },
  { id: 16, name: "Wood", basePriceRange: [60, 150], storageUnits: 5, unlockLevel: ReputationLevel.Base, category: 'industrial', rarity: 'common', quantityRange: [15, 55] },
  { id: 17, name: "Toys", basePriceRange: [25, 80], storageUnits: 2, unlockLevel: ReputationLevel.Base, category: 'consumer', rarity: 'common', quantityRange: [20, 80] },
  { id: 18, name: "Food", basePriceRange: [20, 60], storageUnits: 1, unlockLevel: ReputationLevel.Base, category: 'consumer', rarity: 'common', quantityRange: [20, 80] },
  { id: 26, name: "Beer", basePriceRange: [15, 40], storageUnits: 1, unlockLevel: ReputationLevel.Base, category: 'beverages', rarity: 'common', quantityRange: [20, 80] },

  // Bronze Level Products (Reputation 25+)
  { id: 7, name: "Silk", basePriceRange: [150, 350], storageUnits: 1, unlockLevel: ReputationLevel.Bronze, category: 'textiles', rarity: 'uncommon', quantityRange: [10, 60] },
  { id: 9, name: "Copper", basePriceRange: [80, 190], storageUnits: 8, unlockLevel: ReputationLevel.Bronze, category: 'industrial', rarity: 'uncommon', quantityRange: [10, 60] },
  { id: 15, name: "Electronics", basePriceRange: [500, 1200], storageUnits: 3, unlockLevel: ReputationLevel.Bronze, category: 'industrial', rarity: 'uncommon', quantityRange: [5, 25] },
  { id: 20, name: "Ceramics", basePriceRange: [100, 250], storageUnits: 4, unlockLevel: ReputationLevel.Bronze, category: 'industrial', rarity: 'uncommon', quantityRange: [15, 55] },
  { id: 21, name: "Wool", basePriceRange: [45, 120], storageUnits: 2, unlockLevel: ReputationLevel.Bronze, category: 'textiles', rarity: 'uncommon', quantityRange: [10, 60] },
  { id: 22, name: "Plastics", basePriceRange: [30, 90], storageUnits: 4, unlockLevel: ReputationLevel.Bronze, category: 'industrial', rarity: 'uncommon', quantityRange: [15, 55] },
  { id: 23, name: "Clothing", basePriceRange: [50, 150], storageUnits: 2, unlockLevel: ReputationLevel.Bronze, category: 'consumer', rarity: 'uncommon', quantityRange: [20, 80] },
  { id: 24, name: "Rubber", basePriceRange: [70, 180], storageUnits: 6, unlockLevel: ReputationLevel.Bronze, category: 'industrial', rarity: 'uncommon', quantityRange: [15, 55] },
  { id: 27, name: "Wine", basePriceRange: [80, 300], storageUnits: 1, unlockLevel: ReputationLevel.Bronze, category: 'beverages', rarity: 'uncommon', quantityRange: [5, 25] },

  // Silver Level Products (Reputation 51+)
  { id: 5, name: "Silver", basePriceRange: [400, 800], storageUnits: 3, unlockLevel: ReputationLevel.Silver, category: 'precious', rarity: 'rare', quantityRange: [3, 18] },
  { id: 10, name: "Oil", basePriceRange: [300, 700], storageUnits: 10, unlockLevel: ReputationLevel.Silver, category: 'energy', rarity: 'rare', quantityRange: [5, 25] },
  { id: 11, name: "Gas", basePriceRange: [200, 450], storageUnits: 15, unlockLevel: ReputationLevel.Silver, category: 'energy', rarity: 'rare', quantityRange: [10, 60] },
  { id: 19, name: "Steel", basePriceRange: [200, 500], storageUnits: 12, unlockLevel: ReputationLevel.Silver, category: 'industrial', rarity: 'rare', quantityRange: [15, 55] },
  { id: 25, name: "Medicine", basePriceRange: [150, 400], storageUnits: 1, unlockLevel: ReputationLevel.Silver, category: 'consumer', rarity: 'rare', quantityRange: [5, 25] },
  { id: 28, name: "Champagne", basePriceRange: [200, 600], storageUnits: 1, unlockLevel: ReputationLevel.Silver, category: 'beverages', rarity: 'rare', quantityRange: [3, 18] },
  { id: 29, name: "Spirits", basePriceRange: [120, 350], storageUnits: 1, unlockLevel: ReputationLevel.Silver, category: 'beverages', rarity: 'rare', quantityRange: [3, 18] },

  // Gold Level Products (Reputation 76+)
  { id: 4, name: "Gold", basePriceRange: [800, 1500], storageUnits: 2, unlockLevel: ReputationLevel.Gold, category: 'precious', rarity: 'legendary', quantityRange: [3, 18] },
  { id: 6, name: "Diamonds", basePriceRange: [2000, 5000], storageUnits: 1, unlockLevel: ReputationLevel.Gold, category: 'precious', rarity: 'legendary', quantityRange: [1, 11] },
];

// Storage and Infrastructure Configuration
export const STORAGE_CONFIG = {
  PLAYER_CAPACITY: 10, // Units player can carry
  OFFICE_CAPACITY: 20, // Units office can store
  WAREHOUSE_CAPACITY: 100, // Units warehouse can store
  SHIPPING_FEE_MIN: 0.05, // 5% minimum shipping fee
  SHIPPING_FEE_MAX: 0.10, // 10% maximum shipping fee
} as const;

// Helper functions
export function getProductConfig(productId: number): ProductConfig | undefined {
  return PRODUCT_CONFIGS.find(config => config.id === productId);
}

export function getProductsByUnlockLevel(level: ReputationLevel): ProductConfig[] {
  const levelOrder = [ReputationLevel.Base, ReputationLevel.Bronze, ReputationLevel.Silver, ReputationLevel.Gold];
  const maxLevelIndex = levelOrder.indexOf(level);
  
  return PRODUCT_CONFIGS.filter(config => {
    const configLevelIndex = levelOrder.indexOf(config.unlockLevel);
    return configLevelIndex <= maxLevelIndex;
  });
}

export function getProductsByCategory(category: string): ProductConfig[] {
  return PRODUCT_CONFIGS.filter(config => config.category === category);
}

export function calculateShippingFee(basePrice: number): number {
  const feeRate = Math.random() * (STORAGE_CONFIG.SHIPPING_FEE_MAX - STORAGE_CONFIG.SHIPPING_FEE_MIN) + STORAGE_CONFIG.SHIPPING_FEE_MIN;
  return Math.round(basePrice * feeRate * 100) / 100;
}

export function getReputationLevel(score: number): ReputationLevel {
  if (score >= 76) return ReputationLevel.Gold;
  if (score >= 51) return ReputationLevel.Silver;
  if (score >= 25) return ReputationLevel.Bronze;
  return ReputationLevel.Base;
}