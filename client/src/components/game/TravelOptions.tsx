import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { useGameStore } from '@/lib/stores/useGameStore';
import { Location } from '@shared/schema';
import { LocationMap } from './LocationMap';
import { ArrowRightIcon, PlaneIcon } from 'lucide-react';
import { CustomEndGameDialog } from './CustomEndGameDialog';

interface TravelOptionsState {
  showTravelDialog: boolean;
  selectedDestination: Location | null;
  showChallengeResult: boolean;
  challengeMessage: string;
  isEndGameDialogOpen: boolean;
}

export class TravelOptions extends React.Component<{}, TravelOptionsState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      showTravelDialog: false,
      selectedDestination: null,
      showChallengeResult: false,
      challengeMessage: "",
      isEndGameDialogOpen: false
    };
  }

  handleTravelSelect = (location: Location) => {
    this.setState({ selectedDestination: location });
  };

  handleTravelConfirm = () => {
    const { selectedDestination } = this.state;
    if (selectedDestination) {
      const { travel } = useGameStore.getState();
      travel(selectedDestination);
      this.setState({ 
        showTravelDialog: false, 
        selectedDestination: null 
      });
    }
  };

  formatCurrency = (amount: number): string => {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  handleEndGameClick = () => {
    this.setState({ isEndGameDialogOpen: true });
  };

  handleEndGameConfirm = async () => {
    const { endGame } = useGameStore.getState();
    await endGame();
    this.setState({ isEndGameDialogOpen: false });
  };

  render() {
    const { showTravelDialog, selectedDestination, isEndGameDialogOpen } = this.state;
    
    const gameStore = useGameStore.getState();
    const { 
      currentLocation, 
      daysRemaining, 
      loanAmount, 
      inventory, 
      cash
    } = gameStore;

    // Ensure currentLocation is treated as Location and not null
    if (!currentLocation) return null;

    const availableLocations = Object.values(Location).filter(loc => loc !== currentLocation);
    const isInventoryFull = inventory.length >= 10;
    const canAffordTravel = cash >= 100; // Minimum cost estimate for travel

    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <PlaneIcon className="h-5 w-5" />
                Departures
              </span>
              <Button
                onClick={this.handleEndGameClick}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
              >
                End Game
              </Button>
            </CardTitle>
            <CardDescription>
              Select your next trading location. Each trip takes 1 day.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {daysRemaining <= 0 ? (
              <div className="text-center py-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Your Trading Journey is Complete!</h3>
                <p className="text-gray-600 mb-4">Time to see how you performed on the global market!</p>
                <Button 
                  onClick={this.handleEndGameClick}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size="lg"
                >
                  Submit Score
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  {availableLocations.map((location) => (
                    <Card 
                      key={location} 
                      className="cursor-pointer border-2 transition-all hover:border-purple-300 hover:shadow-md"
                      onClick={() => this.setState({ showTravelDialog: true, selectedDestination: location })}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{location}</h3>
                            <p className="text-sm text-muted-foreground">New market opportunities await</p>
                          </div>
                          <ArrowRightIcon className="h-5 w-5 text-purple-600" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {!canAffordTravel && (
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-md">
                    <p className="text-sm text-orange-800">
                      💰 You may need more cash for travel expenses and potential risks.
                    </p>
                  </div>
                )}

                {isInventoryFull && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-800">
                      📦 Your inventory is full. Consider selling items to make room for new opportunities.
                    </p>
                  </div>
                )}

                <div className="text-center">
                  <LocationMap currentLocation={currentLocation} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Travel Confirmation Dialog */}
        <Dialog open={showTravelDialog} onOpenChange={(open) => this.setState({ showTravelDialog: open })}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Travel</DialogTitle>
              <DialogDescription>
                Travel to {selectedDestination}? This will advance the game by 1 day.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Current Location:</span>
                  <span className="text-sm">{currentLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Destination:</span>
                  <span className="text-sm">{selectedDestination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Days Remaining:</span>
                  <span className="text-sm">{daysRemaining - 1}</span>
                </div>
              </div>

              {selectedDestination && (
                <div className="mt-4 p-3 bg-muted rounded-md">
                  <p className="font-medium">Travel to {selectedDestination}</p>
                  <p className="text-sm text-muted-foreground">
                    New loan amount after travel: {this.formatCurrency(Math.round(loanAmount * 1.05 * 100) / 100)}
                  </p>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button
                onClick={() => this.setState({ showTravelDialog: false })}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={this.handleTravelConfirm}
                className="bg-purple-600 hover:bg-purple-700 text-white"
                disabled={!selectedDestination || selectedDestination === currentLocation}
              >
                Confirm Travel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Custom End Game Dialog */}
        <CustomEndGameDialog
          isOpen={isEndGameDialogOpen}
          isLastDay={daysRemaining <= 1}
          onClose={() => this.setState({ isEndGameDialogOpen: false })}
          onConfirm={this.handleEndGameConfirm}
        />
      </>
    );
  }
}