import React from 'react';

interface EndGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

export default function EndGameModal({ isOpen, onClose, onConfirm, message }: EndGameModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" 
      onClick={onClose} // Close when clicking outside
    >
      <div 
        className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <h3 className="text-lg font-bold mb-4">End Game Confirmation</h3>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button 
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            End Game
          </button>
        </div>
      </div>
    </div>
  );
}