import { create } from "zustand";
import { Location, PRODUCTS, ProductListing, InventoryItem, PRODUCT_NAMES } from "@shared/schema";
import { apiRequest } from "../queryClient";
import { 
  generateMarketListings, 
  generateRandomEvent, 
  applyEventToMarket, 
  applyEventToInventory, 
  GameEvent 
} from "../gameLogic";

interface GameState {
  // Player state
  username: string | null;
  currentLocation: Location | null;
  cash: number;
  bankBalance: number;
  loanAmount: number;
  daysRemaining: number;
  inventory: InventoryItem[];
  marketListings: ProductListing[];
  
  // Game phase
  gamePhase: 'intro' | 'playing' | 'game-over';
  
  // Random events
  currentEvent: GameEvent | null;
  triggerRandomEvent: () => void;
  clearCurrentEvent: () => void;
  
  // Game actions
  setUsername: (username: string) => void;
  startGame: () => void;
  travel: (destination: Location) => void;
  buyProduct: (productId: number, quantity: number, price: number) => void;
  sellProduct: (productId: number, quantity: number, price: number) => void;
  handleBankAction: (action: 'deposit' | 'withdraw' | 'loan' | 'repay', amount: number) => void;
  endGame: () => Promise<void>;
  restartGame: () => void;
  
  // UI states
  isBankModalOpen: boolean;
  setBankModalOpen: (isOpen: boolean) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  // Initial game state
  username: null,
  currentLocation: null,
  cash: 0,
  bankBalance: 0,
  loanAmount: 2000, // Start with $2k loan
  daysRemaining: 31,
  inventory: [],
  marketListings: [],
  
  gamePhase: 'intro',
  isBankModalOpen: false,
  currentEvent: null,
  
  setUsername: (username) => {
    set({ username });
  },
  
  startGame: () => {
    // Pick random location
    const locations = Object.values(Location);
    const randomIndex = Math.floor(Math.random() * locations.length);
    const startLocation = locations[randomIndex];
    
    // Create initial market listings for this location
    const marketListings = generateMarketListings(startLocation);
    
    set({
      currentLocation: startLocation,
      cash: 2000, // Start with $2k cash from initial loan
      bankBalance: 0,
      loanAmount: 2000,
      daysRemaining: 31,
      inventory: [],
      marketListings,
      gamePhase: 'playing'
    });
  },
  
  travel: (destination) => {
    const state = get();
    
    if (state.daysRemaining <= 1) {
      get().endGame();
      return;
    }
    
    // Apply loan interest (5%)
    const newLoanAmount = Math.round(state.loanAmount * 1.05);
    
    // Apply bank interest (3% per day)
    const newBankBalance = Math.round(state.bankBalance * 1.03);
    
    // Generate new market listings for the destination
    const newMarketListings = generateMarketListings(destination);
    
    // Apply game challenges
    let updatedCash = state.cash;
    let updatedInventory = [...state.inventory];
    let challengeMessage = "";
    
    // Challenge 1: Cash loss at airport (1 in 100 chance)
    if (Math.random() < 0.01) {
      const lossPercentage = Math.random() * 0.75; // Up to 75% loss
      const lossAmount = Math.round(state.cash * lossPercentage);
      updatedCash = state.cash - lossAmount;
      
      // Generate random reason for cash loss
      const reasons = [
        "You were robbed at the airport!",
        "You lost your wallet in the taxi!",
        "Someone stole your cash at the hotel!",
        "You were mugged at knifepoint!"
      ];
      const randomReason = reasons[Math.floor(Math.random() * reasons.length)];
      
      challengeMessage = `${randomReason} You lost $${lossAmount.toLocaleString()}.`;
      
      // Show an alert
      alert(challengeMessage);
    }
    
    // Challenge 2: Inventory loss due to fire/theft (1 in 200 chance)
    if (Math.random() < 0.005 && state.inventory.length > 0) {
      const lossPercentage = Math.random() * 0.8; // Up to 80% loss
      
      // Create updated inventory with some items lost
      updatedInventory = state.inventory.map(item => {
        const lostQuantity = Math.round(item.quantity * lossPercentage);
        return {
          ...item,
          quantity: item.quantity - lostQuantity
        };
      }).filter(item => item.quantity > 0); // Remove items with zero quantity
      
      // Generate random reason for inventory loss
      const reasons = [
        "A fire broke out in the warehouse where your goods were stored!",
        "Your shipping container was broken into!",
        "Customs officials seized some of your goods!",
        "Your inventory was damaged during transportation!"
      ];
      const randomReason = reasons[Math.floor(Math.random() * reasons.length)];
      
      challengeMessage = `${randomReason} You lost a significant portion of your inventory.`;
      
      // Show an alert
      alert(challengeMessage);
    }
    
    // Set new game state
    set({
      currentLocation: destination,
      daysRemaining: state.daysRemaining - 1,
      loanAmount: newLoanAmount,
      bankBalance: newBankBalance,
      marketListings: newMarketListings,
      cash: updatedCash,
      inventory: updatedInventory
    });
    
    // Always trigger a market event after travel
    setTimeout(() => {
      get().triggerRandomEvent();
    }, 1000); // Short delay after travel
  },
  
