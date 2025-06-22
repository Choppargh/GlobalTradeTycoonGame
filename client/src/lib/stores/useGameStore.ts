import { create } from "zustand";
import { 
  Location, 
  PRODUCTS, 
  ProductListing, 
  InventoryItem, 
  PRODUCT_NAMES,
  PlayerInfrastructure,
  PlayerStaff,
  PlayerReputation,
  Contract,
  PlayerSettings,
  StaffType,
  InfrastructureType,
  REPUTATION_TIERS,
  STAFF_TYPES,
  INFRASTRUCTURE_COSTS
} from "@shared/schema";
import { apiRequest } from "../queryClient";
import { makeRequest } from "../api";
import { 
  generateMarketListings, 
  generateRandomEvent, 
  applyEventToMarket, 
  applyEventToInventory, 
  GameEvent 
} from "../gameLogic";
// Import game configuration constants
const GAME_CONFIG = {
  GAME_DURATION_DAYS: 31,
  STARTING_LOAN: 2000,
  MAX_LOAN_AMOUNT: 10000,
  LOAN_INTEREST_RATE: 0.05,
  CASH_LOSS_PROBABILITY: 0.01,
  INVENTORY_LOSS_PROBABILITY: 0.005,
  MAX_CASH_LOSS_PERCENTAGE: 0.75,
  MAX_INVENTORY_LOSS_PERCENTAGE: 0.8,
  AUTO_SAVE_ENABLED: true,
};
const GAME_DURATION = GAME_CONFIG.GAME_DURATION_DAYS;
import { saveGameState, loadGameState, clearSavedGameState } from "../autoSave";
import { clearAllGameData } from "../clearCrossSessionData";

interface GameState {
  // Player state
  userId: number | null;  // Add user ID for storage isolation
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
  
  // Phase 2: New game state
  playerSettings: PlayerSettings | null;
  infrastructure: PlayerInfrastructure[];
  staff: PlayerStaff[];
  reputation: Record<string, PlayerReputation>; // Keyed by location
  contracts: Contract[];
  baseSelectionPhase: boolean; // True when player needs to select base
  
  // Game phase
  gamePhase: 'base-selection' | 'intro' | 'playing' | 'game-over';
  
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
  refreshUserInfo: () => Promise<void>;
  startGame: () => Promise<void>;
  startNewGame: () => void;
  travel: (destination: Location) => void;
  buyProduct: (productId: number, quantity: number, price: number) => void;
  sellProduct: (productId: number, quantity: number, price: number) => void;
  handleBankAction: (action: 'deposit' | 'withdraw' | 'loan' | 'repay', amount: number) => void;
  endGame: () => Promise<void>;
  finishGame: () => Promise<void>;
  restartGame: () => void;
  
  // Phase 2 actions
  selectHomeBase: (homeBase: Location) => Promise<void>;
  buildInfrastructure: (location: Location, type: InfrastructureType) => Promise<void>;
  upgradeInfrastructure: (infrastructureId: number) => Promise<void>;
  hireStaff: (location: Location, staffType: StaffType) => Promise<void>;
  fireStaff: (staffId: number) => Promise<void>;
  acceptContract: (contractId: number) => Promise<void>;
  completeContract: (contractId: number) => Promise<void>;
  updateReputation: (location: Location, change: number) => void;
  loadPlayerData: () => Promise<void>;
  
  // UI states
  isBankModalOpen: boolean;
  setBankModalOpen: (isOpen: boolean) => void;
  isInfrastructureModalOpen: boolean;
  setInfrastructureModalOpen: (isOpen: boolean) => void;
  isStaffModalOpen: boolean;
  setStaffModalOpen: (isOpen: boolean) => void;
  isEndGameConfirmationOpen: boolean;
  setEndGameConfirmationOpen: (isOpen: boolean) => void;
  
