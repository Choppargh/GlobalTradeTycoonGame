import { useState, useEffect } from 'react';
import { useGameStore } from '@/lib/stores/useGameStore';
import { loadGameState } from '@/lib/autoSave';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

export function ResumeGamePrompt() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasSavedGame, setHasSavedGame] = useState(false);
  const { loadGameState: loadGame } = useGameStore();
  
  // Check for saved game on component mount
  useEffect(() => {
    const result = loadGameState();
    if (result.success && result.savedState) {
      setHasSavedGame(true);
      setIsOpen(true);
    }
  }, []);
  
  // Handle resume game
  const handleResumeGame = () => {
    loadGame();
    setIsOpen(false);
  };
  
  // Handle start new game
  const handleNewGame = () => {
    setIsOpen(false);
  };
  
  return (
    <Dialog open={isOpen && hasSavedGame} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Resume Game?</DialogTitle>
          <DialogDescription>
            We found a saved game. Would you like to resume where you left off or start a new game?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button 
            variant="outline" 
            onClick={handleNewGame}
            className="border-2 border-gray-300 hover:bg-gray-100"
          >
            New Game
          </Button>
          <Button 
            onClick={handleResumeGame}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Resume Game
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}