  buyProduct: (productId, quantity, price) => {
    const state = get();
    const totalCost = quantity * price;
    
    if (state.cash < totalCost) {
      alert("Not enough cash to complete this purchase!");
      return;
    }
    
    // Find the product in market listings
    const productListing = state.marketListings.find(p => p.productId === productId);
    if (!productListing || productListing.available < quantity) {
      alert("Not enough quantity available!");
      return;
    }
    
    // Update inventory
    const existingItem = state.inventory.find(item => item.productId === productId);
    let newInventory;
    
    if (existingItem) {
      // Update existing inventory item
      const newQuantity = existingItem.quantity + quantity;
      const newAvgPrice = ((existingItem.quantity * existingItem.purchasePrice) + (quantity * price)) / newQuantity;
      
      newInventory = state.inventory.map(item => 
        item.productId === productId 
          ? { ...item, quantity: newQuantity, purchasePrice: newAvgPrice } 
          : item
      );
    } else {
      // Add new inventory item
      const product = PRODUCTS.find(p => p.id === productId);
      if (!product) return;
      
      newInventory = [
        ...state.inventory,
        {
          productId,
          name: product.name,
          quantity,
          purchasePrice: price
        }
      ];
    }
    
    // Update market listings
    const newMarketListings = state.marketListings.map(listing => 
      listing.productId === productId 
        ? { ...listing, available: listing.available - quantity } 
        : listing
    );
    
    set({
      cash: state.cash - totalCost,
      inventory: newInventory,
      marketListings: newMarketListings
    });
  },
  
  sellProduct: (productId, quantity, price) => {
    const state = get();
    
    // Find the product in inventory
    const inventoryItem = state.inventory.find(item => item.productId === productId);
    if (!inventoryItem || inventoryItem.quantity < quantity) {
      alert("Not enough quantity in inventory!");
      return;
    }
    
    const totalRevenue = quantity * price;
    
    // Update inventory
    let newInventory;
    if (inventoryItem.quantity === quantity) {
      // Remove item if selling all
      newInventory = state.inventory.filter(item => item.productId !== productId);
    } else {
      // Update quantity if selling partial
      newInventory = state.inventory.map(item => 
        item.productId === productId 
          ? { ...item, quantity: item.quantity - quantity } 
          : item
      );
    }
    
    set({
      cash: state.cash + totalRevenue,
      inventory: newInventory
    });
  },
  
  handleBankAction: (action, amount) => {
    const state = get();
    
    switch (action) {
      case 'deposit': 
        if (amount > state.cash) {
          alert("You don't have enough cash to deposit this amount.");
          return;
        }
        set({
          cash: state.cash - amount,
          bankBalance: state.bankBalance + amount
        });
        break;
        
      case 'withdraw':
        if (amount > state.bankBalance) {
          alert("You don't have enough balance to withdraw this amount.");
          return;
        }
        set({
          cash: state.cash + amount,
          bankBalance: state.bankBalance - amount
        });
        break;
        
      case 'loan':
        if (state.loanAmount + amount > 10000) {
          alert("Your total loan cannot exceed $10,000.");
          return;
        }
        set({
          cash: state.cash + amount,
          loanAmount: state.loanAmount + amount
        });
        break;
        
      case 'repay':
        if (amount > state.cash) {
          alert("You don't have enough cash to repay this amount.");
          return;
        }
        if (amount > state.loanAmount) {
          alert("You can't repay more than you owe.");
          return;
        }
        set({
          cash: state.cash - amount,
          loanAmount: state.loanAmount - amount
        });
        break;
    }
  },
  
  endGame: async () => {
    const state = get();
    if (!state.username) return;
    
    // For net worth calculation (for display)
    const inventoryValue = state.inventory.reduce(
      (total, item) => total + (item.quantity * item.purchasePrice),
      0
    );
    
    // Net worth includes everything
    const netWorth = state.cash + state.bankBalance + inventoryValue - state.loanAmount;
    
    // Score is based ONLY on banked cash
    const score = Math.max(0, Math.round(state.bankBalance));
    
    try {
      // Submit score to leaderboard
      await apiRequest('POST', '/api/scores', {
        username: state.username,
        score,
        days: 31 - state.daysRemaining,
        endNetWorth: netWorth
      });
      
      set({ gamePhase: 'game-over' });
    } catch (error) {
      console.error("Failed to submit score:", error);
      alert("Failed to submit your score. Please try again.");
    }
  },
  
  restartGame: () => {
    set({
      currentLocation: null,
      cash: 0,
      bankBalance: 0,
      loanAmount: 0,
      daysRemaining: 31,
      inventory: [],
      marketListings: [],
      gamePhase: 'intro',
      isBankModalOpen: false
    });
  },
  
  setBankModalOpen: (isOpen) => {
    set({ isBankModalOpen: isOpen });
  },
  
  // Random event handlers
  triggerRandomEvent: () => {
    const state = get();
    if (!state.currentLocation) return;
    
    // Generate a random event based on current location
    const event = generateRandomEvent(state.currentLocation);
    if (!event) return; // No event generated
    
    let updatedMarketListings = [...state.marketListings];
    let updatedInventory = [...state.inventory];
    let updatedCash = state.cash;
    
    // Apply event effects
    switch (event.type) {
      case 'price_change':
      case 'market_crash':
      case 'market_boom':
        updatedMarketListings = applyEventToMarket(event, state.marketListings);
        break;
        
      case 'inventory_boost':
        updatedInventory = applyEventToInventory(event, state.inventory);
        break;
        
      case 'cash_bonus':
        if (event.cashAmount) {
          updatedCash = state.cash + event.cashAmount;
        }
        break;
    }
    
    // Update the state with event effects and the current event
    set({
      currentEvent: event,
      marketListings: updatedMarketListings,
      inventory: updatedInventory,
      cash: updatedCash
    });
  },
  
  clearCurrentEvent: () => {
    set({ currentEvent: null });
  }
}));
