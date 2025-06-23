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
  basePrice: number; // Base price for supply/demand calculations
  basePriceRange: [number, number];
  storageUnits: number; // How many storage units this product takes
  unlockLevel: ReputationLevel; // Minimum reputation level required
  category: string; // Market category for supply/demand modifiers
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  quantityRange: [number, number]; // Min/max quantities available in markets
  baseSupply: number; // Base supply level for market calculations
  baseDemand: number; // Base demand level for market calculations
}

export const PRODUCT_CONFIGS: ProductConfig[] = [
  // Base Level Products (Available from start)
  { id: 1, name: "Coffee", basePrice: 85, basePriceRange: [50, 120], storageUnits: 1, unlockLevel: ReputationLevel.Base, category: 'Raw Materials', rarity: 'common', quantityRange: [10, 60], baseSupply: 120, baseDemand: 100 },
  { id: 2, name: "Tea", basePrice: 60, basePriceRange: [30, 90], storageUnits: 1, unlockLevel: ReputationLevel.Base, category: 'Raw Materials', rarity: 'common', quantityRange: [10, 60], baseSupply: 130, baseDemand: 110 },
  { id: 3, name: "Spices", basePrice: 140, basePriceRange: [80, 200], storageUnits: 1, unlockLevel: ReputationLevel.Base, category: 'Raw Materials', rarity: 'uncommon', quantityRange: [10, 60], baseSupply: 80, baseDemand: 120 },
  { id: 8, name: "Cotton", basePrice: 70, basePriceRange: [40, 100], storageUnits: 2, unlockLevel: ReputationLevel.Base, category: 'Textiles', rarity: 'common', quantityRange: [10, 60], baseSupply: 140, baseDemand: 90 },
  { id: 12, name: "Corn", basePrice: 55, basePriceRange: [30, 80], storageUnits: 3, unlockLevel: ReputationLevel.Base, category: 'Food & Beverages', rarity: 'common', quantityRange: [10, 60], baseSupply: 150, baseDemand: 100 },
  { id: 13, name: "Wheat", basePrice: 65, basePriceRange: [40, 90], storageUnits: 3, unlockLevel: ReputationLevel.Base, category: 'Food & Beverages', rarity: 'common', quantityRange: [10, 60], baseSupply: 160, baseDemand: 120 },
  { id: 14, name: "Rice", basePrice: 60, basePriceRange: [35, 85], storageUnits: 2, unlockLevel: ReputationLevel.Base, category: 'Food & Beverages', rarity: 'common', quantityRange: [10, 60], baseSupply: 170, baseDemand: 130 },
  { id: 16, name: "Wood", basePrice: 105, basePriceRange: [60, 150], storageUnits: 5, unlockLevel: ReputationLevel.Base, category: 'Construction', rarity: 'common', quantityRange: [15, 55], baseSupply: 110, baseDemand: 140 },
  { id: 17, name: "Toys", basePrice: 52, basePriceRange: [25, 80], storageUnits: 2, unlockLevel: ReputationLevel.Base, category: 'Luxury Goods', rarity: 'common', quantityRange: [20, 80], baseSupply: 90, baseDemand: 110 },
  { id: 18, name: "Food", basePrice: 40, basePriceRange: [20, 60], storageUnits: 1, unlockLevel: ReputationLevel.Base, category: 'Food & Beverages', rarity: 'common', quantityRange: [20, 80], baseSupply: 180, baseDemand: 150 },
  { id: 26, name: "Beer", basePrice: 27, basePriceRange: [15, 40], storageUnits: 1, unlockLevel: ReputationLevel.Base, category: 'Food & Beverages', rarity: 'common', quantityRange: [20, 80], baseSupply: 200, baseDemand: 180 },

  // Bronze Level Products (Reputation 25+)
  { id: 7, name: "Silk", basePrice: 250, basePriceRange: [150, 350], storageUnits: 1, unlockLevel: ReputationLevel.Bronze, category: 'Textiles', rarity: 'uncommon', quantityRange: [10, 60], baseSupply: 60, baseDemand: 90 },
  { id: 9, name: "Copper", basePrice: 135, basePriceRange: [80, 190], storageUnits: 8, unlockLevel: ReputationLevel.Bronze, category: 'Raw Materials', rarity: 'uncommon', quantityRange: [10, 60], baseSupply: 100, baseDemand: 110 },
  { id: 15, name: "Electronics", basePrice: 850, basePriceRange: [500, 1200], storageUnits: 3, unlockLevel: ReputationLevel.Bronze, category: 'Industrial', rarity: 'uncommon', quantityRange: [5, 25], baseSupply: 50, baseDemand: 120 },
  { id: 20, name: "Ceramics", basePrice: 175, basePriceRange: [100, 250], storageUnits: 4, unlockLevel: ReputationLevel.Bronze, category: 'Construction', rarity: 'uncommon', quantityRange: [15, 55], baseSupply: 80, baseDemand: 100 },
  { id: 21, name: "Wool", basePrice: 82, basePriceRange: [45, 120], storageUnits: 2, unlockLevel: ReputationLevel.Bronze, category: 'Textiles', rarity: 'uncommon', quantityRange: [10, 60], baseSupply: 120, baseDemand: 80 },
  { id: 22, name: "Plastics", basePrice: 60, basePriceRange: [30, 90], storageUnits: 4, unlockLevel: ReputationLevel.Bronze, category: 'Industrial', rarity: 'uncommon', quantityRange: [15, 55], baseSupply: 110, baseDemand: 100 },
  { id: 23, name: "Clothing", basePrice: 100, basePriceRange: [50, 150], storageUnits: 2, unlockLevel: ReputationLevel.Bronze, category: 'Luxury Goods', rarity: 'uncommon', quantityRange: [20, 80], baseSupply: 90, baseDemand: 110 },
  { id: 24, name: "Rubber", basePrice: 125, basePriceRange: [70, 180], storageUnits: 6, unlockLevel: ReputationLevel.Bronze, category: 'Industrial', rarity: 'uncommon', quantityRange: [15, 55], baseSupply: 95, baseDemand: 105 },
  { id: 27, name: "Wine", basePrice: 190, basePriceRange: [80, 300], storageUnits: 1, unlockLevel: ReputationLevel.Bronze, category: 'Food & Beverages', rarity: 'uncommon', quantityRange: [5, 25], baseSupply: 70, baseDemand: 100 },

  // Silver Level Products (Reputation 51+)
  { id: 5, name: "Silver", basePrice: 600, basePriceRange: [400, 800], storageUnits: 3, unlockLevel: ReputationLevel.Silver, category: 'Precious Metals', rarity: 'rare', quantityRange: [3, 18], baseSupply: 40, baseDemand: 80 },
  { id: 10, name: "Oil", basePrice: 500, basePriceRange: [300, 700], storageUnits: 10, unlockLevel: ReputationLevel.Silver, category: 'Raw Materials', rarity: 'rare', quantityRange: [5, 25], baseSupply: 60, baseDemand: 120 },
  { id: 11, name: "Gas", basePrice: 325, basePriceRange: [200, 450], storageUnits: 15, unlockLevel: ReputationLevel.Silver, category: 'Raw Materials', rarity: 'rare', quantityRange: [10, 60], baseSupply: 80, baseDemand: 110 },
  { id: 19, name: "Steel", basePrice: 350, basePriceRange: [200, 500], storageUnits: 12, unlockLevel: ReputationLevel.Silver, category: 'Industrial', rarity: 'rare', quantityRange: [15, 55], baseSupply: 70, baseDemand: 130 },
  { id: 25, name: "Medicine", basePrice: 275, basePriceRange: [150, 400], storageUnits: 1, unlockLevel: ReputationLevel.Silver, category: 'Medical', rarity: 'rare', quantityRange: [5, 25], baseSupply: 50, baseDemand: 140 },
  { id: 28, name: "Champagne", basePrice: 400, basePriceRange: [200, 600], storageUnits: 1, unlockLevel: ReputationLevel.Silver, category: 'Food & Beverages', rarity: 'rare', quantityRange: [3, 18], baseSupply: 30, baseDemand: 70 },
  { id: 29, name: "Spirits", basePrice: 235, basePriceRange: [120, 350], storageUnits: 1, unlockLevel: ReputationLevel.Silver, category: 'Food & Beverages', rarity: 'rare', quantityRange: [3, 18], baseSupply: 50, baseDemand: 85 },

  // Gold Level Products (Reputation 76+)
  { id: 4, name: "Gold", basePrice: 1150, basePriceRange: [800, 1500], storageUnits: 2, unlockLevel: ReputationLevel.Gold, category: 'Precious Metals', rarity: 'legendary', quantityRange: [3, 18], baseSupply: 20, baseDemand: 60 },
  { id: 6, name: "Diamonds", basePrice: 3500, basePriceRange: [2000, 5000], storageUnits: 1, unlockLevel: ReputationLevel.Gold, category: 'Precious Metals', rarity: 'legendary', quantityRange: [1, 11], baseSupply: 10, baseDemand: 40 },
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

export function getUnlockedProducts(playerReputation: number): number[] {
  const reputationLevel = getReputationLevel(playerReputation);
  
  return PRODUCT_CONFIGS
    .filter(config => {
      switch (reputationLevel) {
        case ReputationLevel.Base:
          return config.unlockLevel === ReputationLevel.Base;
        case ReputationLevel.Bronze:
          return config.unlockLevel === ReputationLevel.Base || config.unlockLevel === ReputationLevel.Bronze;
        case ReputationLevel.Silver:
          return config.unlockLevel === ReputationLevel.Base || 
                 config.unlockLevel === ReputationLevel.Bronze || 
                 config.unlockLevel === ReputationLevel.Silver;
        case ReputationLevel.Gold:
          return true; // All products unlocked
        default:
          return config.unlockLevel === ReputationLevel.Base;
      }
    })
    .map(config => config.id);
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