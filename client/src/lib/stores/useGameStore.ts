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
  priceChanges: Record<number, 'increase' | 'decrease' | null>;
  boughtProducts: Set<number>; // Track products bought in current location/day
  soldProducts: Set<number>;   // Track products sold in current location/day
  
  // Game phase
  gamePhase: 'intro' | 'playing' | 'game-over';
  
  // Random events
  currentEvent: GameEvent | null;
  triggerRandomEvent: () => void;
  clearCurrentEvent: () => void;
  
  // Travel risks
  travelRiskMessage: string;
  isTravelRiskDialogOpen: boolean;
  clearTravelRiskDialog: () => void;
  
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
  priceChanges: {},
  boughtProducts: new Set<number>(), // Products bought in current location
  soldProducts: new Set<number>(),   // Products sold in current location
  
  gamePhase: 'intro',
  isBankModalOpen: false,
  currentEvent: null,
  travelRiskMessage: '',
  isTravelRiskDialogOpen: false,
  
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
    
    // Initialize price changes
    const initialPriceChanges: Record<number, 'increase' | 'decrease' | null> = {};
    marketListings.forEach(listing => {
      initialPriceChanges[listing.productId] = null;
    });
    
    set({
      currentLocation: startLocation,
      cash: 2000, // Start with $2k cash from initial loan
      bankBalance: 0,
      loanAmount: 2000,
      daysRemaining: 31,
      inventory: [],
      marketListings,
      priceChanges: initialPriceChanges,
      boughtProducts: new Set<number>(),
      soldProducts: new Set<number>(),
      gamePhase: 'playing'
    });
  },
  
  travel: (destination) => {
    const state = get();
    
    if (state.daysRemaining <= 1) {
      get().endGame();
      return;
    }
    
    // Apply loan interest (5%) with proper rounding to nearest cent
    const newLoanAmount = Math.round(state.loanAmount * 1.05 * 100) / 100;
    
    // Apply bank interest (3% per day) with proper rounding to nearest cent
    const newBankBalance = Math.round(state.bankBalance * 1.03 * 100) / 100;
    
    // Generate new market listings for the destination
    const newMarketListings = generateMarketListings(destination);
    
    // Apply game challenges
    let updatedCash = state.cash;
    let updatedInventory = [...state.inventory];
    let challengeMessage = "";
    
    // Challenge 1: Cash loss at airport (1 in 100 chance)
    if (Math.random() < 0.01) {
      const lossPercentage = Math.random() * 0.75; // Up to 75% loss
      const lossAmount = Math.round(state.cash * lossPercentage * 100) / 100;
      updatedCash = Math.round((state.cash - lossAmount) * 100) / 100;
      
      // Generate random reason for cash loss
      const reasons = [
        "You were robbed at the airport!",
        "You lost your wallet in the taxi!",
        "Someone stole your cash at the hotel!",
        "You were mugged at knifepoint!"
      ];
      const randomReason = reasons[Math.floor(Math.random() * reasons.length)];
      
      challengeMessage = `${randomReason} You lost $${lossAmount.toLocaleString()}.`;
      
      // Show travel risk dialog
      set({
        travelRiskMessage: challengeMessage,
        isTravelRiskDialogOpen: true
      });
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
      
      // Show travel risk dialog
      set({
        travelRiskMessage: challengeMessage,
        isTravelRiskDialogOpen: true
      });
    }
    
    // Create empty price changes record for all new product IDs
    const initialPriceChanges: Record<number, 'increase' | 'decrease' | null> = {};
    newMarketListings.forEach(listing => {
      initialPriceChanges[listing.productId] = null;
    });
    
    // Set new game state and reset bought/sold products since we're in a new location/day
    set({
      currentLocation: destination,
      daysRemaining: state.daysRemaining - 1,
      loanAmount: newLoanAmount,
      bankBalance: newBankBalance,
      marketListings: newMarketListings,
      cash: updatedCash,
      inventory: updatedInventory,
      priceChanges: initialPriceChanges,
      boughtProducts: new Set<number>(),
      soldProducts: new Set<number>()
    });
    
    // Always trigger a market event after travel
    setTimeout(() => {
      get().triggerRandomEvent();
    }, 1000); // Short delay after travel
  },
  
  buyProduct: (productId, quantity, price) => {
    const state = get();
    
    // Ensure price is properly rounded to the nearest cent
    const roundedPrice = Math.round(price * 100) / 100;
    const totalCost = Math.round(quantity * roundedPrice * 100) / 100;
    
    // Trading rule: Can't buy a product you've already sold at this location
    if (state.soldProducts.has(productId)) {
      alert("You can't buy products you've already sold today!");
      return;
    }
    
    // Check for available cash
    if (state.cash < totalCost) {
      alert("Not enough cash to complete this purchase!");
      return;
    }
    
    // Check market availability
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
          ? { ...item, quantity: newQuantity, purchasePrice: Math.round(newAvgPrice * 100) / 100 } 
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
          purchasePrice: roundedPrice
        }
      ];
    }
    
    // Update market listings
    const newMarketListings = state.marketListings.map(listing => 
      listing.productId === productId 
        ? { ...listing, available: listing.available - quantity } 
        : listing
    );
    
    // Record that we bought this product at this location
    const newBoughtProducts = new Set(state.boughtProducts);
    newBoughtProducts.add(productId);
    
    set({
      cash: Math.round((state.cash - totalCost) * 100) / 100,
      inventory: newInventory,
      marketListings: newMarketListings,
      boughtProducts: newBoughtProducts
    });
  },
  
  sellProduct: (productId, quantity, price) => {
    const state = get();
    
    // Trading rule: Can't sell a product you've already sold at this location
    if (state.soldProducts.has(productId)) {
      alert("You've already sold this product today!");
      return;
    }
    
    // Trading rule: Can't sell a product you've just bought at the same location
    if (state.boughtProducts.has(productId)) {
      alert("You can't sell products bought at this location today!");
      return;
    }
    
    // Check inventory
    const inventoryItem = state.inventory.find(item => item.productId === productId);
    if (!inventoryItem || inventoryItem.quantity < quantity) {
      alert("Not enough quantity in inventory!");
      return;
    }
    
    // Ensure price is properly rounded to the nearest cent
    const roundedPrice = Math.round(price * 100) / 100;
    const totalRevenue = Math.round(quantity * roundedPrice * 100) / 100;
    
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
    
    // Record that we sold this product at this location
    const newSoldProducts = new Set(state.soldProducts);
    newSoldProducts.add(productId);
    
    set({
      cash: Math.round((state.cash + totalRevenue) * 100) / 100,
      inventory: newInventory,
      soldProducts: newSoldProducts
    });
  },
  
  handleBankAction: (action, amount) => {
    const state = get();
    
    // Ensure amount is properly rounded to the nearest cent
    const roundedAmount = Math.round(amount * 100) / 100;
    
    switch (action) {
      case 'deposit': 
        if (roundedAmount > state.cash) {
          alert("You don't have enough cash to deposit this amount.");
          return;
        }
        set({
          cash: Math.round((state.cash - roundedAmount) * 100) / 100,
          bankBalance: Math.round((state.bankBalance + roundedAmount) * 100) / 100
        });
        break;
        
      case 'withdraw':
        if (roundedAmount > state.bankBalance) {
          alert("You don't have enough balance to withdraw this amount.");
          return;
        }
        set({
          cash: Math.round((state.cash + roundedAmount) * 100) / 100,
          bankBalance: Math.round((state.bankBalance - roundedAmount) * 100) / 100
        });
        break;
        
      case 'loan':
        if (state.loanAmount + roundedAmount > 10000) {
          alert("Your total loan cannot exceed $10,000.");
          return;
        }
        set({
          cash: Math.round((state.cash + roundedAmount) * 100) / 100,
          loanAmount: Math.round((state.loanAmount + roundedAmount) * 100) / 100
        });
        break;
        
      case 'repay':
        if (roundedAmount > state.cash) {
          alert("You don't have enough cash to repay this amount.");
          return;
        }
        if (roundedAmount > state.loanAmount) {
          alert("You can't repay more than you owe.");
          return;
        }
        set({
          cash: Math.round((state.cash - roundedAmount) * 100) / 100,
          loanAmount: Math.round((state.loanAmount - roundedAmount) * 100) / 100
        });
        break;
    }
  },
  
  endGame: async () => {
    const state = get();
    if (!state.username) return;
    
    // For net worth calculation (for display), properly rounded to the nearest cent
    const inventoryValue = Math.round(state.inventory.reduce(
      (total, item) => total + (item.quantity * item.purchasePrice),
      0
    ) * 100) / 100;
    
    // Net worth includes everything, properly rounded to the nearest cent
    const netWorth = Math.round((state.cash + state.bankBalance + inventoryValue - state.loanAmount) * 100) / 100;
    
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
      
      // Show travel risk dialog for failed score submission
      set({
        travelRiskMessage: "Failed to submit your score. Please try again.",
        isTravelRiskDialogOpen: true
      });
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
      priceChanges: {},
      boughtProducts: new Set<number>(),
      soldProducts: new Set<number>(),
      gamePhase: 'intro',
      isBankModalOpen: false,
      currentEvent: null
    });
  },
  
  setBankModalOpen: (isOpen) => {
    set({ isBankModalOpen: isOpen });
  },
  
  // Random event handlers
  triggerRandomEvent: () => {
    const state = get();
    if (!state.currentLocation) return;
    
    // Generate a random event based on current location and days remaining
    // The function will internally skip events on the last day
    const event = generateRandomEvent(state.currentLocation, state.daysRemaining);
    if (!event) return; // No event generated
    
    let updatedMarketListings = [...state.marketListings];
    let updatedInventory = [...state.inventory];
    let updatedCash = state.cash;
    let updatedPriceChanges = {...state.priceChanges};
    
    // Apply event effects
    switch (event.type) {
      case 'price_change':
      case 'market_crash':
      case 'market_boom': {
        // Apply market event with price tracking
        const result = applyEventToMarket(event, state.marketListings, state.marketListings);
        updatedMarketListings = result.listings;
        updatedPriceChanges = result.priceChanges;
        break;
      }
        
      case 'inventory_boost':
        updatedInventory = applyEventToInventory(event, state.inventory);
        break;
        
      case 'cash_bonus':
        if (event.cashAmount) {
          // Ensure the cash bonus is properly rounded to the nearest cent
          const roundedCashAmount = Math.round(event.cashAmount * 100) / 100;
          updatedCash = Math.round((state.cash + roundedCashAmount) * 100) / 100;
        }
        break;
    }
    
    // Unexpected inventory event - give random products if no inventory
    if (event.type === 'inventory_boost' && state.inventory.length === 0) {
      // Get a random product from current market
      if (state.marketListings.length > 0) {
        const randomIndex = Math.floor(Math.random() * state.marketListings.length);
        const randomProduct = state.marketListings[randomIndex];
        // Give 1-10 random units
        const randomQuantity = Math.floor(Math.random() * 10) + 1;
        
        updatedInventory = [
          {
            productId: randomProduct.productId,
            name: randomProduct.name,
            quantity: randomQuantity,
            purchasePrice: randomProduct.marketPrice
          }
        ];
        
        // Show travel risk dialog about surprise inventory
        set({
          travelRiskMessage: `Surprise! You've received ${randomQuantity} units of ${randomProduct.name} for free.`,
          isTravelRiskDialogOpen: true
        });
      }
    }
    
    // Update the state with event effects and the current event
    set({
      currentEvent: event,
      marketListings: updatedMarketListings,
      inventory: updatedInventory,
      cash: updatedCash,
      priceChanges: updatedPriceChanges
    });
  },
  
  clearCurrentEvent: () => {
    set({ currentEvent: null });
  },
  
  clearTravelRiskDialog: () => {
    set({ 
      isTravelRiskDialogOpen: false,
      travelRiskMessage: ''
    });
  }
}));
