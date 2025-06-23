/**
 * Global Trade Tycoon Game Configuration
 * Central configuration for game constants to ensure consistency across the application
 */

export const GAME_CONFIG = {
  // Core game settings
  GAME_DURATION_DAYS: 31,
  STARTING_LOAN: 2000,
  MAX_LOAN_AMOUNT: 10000,
  LOAN_INTEREST_RATE: 0.05, // 5% per travel
  
  // Product settings
  TOTAL_PRODUCTS: 29,
  
  // Location settings
  TOTAL_LOCATIONS: 7,
  
  // Random event probabilities
  CASH_LOSS_PROBABILITY: 0.01, // 1 in 100
  INVENTORY_LOSS_PROBABILITY: 0.005, // 1 in 200
  
  // Risk thresholds
  MAX_CASH_LOSS_PERCENTAGE: 0.75, // Up to 75%
  MAX_INVENTORY_LOSS_PERCENTAGE: 0.8, // Up to 80%
  
  // UI settings
  AUTO_SAVE_ENABLED: true,
  
  // Leaderboard settings
  LEADERBOARD_RESET_DAY: 1, // Monday = 1 (0 = Sunday)
  LEADERBOARD_RESET_HOUR: 0, // Midnight
  LEADERBOARD_RESET_MINUTE: 1,
} as const;

/**
 * Game duration in days - use this constant throughout the application
 */
export const GAME_DURATION = GAME_CONFIG.GAME_DURATION_DAYS;