import { pgTable, text, serial, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enhanced user schema for hybrid authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  googleId: text("google_id").unique(), // For Google OAuth users
  email: text("email"), // From Google account
  deviceId: text("device_id").unique(), // For guest users
  authType: text("auth_type").notNull().default("guest"), // "google" or "guest"
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  googleId: true,
  email: true,
  deviceId: true,
  authType: true,
});

// Enhanced scores schema linked to users
export const scores = pgTable("scores", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  username: text("username").notNull(), // Keep for display purposes
  score: real("score").notNull(),
  days: integer("days").notNull(),
  endNetWorth: real("end_net_worth").notNull(),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});

export const insertScoreSchema = createInsertSchema(scores).pick({
  userId: true,
  username: true,
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
