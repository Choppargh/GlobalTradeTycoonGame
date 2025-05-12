import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface EndGameConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  daysRemaining: number;
}

export function EndGameConfirmation({ isOpen, onClose, onConfirm, daysRemaining }: EndGameConfirmationProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white shadow-lg rounded-lg border border-gray-200 p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl font-bold">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
            End Game Confirmation
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            {daysRemaining <= 1 
              ? "Are you ready to finish the game and see your final score?"
              : "Are you sure you want to end the game early? Your score will not be at its maximum potential if you end now."}
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="mt-6 flex space-x-2 justify-end">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant={daysRemaining <= 1 ? "default" : "destructive"}
            className={daysRemaining <= 1 ? "bg-green-600 hover:bg-green-700" : ""}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            End Game
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}