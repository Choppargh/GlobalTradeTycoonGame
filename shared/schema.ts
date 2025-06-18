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

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertScore = z.infer<typeof insertScoreSchema>;
export type Score = typeof scores.$inferSelect;

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
  "Electronics"
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
