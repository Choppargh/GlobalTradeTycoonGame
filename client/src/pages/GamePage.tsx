import React from 'react';
import { useGameStore } from '@/lib/stores/useGameStore';
import { GameHeader } from '@/components/game/GameHeader';
import { BuyTab } from '@/components/game/BuyTab';
import { SellTab } from '@/components/game/SellTab';
import { TravelOptions } from '@/components/game/TravelOptions';
import { BankInterface } from '@/components/game/BankInterface';
import { EventNotification } from '@/components/game/EventNotification';
import { TravelRiskNotification } from '@/components/game/TravelRiskNotification';
import { GameOver } from '@/components/game/GameOver';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

class GamePage extends React.Component {
  state = {
    activeTab: "buy",
    isAuthenticated: false,
    isLoading: true
  };

  async componentDidMount() {
    try {
      const response = await fetch('/auth/status');
      const data = await response.json();
      this.setState({
        isAuthenticated: Boolean(data.isAuthenticated && data.user),
        isLoading: false
      });
      
      // Try to load saved game if authenticated
      if (data.isAuthenticated && data.user) {
        const { loadGameState } = useGameStore.getState();
        loadGameState();
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      this.setState({
        isAuthenticated: false,
        isLoading: false
      });
    }
  }

  handleTabChange = (tab: string) => {
    this.setState({ activeTab: tab });
  };

  render() {
    const { activeTab, isAuthenticated, isLoading } = this.state;
    
    // Get game store state
    const gameStore = useGameStore.getState();
    const { 
      currentLocation, 
      currentEvent, 
      clearCurrentEvent, 
      isTravelRiskDialogOpen,
      travelRiskMessage,
      clearTravelRiskDialog,
      gamePhase
    } = gameStore;

    // Show loading while checking authentication
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700">Checking authentication...</h2>
          </div>
        </div>
      );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      window.location.replace('/');
      return null;
    }

    // Show Game Over screen when game is completed
    if (gamePhase === 'game-over') {
      return <GameOver />;
    }
    
    // Redirect to dashboard if no active game
    if (!currentLocation) {
      window.location.replace('/');
      return null;
    }

    return (
      <div className="min-h-screen p-2 sm:p-4 space-y-3 sm:space-y-4 pb-8 overflow-x-hidden scrollbar-hide"
        style={{
          backgroundImage: `url('/images/GTC_Background_Portrait.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Game Header with stats */}
        <GameHeader />
        
        {/* Main Game Grid - On smaller screens everything stacks */}
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {/* Travel Options or Game Completion - Full Width */}
          <div className="w-full">
            <TravelOptions />
          </div>
          
          {/* Buy and Sell Tabs - Tabbed on mobile, side-by-side on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            {/* Tabbed interface on mobile, hidden on desktop */}
            <div className="block lg:hidden w-full">
              <Tabs defaultValue="buy" value={activeTab} onValueChange={this.handleTabChange} className="w-full">
                <TabsList className="grid grid-cols-2 w-full bg-amber-50 border-b border-amber-200">
                  <TabsTrigger 
                    value="buy" 
                    className="text-base font-medium data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800 rounded-b-none"
                  >
                    Buy
                  </TabsTrigger>
                  <TabsTrigger 
                    value="sell" 
                    className="text-base font-medium data-[state=active]:bg-green-100 data-[state=active]:text-green-800 rounded-b-none"
                  >
                    Sell
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="buy" className="mt-0 pt-0 border border-amber-200 border-t-0 rounded-t-none">
                  <BuyTab />
                </TabsContent>
                <TabsContent value="sell" className="mt-0 pt-0 border border-amber-200 border-t-0 rounded-t-none">
                  <SellTab />
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Desktop layout - side by side, hidden on mobile */}
            <div className="hidden lg:block col-span-1">
              <BuyTab />
            </div>
            <div className="hidden lg:block col-span-1">
              <SellTab />
            </div>
          </div>
        </div>
        
        {/* Bank Modal (shows when needed) */}
        <BankInterface />
        
        {/* Random Event Notification */}
        <EventNotification 
          event={currentEvent} 
          onClose={clearCurrentEvent} 
        />
        
        {/* Travel Risk Notification */}
        <TravelRiskNotification
          isOpen={isTravelRiskDialogOpen}
          message={travelRiskMessage}
          onClose={clearTravelRiskDialog}
        />
      </div>
    );
  }
}

export default GamePage;