import React from 'react';

interface ConfirmEndGameDialogProps {
  isOpen: boolean;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmEndGameDialog({ isOpen, message, onCancel, onConfirm }: ConfirmEndGameDialogProps) {
  if (!isOpen) return null;

  // Using pure CSS/HTML dialog implementation
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onCancel} // Close when clicking overlay
    >
      <div 
        className="bg-white rounded-lg p-6 max-w-md w-[95%] shadow-xl"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside dialog
      >
        <h2 className="text-xl font-bold mb-4">End Game Confirmation</h2>
        <p className="mb-6 text-gray-700">{message}</p>
        
        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 transition-colors rounded-md"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 hover:bg-red-700 transition-colors text-white rounded-md"
            onClick={onConfirm}
          >
            End Game
          </button>
        </div>
      </div>
    </div>
  );
}