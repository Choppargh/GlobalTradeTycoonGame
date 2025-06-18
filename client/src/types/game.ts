import { Location, ProductListing, InventoryItem } from "@shared/schema";

export interface BankTransaction {
  type: 'deposit' | 'withdraw' | 'loan' | 'repay';
  amount: number;
}

export interface TravelAction {
  destination: Location;
}

export interface PurchaseAction {
  productId: number;
  quantity: number;
  price: number;
}

export interface SellAction {
  productId: number;
  quantity: number;
  price: number;
}

export interface GameStatus {
  username: string;
  currentLocation: Location;
  cash: number;
  bankBalance: number; 
  loanAmount: number;
  daysRemaining: number;
  inventory: InventoryItem[];
  marketListings: ProductListing[];
  netWorth: number;
}

export interface LeaderboardEntry {
  id: number;
  username: string;
  displayName?: string;
  score: number;
  days: number;
  endNetWorth?: number;
  createdAt: string;
}
