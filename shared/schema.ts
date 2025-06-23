import { pgTable, text, serial, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema with OAuth support
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email"),
  password: text("password"), // Optional for OAuth users
  provider: text("provider").default("local"), // 'local', 'google', 'facebook', 'twitter'
  providerId: text("provider_id"), // OAuth provider's user ID
  displayName: text("display_name"),
  avatar: text("avatar"),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  provider: true,
  providerId: true,
  displayName: true,
  avatar: true,
});

// New schema for game scores
export const scores = pgTable("scores", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  score: real("score").notNull(),
  days: integer("days").notNull(),
  endNetWorth: real("end_net_worth").notNull(),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});

export const insertScoreSchema = createInsertSchema(scores).pick({
  userId: true,
  score: true,
  days: true,
  endNetWorth: true,
});

// Phase 2: New tables for expanded features

// Player infrastructure (offices and warehouses)
export const playerInfrastructure = pgTable("player_infrastructure", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  location: text("location").notNull(), // Location enum as string
  type: text("type").notNull(), // "office" or "warehouse"
  level: integer("level").notNull().default(1), // 1=Basic, 2=Branch, 3=HQ
  buildDate: text("build_date").notNull().default(new Date().toISOString()),
  maintenanceCost: real("maintenance_cost").notNull().default(0), // Daily cost
});

// Staff management
export const playerStaff = pgTable("player_staff", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  location: text("location").notNull(),
  staffType: text("staff_type").notNull(), // "trader", "scout", "negotiator", "banker"
  name: text("name").notNull(), // Generated staff name
  level: integer("level").notNull().default(1), // Staff quality level
  salary: real("salary").notNull(), // Daily salary
  hireDate: text("hire_date").notNull().default(new Date().toISOString()),
  performance: real("performance").notNull().default(1.0), // Performance multiplier
});

// Regional reputation system
export const playerReputation = pgTable("player_reputation", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  location: text("location").notNull(),
  score: integer("score").notNull().default(0), // 0-100
  lastActivity: text("last_activity").notNull().default(new Date().toISOString()),
  totalTrades: integer("total_trades").notNull().default(0),
  contractsCompleted: integer("contracts_completed").notNull().default(0),
  contractsFailed: integer("contracts_failed").notNull().default(0),
});

// Contract system
export const contracts = pgTable("contracts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  sourceLocation: text("source_location").notNull(),
  destinationLocation: text("destination_location").notNull(),
  requiredProduct: integer("required_product").notNull(), // Product ID
  requiredQuantity: integer("required_quantity").notNull(),
  reward: real("reward").notNull(),
  reputationReward: integer("reputation_reward").notNull().default(5),
  deadline: text("deadline").notNull(), // ISO date string
  status: text("status").notNull().default("active"), // "active", "completed", "failed", "expired"
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
  completedAt: text("completed_at"),
});

// Player base selection
export const playerSettings = pgTable("player_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  homeBase: text("home_base").notNull(), // Selected starting location
  gameStartDate: text("game_start_date").notNull().default(new Date().toISOString()),
  currentDay: integer("current_day").notNull().default(1),
  globalReputation: real("global_reputation").notNull().default(0), // Average of all regional reps
  loanCap: real("loan_cap").notNull().default(10000), // Current loan limit
  interestRate: real("interest_rate").notNull().default(0.05), // Current daily interest rate
});

// Player warehouse and office storage
export const playerStorage = pgTable("player_storage", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  location: text("location").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  storageType: text("storage_type").notNull(), // "office" or "warehouse"
  purchasePrice: real("purchase_price").notNull(),
  storedAt: text("stored_at").notNull().default(new Date().toISOString()),
});

// Insert schemas for new tables
export const insertPlayerInfrastructureSchema = createInsertSchema(playerInfrastructure).pick({
  userId: true,
  location: true,
  type: true,
  level: true,
  maintenanceCost: true,
});

export const insertPlayerStaffSchema = createInsertSchema(playerStaff).pick({
  userId: true,
  location: true,
  staffType: true,
  name: true,
  level: true,
  salary: true,
  performance: true,
});

export const insertPlayerReputationSchema = createInsertSchema(playerReputation).pick({
  userId: true,
  location: true,
  score: true,
  totalTrades: true,
  contractsCompleted: true,
  contractsFailed: true,
});

export const insertContractSchema = createInsertSchema(contracts).pick({
  userId: true,
  sourceLocation: true,
  destinationLocation: true,
  requiredProduct: true,
  requiredQuantity: true,
  reward: true,
  reputationReward: true,
  deadline: true,
  status: true,
});

export const insertPlayerSettingsSchema = createInsertSchema(playerSettings).pick({
  userId: true,
  homeBase: true,
  currentDay: true,
  globalReputation: true,
  loanCap: true,
  interestRate: true,
});

