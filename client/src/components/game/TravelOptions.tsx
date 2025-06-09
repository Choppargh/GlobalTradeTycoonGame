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
  isEndGameDialogOpen: boolean;
}

export class TravelOptions extends React.Component<{}, TravelOptionsState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      showTravelDialog: false,
      selectedDestination: null,
      isEndGameDialogOpen: false
    };
  }

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
      daysRemaining
    } = gameStore;

    if (!currentLocation) return null;

    return (
      <>
        <Card className="h-full shadow-sm rounded-lg border border-black">
          <CardHeader className="pb-3">
            <CardTitle>Departures</CardTitle>
            <CardDescription>
              Travel to new markets (costs 1 day)
            </CardDescription>
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
              // Show "Open Travel Map" button when not on the last day
              <Button
                onClick={() => this.setState({ showTravelDialog: true })}
                className="w-full justify-between bg-orange-500 hover:bg-orange-600 text-white"
              >
                <span className="flex items-center gap-2">
                  <PlaneIcon className="h-4 w-4" />
                  Open Travel Map
                </span>
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Travel Map Dialog */}
        <Dialog open={showTravelDialog} onOpenChange={(open) => this.setState({ showTravelDialog: open, selectedDestination: null })}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Select Destination</DialogTitle>
              <DialogDescription>
                Choose where to travel next. Each journey costs 1 day and increases your loan by 5%. Travel involves risks which could result in loss of cash or inventory.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <LocationMap 
                  currentLocation={currentLocation} 
                  onLocationSelect={(location) => this.setState({ selectedDestination: location })}
                  selectedLocation={selectedDestination}
                />
              </div>
              
              <div className="text-center text-sm text-gray-600">
                Current: {currentLocation} | Click a location to travel
              </div>
            </div>
            
            <DialogFooter className="flex gap-2">
              <Button
                onClick={() => this.setState({ showTravelDialog: false, selectedDestination: null })}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={this.handleTravelConfirm}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
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