  // Game state persistence (for PWA offline support and refresh recovery)
  saveGameState: () => void;
  loadGameState: () => boolean;
  clearSavedGameState: () => void;
  autoSaveEnabled: boolean;
  setAutoSaveEnabled: (enabled: boolean) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  // Initial game state
  userId: null,
  username: null,
  currentLocation: null,
  cash: 0,
  bankBalance: 0,
  loanAmount: GAME_CONFIG.STARTING_LOAN,
  daysRemaining: GAME_DURATION,
  inventory: [],
  marketListings: [],
  priceChanges: {},
  boughtProducts: new Set<number>(), // Products bought in current location
  soldProducts: new Set<number>(),   // Products sold in current location
  
  // Phase 2 initial state
  playerSettings: null,
  infrastructure: [],
  staff: [],
  reputation: {},
  contracts: [],
  baseSelectionPhase: false,
  
  gamePhase: 'intro',
  isBankModalOpen: false,
  isInfrastructureModalOpen: false,
  isStaffModalOpen: false,
  currentEvent: null,
  travelRiskMessage: '',
  isTravelRiskDialogOpen: false,
  isEndGameConfirmationOpen: false,
  autoSaveEnabled: GAME_CONFIG.AUTO_SAVE_ENABLED,
  
  setUsername: (username) => {
    set({ username });
  },