export const insertPlayerStorageSchema = createInsertSchema(playerStorage).pick({
  userId: true,
  location: true,
  productId: true,
  quantity: true,
  storageType: true,
  purchasePrice: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertScore = z.infer<typeof insertScoreSchema>;
export type Score = typeof scores.$inferSelect;

export type InsertPlayerInfrastructure = z.infer<typeof insertPlayerInfrastructureSchema>;
export type PlayerInfrastructure = typeof playerInfrastructure.$inferSelect;

export type InsertPlayerStaff = z.infer<typeof insertPlayerStaffSchema>;
export type PlayerStaff = typeof playerStaff.$inferSelect;

export type InsertPlayerReputation = z.infer<typeof insertPlayerReputationSchema>;
export type PlayerReputation = typeof playerReputation.$inferSelect;

export type InsertContract = z.infer<typeof insertContractSchema>;
export type Contract = typeof contracts.$inferSelect;

export type InsertPlayerSettings = z.infer<typeof insertPlayerSettingsSchema>;
export type PlayerSettings = typeof playerSettings.$inferSelect;

export type InsertPlayerStorage = z.infer<typeof insertPlayerStorageSchema>;
export type PlayerStorage = typeof playerStorage.$inferSelect;

// Game types
export enum Location {
  Africa = "Africa",
  Antarctica = "Antarctica", 
  Asia = "Asia",
  Europe = "Europe",
  NorthAmerica = "North America",
  Oceania = "Oceania",
  SouthAmerica = "South America"
}

// Phase 2 enums and constants
export enum InfrastructureType {
  Office = "office",
  Warehouse = "warehouse"
}

export enum StaffType {
  TraderAssistant = "trader",
  MarketScout = "scout", 
  ContractNegotiator = "negotiator",
  BankLiaison = "banker"
}

export enum ReputationTier {
  Poor = "poor",
  Bronze = "bronze",
  Silver = "silver", 
  Gold = "gold"
}

export enum ContractStatus {
  Active = "active",
  Completed = "completed",
  Failed = "failed",
  Expired = "expired"
}

// Phase 2 game constants
export const REPUTATION_TIERS = {
  POOR: { min: 0, max: 24, medal: "", name: "Poor" },
  BRONZE: { min: 25, max: 50, medal: "🥉", name: "Bronze" },
  SILVER: { min: 51, max: 75, medal: "🥈", name: "Silver" },
  GOLD: { min: 76, max: 100, medal: "🥇", name: "Gold" }
};

export const LOAN_TIERS = {
  POOR: { maxLoan: 10000, interestRange: [0.05, 0.05] },
  BRONZE: { maxLoan: 25000, interestRange: [0.035, 0.045] },
  SILVER: { maxLoan: 50000, interestRange: [0.025, 0.035] },
  GOLD: { maxLoan: 100000, interestRange: [0.015, 0.02] }
};

export const STAFF_TYPES = {
  trader: { name: "Trader Assistant", benefit: "Boosts sale value by up to 20%", baseSalary: 50 },
  scout: { name: "Market Scout", benefit: "Provides early market warnings", baseSalary: 40 },
  negotiator: { name: "Contract Negotiator", benefit: "Improves contract rewards", baseSalary: 60 },
  banker: { name: "Bank Liaison", benefit: "Reduces daily loan interest", baseSalary: 45 }
};

export const INFRASTRUCTURE_COSTS = {
  office: { build: [1000, 2500, 5000], maintenance: [10, 25, 50] }, // Basic, Branch, HQ
  warehouse: { build: [1500, 3500, 7000], maintenance: [15, 35, 70] }
};

export const BASE_BONUSES = {
  [Location.Africa]: { bonus: "food", discount: 0.05 },
  [Location.Asia]: { bonus: "tech", discount: 0.05 },
  [Location.Europe]: { bonus: "luxury", discount: 0.05 },
  [Location.NorthAmerica]: { bonus: "finance", discount: 0.05 },
  [Location.SouthAmerica]: { bonus: "resources", discount: 0.05 },
  [Location.Oceania]: { bonus: "trade", discount: 0.05 },
  [Location.Antarctica]: { bonus: "research", discount: 0.05 }
};

export const PRODUCT_NAMES = [
  "Coffee",
  "Tea",
  "Spices",
  "Gold",
  "Silver",
  "Diamonds",
  "Silk",
  "Cotton",
  "Copper",
  "Oil", 
  "Gas",
  "Corn",
  "Wheat",
  "Rice",
  "Electronics",
  "Wood",
  "Toys",
  "Food",
  "Steel",
  "Ceramics",
  "Wool",
  "Plastics",
  "Clothing",
  "Rubber",
  "Medicine",
  "Beer",
  "Wine",
  "Champagne",
  "Spirits"
];

export const PRODUCTS = PRODUCT_NAMES.map((name, index) => ({
  id: index + 1,
  name
}));

export interface ProductListing {
  productId: number;
  name: string;
  marketPrice: number;  // Base price in this location
  demandMultiplier: number;  // Random between 1.01 and 1.25
  available: number;  // How many are available to buy
}

export interface InventoryItem {
  productId: number;
  name: string;
  quantity: number;
  purchasePrice: number;
}

export interface GameState {
  username: string;
  currentLocation: Location;
  cash: number;
  bankBalance: number;
  loanAmount: number;
  daysRemaining: number;
  inventory: InventoryItem[];
  marketListings: ProductListing[];
}
