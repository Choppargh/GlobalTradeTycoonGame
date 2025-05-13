import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

interface EndGameConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  daysRemaining: number;
}

export function EndGameConfirmation({ isOpen, onClose, onConfirm, daysRemaining }: EndGameConfirmationProps) {
  const isLastDay = daysRemaining <= 1;
  
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isLastDay ? "Finish Game" : "End Game Early"}
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            {isLastDay 
              ? "Are you ready to finish the game and see your final score?" 
              : "Are you sure you want to end the game early? Your score will not be at its maximum potential if you end now."
            }
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex justify-end space-x-2 mt-4">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className={isLastDay ? "bg-green-600 hover:bg-green-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"}
            onClick={handleConfirm}
          >
            {isLastDay ? "Submit Score" : "End Game"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}