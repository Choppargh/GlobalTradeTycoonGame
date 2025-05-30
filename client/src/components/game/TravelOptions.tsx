import { useState } from 'react';
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

export function TravelOptions() {
  const { 
    currentLocation, 
    travel, 
    daysRemaining, 
    loanAmount, 
    inventory, 
    cash, 
    endGame,
    isEndGameConfirmationOpen,
    setEndGameConfirmationOpen 
  } = useGameStore();
  
  // Ensure currentLocation is treated as Location and not null
  if (!currentLocation) return null;
  const [showTravelDialog, setShowTravelDialog] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Location | null>(null);
  // For game challenges
  const [showChallengeResult, setShowChallengeResult] = useState(false);
  const [challengeMessage, setChallengeMessage] = useState("");
  // For end game dialog
  const [isEndGameDialogOpen, setIsEndGameDialogOpen] = useState(false);
  
  const handleTravelSelect = (location: Location) => {
    setSelectedDestination(location);
  };
  
  const handleTravelConfirm = () => {
    if (selectedDestination && selectedDestination !== currentLocation) {
      travel(selectedDestination);
      setShowTravelDialog(false);
      setSelectedDestination(null);
    }
  };
  
  // Filter out current location
  const availableLocations = Object.values(Location).filter(
    location => location !== currentLocation
  );
  
  const formatCurrency = (amount: number): string => {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

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
                onClick={() => {
                  console.log("Opening end game dialog");
                  setIsEndGameDialogOpen(true);
                }} 
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
              <Button 
                onClick={() => setShowTravelDialog(true)} 
                variant="default" 
                className="w-full justify-between bg-amber-500 hover:bg-amber-600 text-white"
              >
                <span className="flex items-center">
                  <PlaneIcon className="mr-2 h-4 w-4" />
                  Open Travel Map
                </span>
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
              
              <div className="mt-4 p-3 bg-muted/50 rounded-md text-sm hidden md:block">
                <p className="font-medium">Travel Information:</p>
                <p>• Each journey takes 1 day</p>
                <p>• Your loan of {formatCurrency(loanAmount)} will increase by 5% upon travel</p>
                <p>• Bank interest of 3% will be applied to your balance</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={showTravelDialog} onOpenChange={setShowTravelDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>Select Destination</DialogTitle>
            <DialogDescription>
              Choose where to travel next. Each journey costs 1 day and increases your loan by 5%. 
              Travel involves risks which could result in loss of cash or inventory.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="max-w-full overflow-x-hidden">
              <LocationMap 
                currentLocation={currentLocation} 
                onSelect={handleTravelSelect}
                interactive={true}
              />
            </div>
            
            {selectedDestination && (
              <div className="mt-4 p-3 bg-muted rounded-md">
                <p className="font-medium">Travel to {selectedDestination}</p>
                <p className="text-sm text-muted-foreground">
                  New loan amount after travel: {formatCurrency(Math.round(loanAmount * 1.05 * 100) / 100)}
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              onClick={() => setShowTravelDialog(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={handleTravelConfirm}
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
        onClose={() => setIsEndGameDialogOpen(false)}
        onConfirm={async () => {
          await endGame();
          // Don't manually close the dialog here as the endGame function
          // will handle the game state changes when successful
        }}
      />
    </>
  );
}