  refreshUserInfo: async () => {
    try {
      const response = await fetch('/auth/status', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.isAuthenticated && data.user) {
          set({ 
            userId: data.user.id,
            username: data.user.displayName || data.user.username || data.user.email || 'Trader' 
          });
        }
      }
    } catch (error) {
      console.error('Failed to refresh user info:', error);
    }
  },
  
  startGame: async () => {
    // Fetch current user information and load player data
    try {
      const response = await fetch('/auth/status', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.isAuthenticated && data.user) {
          set({ 
            userId: data.user.id,
            username: data.user.displayName || data.user.username || data.user.email || 'Trader' 
          });
          
          // Load player data first to check for existing settings
          await get().loadPlayerData();
        }
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      set({ username: 'Trader' }); // Fallback
    }
    
    // Always start with base selection for new games
    const state = get();
    set({
      gamePhase: 'base-selection',
      baseSelectionPhase: true
    });
  },
  
  travel: (destination) => {
    const state = get();
    
    if (state.daysRemaining <= 1) {
      // On the last day, don't directly call endGame - open confirmation dialog
      set({ isEndGameConfirmationOpen: true });
      return;
    }
    
    // Apply loan interest with proper rounding to nearest cent
    const newLoanAmount = Math.round(state.loanAmount * (1 + GAME_CONFIG.LOAN_INTEREST_RATE) * 100) / 100;
    
    // Apply bank interest (3% per day) with proper rounding to nearest cent
    const newBankBalance = Math.round(state.bankBalance * 1.03 * 100) / 100;
    
    // Generate new market listings for the destination
    const newMarketListings = generateMarketListings(destination);
    
    // Apply game challenges
    let updatedCash = state.cash;
    let updatedInventory = [...state.inventory];
    let challengeMessage = "";
    
    // Challenge 1: Cash loss at airport
    if (Math.random() < GAME_CONFIG.CASH_LOSS_PROBABILITY) {
      const lossPercentage = Math.random() * GAME_CONFIG.MAX_CASH_LOSS_PERCENTAGE;
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
    
    // Challenge 2: Inventory loss due to fire/theft
    if (Math.random() < GAME_CONFIG.INVENTORY_LOSS_PROBABILITY && state.inventory.length > 0) {
      const lossPercentage = Math.random() * GAME_CONFIG.MAX_INVENTORY_LOSS_PERCENTAGE;
      
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
    
    // Check for a random event upon arrival (just once)
    const event = generateRandomEvent(destination, state.daysRemaining - 1);
    let updatedMarketListings = [...newMarketListings];
    let updatedPriceChanges = {...initialPriceChanges};
    
    // If there's an event, apply it immediately
    if (event) {
      if (event.type === 'price_change' || event.type === 'market_crash' || event.type === 'market_boom') {
        const result = applyEventToMarket(event, newMarketListings, newMarketListings);
        updatedMarketListings = result.listings;
        updatedPriceChanges = result.priceChanges;
      } else if (event.type === 'inventory_boost') {
        updatedInventory = applyEventToInventory(event, updatedInventory);
      } else if (event.type === 'cash_bonus' && event.cashAmount) {
        updatedCash = Math.round((updatedCash + event.cashAmount) * 100) / 100;
      }
    }
    
    // Set new game state and reset bought/sold products since we're in a new location/day
    set({
      currentLocation: destination,
      daysRemaining: state.daysRemaining - 1,
      loanAmount: newLoanAmount,
      bankBalance: newBankBalance,
      marketListings: updatedMarketListings,
      cash: updatedCash,
      inventory: updatedInventory,
      priceChanges: updatedPriceChanges,
      boughtProducts: new Set<number>(),
      soldProducts: new Set<number>(),
      currentEvent: event
    });
    
    // Auto-save after traveling
    if (get().autoSaveEnabled) {
      get().saveGameState();
    }
  },
  
  buyProduct: (productId, quantity, price) => {
    const state = get();
    
    // Ensure price is properly rounded to the nearest cent
    const roundedPrice = Math.round(price * 100) / 100;
    const totalCost = Math.round(quantity * roundedPrice * 100) / 100;
    
    // Trading rule: Can't buy a product you've already sold at this location
    if (state.soldProducts.has(productId)) {
      set({ 
        travelRiskMessage: "You can't buy products you've already sold today!",
        isTravelRiskDialogOpen: true 
      });
      return;
    }
    
    // Check for available cash
    if (state.cash < totalCost) {
      set({ 
        travelRiskMessage: "Not enough cash to complete this purchase!",
        isTravelRiskDialogOpen: true 
      });
      return;
    }
    
    // Check market availability
    const productListing = state.marketListings.find(p => p.productId === productId);
    if (!productListing || productListing.available < quantity) {
      set({ 
        travelRiskMessage: "Not enough quantity available!",
        isTravelRiskDialogOpen: true 
      });
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
    
    // Auto-save after buying products
    if (get().autoSaveEnabled) {
      get().saveGameState();
    }
  },
  
  sellProduct: (productId, quantity, price) => {
    const state = get();
    
    // Trading rule: Can't sell a product you've just bought at the same location
    if (state.boughtProducts.has(productId)) {
      set({ 
        travelRiskMessage: "You can't sell products bought at this location today!",
        isTravelRiskDialogOpen: true 
      });
      return;
    }
    
    // Check inventory
    const inventoryItem = state.inventory.find(item => item.productId === productId);
    if (!inventoryItem || inventoryItem.quantity < quantity) {
      set({ 
        travelRiskMessage: "Not enough quantity in inventory!",
        isTravelRiskDialogOpen: true 
      });
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
    
    // Auto-save after selling products
    if (get().autoSaveEnabled) {
      get().saveGameState();
    }
  },
  
  handleBankAction: (action, amount) => {
    const state = get();
    
    // Ensure amount is properly rounded to the nearest cent
    const roundedAmount = Math.round(amount * 100) / 100;
    
    switch (action) {
      case 'deposit': 
        if (roundedAmount > state.cash) {
          set({ 
            travelRiskMessage: "You don't have enough cash to deposit this amount.",
            isTravelRiskDialogOpen: true 
          });
          return;
        }
        set({
          cash: Math.round((state.cash - roundedAmount) * 100) / 100,
          bankBalance: Math.round((state.bankBalance + roundedAmount) * 100) / 100
        });
        
        // Auto-save after bank deposit
        if (get().autoSaveEnabled) {
          get().saveGameState();
        }
        break;
        
      case 'withdraw':
        if (roundedAmount > state.bankBalance) {
          set({ 
            travelRiskMessage: "You don't have enough balance to withdraw this amount.",
            isTravelRiskDialogOpen: true 
          });
          return;
        }
        set({
          cash: Math.round((state.cash + roundedAmount) * 100) / 100,
          bankBalance: Math.round((state.bankBalance - roundedAmount) * 100) / 100
        });
        
        // Auto-save after bank withdrawal
        if (get().autoSaveEnabled) {
          get().saveGameState();
        }
        break;
        
      case 'loan':
        if (state.loanAmount + roundedAmount > GAME_CONFIG.MAX_LOAN_AMOUNT) {
          set({ 
            travelRiskMessage: `Your total loan cannot exceed $${GAME_CONFIG.MAX_LOAN_AMOUNT.toLocaleString()}.`,
            isTravelRiskDialogOpen: true 
          });
          return;
        }
        set({
          cash: Math.round((state.cash + roundedAmount) * 100) / 100,
          loanAmount: Math.round((state.loanAmount + roundedAmount) * 100) / 100
        });
        
        // Auto-save after taking a loan
        if (get().autoSaveEnabled) {
          get().saveGameState();
        }
        break;
        
      case 'repay':
        if (roundedAmount > state.cash) {
          set({ 
            travelRiskMessage: "You don't have enough cash to repay this amount.",
            isTravelRiskDialogOpen: true 
          });
          return;
        }
        if (roundedAmount > state.loanAmount) {
          set({ 
            travelRiskMessage: "You can't repay more than you owe.",
            isTravelRiskDialogOpen: true 
          });
          return;
        }
        set({
          cash: Math.round((state.cash - roundedAmount) * 100) / 100,
          loanAmount: Math.round((state.loanAmount - roundedAmount) * 100) / 100
        });
        
        // Auto-save after loan repayment
        if (get().autoSaveEnabled) {
          get().saveGameState();
        }
        break;
    }
  },
  
  endGame: async () => {
    console.log("endGame function called - quitting game without score submission");
    const state = get();
    if (!state.username) return;
    
    // Clear saved game state to remove any progress
    get().clearSavedGameState();
    
    // Reset game state completely
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
      currentEvent: null,
      isEndGameConfirmationOpen: false,
      isTravelRiskDialogOpen: false
    });
    
    // Redirect to homepage
    window.location.href = '/';
  },

  finishGame: async () => {
    console.log("finishGame function called - completing game with score submission");
    const state = get();
    if (!state.username) return;
    
    // For net worth calculation (for display), properly rounded to the nearest cent
    const inventoryValue = Math.round(state.inventory.reduce(
      (total, item) => total + (item.quantity * item.purchasePrice),
      0
    ) * 100) / 100;
    
    // Net worth includes everything, properly rounded to the nearest cent
    const netWorth = Math.round((state.cash + state.bankBalance + inventoryValue - state.loanAmount) * 100) / 100;
    
    // Score is final Bank Balance minus any outstanding loan amount
    const score = Math.max(0, Math.round(state.bankBalance - state.loanAmount));
    
    // Check if score already submitted for this game session to prevent duplicates
    const gameId = `${state.userId}_${state.daysRemaining}_${state.cash}_${Date.now()}`;
    const submittedScoreKey = `globalTradeTycoon_submittedScore_${gameId}`;
    if (localStorage.getItem(submittedScoreKey)) {
      console.log("Score already submitted for this game session, skipping submission");
      return;
    }
    
    // Always clear saved game state first to prevent resumed play in any case
    get().clearSavedGameState();
    
    // Move to game over screen immediately to prevent multiple submissions
    set({
      isEndGameConfirmationOpen: false,
      gamePhase: 'game-over',
      isTravelRiskDialogOpen: false
    });
    
    try {
      // Submit score to leaderboard
      // Always submit full game duration for completed games since players should play full duration
      // If they finish early, they still get credit for full game completion
      const daysPlayed = GAME_DURATION; // Fixed to always show full duration for completed games
      console.log(`Score submission: User completed game. Days remaining: ${state.daysRemaining}, submitting: ${daysPlayed} days`);
      
      console.log("Submitting score to API...");
      const response = await fetch('/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          score,
          days: daysPlayed,
          endNetWorth: netWorth
        })
      });

      console.log("Score submission response:", response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Score submission failed:", response.status, errorText);
        throw new Error(`Score submission failed: ${response.status} ${errorText}`);
      }
      
      // Mark score as submitted for this session to prevent duplicates
      localStorage.setItem(submittedScoreKey, 'true');
      
      // Clean up old submission keys to prevent localStorage bloat
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('globalTradeTycoon_submittedScore_') && key !== submittedScoreKey) {
          localStorage.removeItem(key);
        }
      }
      
      console.log("Score submitted successfully");
      
      // Add a small delay and then notify GameOver component to refresh leaderboard
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('scoreSubmitted'));
      }, 100);
    } catch (error) {
      console.error("Failed to submit score:", error);
      // Game over screen is already showing, no need to change state again
    }
  },
  
  startNewGame: () => {
    const state = get();
    console.log('Starting new game - forcing base selection');
    
    // Clear the submitted score flag so the player can submit a new score
    const submittedScoreKey = `globalTradeTycoon_submittedScore_${state.userId || 'guest'}`;
    localStorage.removeItem(submittedScoreKey);
    
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
      gamePhase: 'base-selection',
      baseSelectionPhase: true,
      isBankModalOpen: false,
      currentEvent: null,
      // Don't clear player settings completely, but force base selection
      infrastructure: [],
      staff: [],
      reputation: {},
      contracts: []
    });
    
    // Clear any saved game data
    get().clearSavedGameState();
  },

  restartGame: () => {
    const state = get();
    // Clear the submitted score flag so the player can submit a new score
    const submittedScoreKey = `globalTradeTycoon_submittedScore_${state.userId || 'guest'}`;
    localStorage.removeItem(submittedScoreKey);
    
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
      gamePhase: 'base-selection',
      baseSelectionPhase: true,
      isBankModalOpen: false,
      currentEvent: null,
      // Clear Phase 2 data to force fresh selection
      playerSettings: null,
      infrastructure: [],
      staff: [],
      reputation: {},
      contracts: []
    });
    
    // Clear any saved game data
    get().clearSavedGameState();
  },
  
  setBankModalOpen: (isOpen) => {
    set({ isBankModalOpen: isOpen });
  },
  

  
  setEndGameConfirmationOpen: (isOpen) => {
    console.log("setEndGameConfirmationOpen called with:", isOpen);
    set({ isEndGameConfirmationOpen: isOpen });
    console.log("isEndGameConfirmationOpen set to:", isOpen);
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
  },
  
  // Control auto-save feature
  setAutoSaveEnabled: (enabled) => {
    set({ autoSaveEnabled: enabled });
  },
  
  // Game state persistence methods for PWA
  saveGameState: () => {
    const state = get();
    
    // Skip saving if game isn't actively playing or auto-save is disabled
    if (state.gamePhase !== 'playing' || !state.username || !state.currentLocation || !state.autoSaveEnabled) {
      return;
    }
    
    try {
      // Create a serializable version of the state
      // We need to convert Sets to arrays for JSON serialization
      const serializableState = {
        username: state.username,
        currentLocation: state.currentLocation,
        cash: state.cash,
        bankBalance: state.bankBalance,
        loanAmount: state.loanAmount,
        daysRemaining: state.daysRemaining,
        inventory: state.inventory,
        marketListings: state.marketListings,
        priceChanges: state.priceChanges,
        boughtProducts: Array.from(state.boughtProducts),
        soldProducts: Array.from(state.soldProducts),
        gamePhase: state.gamePhase,
        savedAt: new Date().toISOString(),
      };
      
      // Save to user-specific storage
      const userId = state.userId || undefined;
      localStorage.setItem(userId ? `globalTradeTycoon_savedGame_user_${userId}` : 'globalTradeTycoon_savedGame_guest', JSON.stringify(serializableState));
      localStorage.setItem(userId ? `globalTradeTycoon_savedGameVersion_user_${userId}` : 'globalTradeTycoon_savedGameVersion_guest', '1.0');
      
      console.log('Game state saved successfully');
      return true;
    } catch (err) {
      console.error('Failed to save game state:', err);
      return false;
    }
  },
  
  loadGameState: () => {
    try {
      // Check if we have a saved game with user-specific storage
      const currentState = get();
      const userId = currentState.userId || undefined;
      const savedGame = localStorage.getItem(userId ? `globalTradeTycoon_savedGame_user_${userId}` : 'globalTradeTycoon_savedGame_guest');
      const savedVersion = localStorage.getItem(userId ? `globalTradeTycoon_savedGameVersion_user_${userId}` : 'globalTradeTycoon_savedGameVersion_guest');
      
      if (!savedGame || !savedVersion) {
        console.log('No saved game found');
        return false;
      }
      
      // Parse the saved state
      const savedState = JSON.parse(savedGame);
      
      // Convert arrays back to Sets, ensuring they're number arrays
      const boughtProducts = new Set<number>(savedState.boughtProducts as number[]);
      const soldProducts = new Set<number>(savedState.soldProducts as number[]);
      
      // Validate essential properties
      if (
        !savedState.username || 
        !savedState.currentLocation || 
        typeof savedState.cash !== 'number' ||
        typeof savedState.daysRemaining !== 'number'
      ) {
        console.error('Saved game data is corrupt or incomplete');
        return false;
      }
      
      // Calculate how long ago the game was saved
      const savedAt = new Date(savedState.savedAt || Date.now());
      const now = new Date();
      const hoursSinceSaved = (now.getTime() - savedAt.getTime()) / (1000 * 60 * 60);
      
      // Expire saved games after 7 days
      if (hoursSinceSaved > 168) { // 7 days * 24 hours
        console.log('Saved game is too old (more than 7 days)');
        localStorage.removeItem('globalTradeTycoon_savedGame');
        return false;
      }
      
      // Set the saved state
      set({
        username: savedState.username,
        currentLocation: savedState.currentLocation,
        cash: savedState.cash,
        bankBalance: savedState.bankBalance,
        loanAmount: savedState.loanAmount,
        daysRemaining: savedState.daysRemaining,
        inventory: savedState.inventory,
        marketListings: savedState.marketListings,
        priceChanges: savedState.priceChanges || {},
        boughtProducts: new Set<number>(),  // Initialize empty sets first
        soldProducts: new Set<number>(),
        gamePhase: 'playing',
        currentEvent: null,
        isTravelRiskDialogOpen: false,
        travelRiskMessage: '',
        isBankModalOpen: false
      });
      
      // Then manually add items to the sets
      const gameState = get();
      savedState.boughtProducts.forEach((id: number) => gameState.boughtProducts.add(id));
      savedState.soldProducts.forEach((id: number) => gameState.soldProducts.add(id));
      
      console.log('Game loaded successfully from saved state');
      return true;
    } catch (err) {
      console.error('Failed to load game state:', err);
      return false;
    }
  },
  
  clearSavedGameState: () => {
    const state = get();
    return clearSavedGameState(state.userId || undefined);
  },

  // Phase 2 action implementations
  selectHomeBase: async (homeBase: Location) => {
    const state = get();
    console.log('Base selected for this session:', homeBase);
    
    // Start game directly with selected base for current session only
    // Create initial market listings for this location
    const marketListings = generateMarketListings(homeBase);
    
    // Initialize price changes
    const initialPriceChanges: Record<number, 'increase' | 'decrease' | null> = {};
    marketListings.forEach(listing => {
      initialPriceChanges[listing.productId] = null;
    });
    
    set({
      currentLocation: homeBase,
      cash: GAME_CONFIG.STARTING_LOAN, // Start with cash from initial loan
      bankBalance: 0,
      loanAmount: GAME_CONFIG.STARTING_LOAN,
      daysRemaining: GAME_DURATION,
      inventory: [],
      marketListings,
      priceChanges: initialPriceChanges,
      boughtProducts: new Set<number>(),
      soldProducts: new Set<number>(),
      baseSelectionPhase: false,
      gamePhase: 'playing'
    });
    
    // Auto-save when starting a new game
    if (get().autoSaveEnabled) {
      setTimeout(() => get().saveGameState(), 100);
    }
  },

  buildInfrastructure: async (location: Location, type: InfrastructureType) => {
    const state = get();
    if (!state.userId) return;

    try {
      const cost = INFRASTRUCTURE_COSTS[type].build[0]; // Level 1 cost
      const maintenance = INFRASTRUCTURE_COSTS[type].maintenance[0];

      await makeRequest('POST', '/api/player/infrastructure', {
        userId: state.userId,
        location,
        type,
        level: 1,
        maintenanceCost: maintenance
      });

      // Deduct cost from cash
      set({ cash: state.cash - cost });
      
      // Reload infrastructure data
      await get().loadPlayerData();
    } catch (error) {
      console.error('Failed to build infrastructure:', error);
    }
  },

  upgradeInfrastructure: async (infrastructureId: number) => {
    // Implementation for upgrading existing infrastructure
    console.log('Upgrade infrastructure:', infrastructureId);
  },

  hireStaff: async (location: Location, staffType: StaffType) => {
    const state = get();
    if (!state.userId) return;

    try {
      const staffInfo = STAFF_TYPES[staffType];
      const level = 1;
      const salary = staffInfo.baseSalary * level;

      // Generate a random staff name
      const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn'];
      const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
      const name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;

      await makeRequest('POST', '/api/player/staff', {
        userId: state.userId,
        location,
        staffType,
        name,
        level,
        salary,
        performance: 1.0
      });

      await get().loadPlayerData();
    } catch (error) {
      console.error('Failed to hire staff:', error);
    }
  },

  fireStaff: async (staffId: number) => {
    try {
      await makeRequest('DELETE', `/api/player/staff/${staffId}`);
      await get().loadPlayerData();
    } catch (error) {
      console.error('Failed to fire staff:', error);
    }
  },

  acceptContract: async (contractId: number) => {
    console.log('Accept contract:', contractId);
  },

  completeContract: async (contractId: number) => {
    console.log('Complete contract:', contractId);
  },

  updateReputation: (location: Location, change: number) => {
    const state = get();
    const currentRep = state.reputation[location];
    if (currentRep) {
      const newScore = Math.max(0, Math.min(100, currentRep.score + change));
      set({
        reputation: {
          ...state.reputation,
          [location]: {
            ...currentRep,
            score: newScore
          }
        }
      });
    }
  },

  loadPlayerData: async () => {
    const state = get();
    if (!state.userId) return;

    try {
      const [settings, infrastructure, staff, reputationList, contracts] = await Promise.all([
        makeRequest('GET', `/api/player/settings/${state.userId}`).catch(() => null),
        makeRequest('GET', `/api/player/infrastructure/${state.userId}`).catch(() => []),
        makeRequest('GET', `/api/player/staff/${state.userId}`).catch(() => []),
        makeRequest('GET', `/api/player/reputation/${state.userId}`).catch(() => []),
        makeRequest('GET', `/api/player/contracts/${state.userId}`).catch(() => [])
      ]);

      // Convert reputation array to location-keyed object
      const reputation: Record<string, PlayerReputation> = {};
      reputationList.forEach((rep: PlayerReputation) => {
        reputation[rep.location] = rep;
      });

      set({
        playerSettings: settings,
        infrastructure,
        staff,
        reputation,
        contracts
      });

    } catch (error) {
      console.error('Failed to load player data:', error);
    }
  },
  
  // Modal state setters (missing implementations)
  setInfrastructureModalOpen: (isOpen: boolean) => {
    set({ isInfrastructureModalOpen: isOpen });
  },
  
  setStaffModalOpen: (isOpen: boolean) => {
    set({ isStaffModalOpen: isOpen });
  }
}));
