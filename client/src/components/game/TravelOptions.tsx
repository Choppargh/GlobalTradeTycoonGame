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
      const gameStore = useGameStore.getState();
      const { travel, currentLocation } = gameStore;
      
      if (selectedDestination !== currentLocation) {
        travel(selectedDestination);
        this.setState({ 
          showTravelDialog: false, 
          selectedDestination: null 
        });
      }
    }
  };

  formatCurrency = (amount: number): string => {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  handleEndGameClick = () => {
    console.log("Opening end game dialog");
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

    // Filter out current location
    const availableLocations = Object.values(Location).filter(
      location => location !== currentLocation
    );

    return (
      <>
        <Card className="h-full shadow-sm rounded-lg border border-black">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Departures</CardTitle>
                <CardDescription>
                  Travel to new markets (costs 1 day)
                </CardDescription>
              </div>
              {daysRemaining > 1 && (
                <Button
                  onClick={this.handleEndGameClick}
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                >
                  End Game
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="grid gap-2">
            {daysRemaining <= 1 ? (
              // Show "I'm Finished" button on the last day
              <>
                <Button 
                  onClick={this.handleEndGameClick}
                  variant="default" 
                  className="w-full justify-between bg-green-600 hover:bg-green-700 text-white"
                >
                  <span className="flex items-center">
                    I'm Finished
                  </span>
                  <ArrowRightIcon className="h-4 w-4" />
                </Button>
                <p className="text-sm text-green-600 mt-2">
                  Click to end the game and submit your score!
                </p>
              </>
            ) : (
              // Show travel options when not on the last day
              <>
                {availableLocations.map((location) => (
                  <Button
                    key={location}
                    onClick={() => this.setState({ 
                      showTravelDialog: true, 
                      selectedDestination: location 
                    })}
                    variant="outline"
                    className="w-full justify-between hover:bg-purple-50 hover:border-purple-300"
                  >
                    <span>{location}</span>
                    <ArrowRightIcon className="h-4 w-4" />
                  </Button>
                ))}
                <div className="mt-4">
                  <LocationMap currentLocation={currentLocation} />
                </div>
              </>
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