import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

interface CustomEndGameDialogProps {
  isOpen: boolean;
  isLastDay: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function CustomEndGameDialog({ isOpen, isLastDay, onClose, onConfirm }: CustomEndGameDialogProps) {
  if (!isOpen) return null;

  const message = isLastDay 
    ? "Are you ready to finish the game and submit your final score?"
    : "Are you sure? All progress will be lost and you will return to the dashboard.";

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      style={{ backdropFilter: 'blur(2px)' }}
    >
      <div className="bg-white rounded-lg p-6 max-w-md w-[95%] shadow-xl">
        <h2 className="text-xl font-bold mb-4">
          {isLastDay ? "Finish Game" : "End Game"}
        </h2>
        
        <p className="mb-6 text-gray-700">{message}</p>
        
        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          
          <Button
            variant={isLastDay ? "default" : "destructive"}
            className={isLastDay ? "bg-green-600 hover:bg-green-700" : ""}
            onClick={onConfirm}
          >
            {isLastDay ? "Submit Score" : "End Game"}
          </Button>
        </div>
      </div>
    </div>
  );
}