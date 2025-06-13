import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useGameStore } from '@/lib/stores/useGameStore';

interface DisplayNameSetupProps {
  isOpen: boolean;
  onComplete: () => void;
  currentDisplayName: string;
}

export function DisplayNameSetup({ isOpen, onComplete, currentDisplayName }: DisplayNameSetupProps) {
  const [displayName, setDisplayName] = useState(currentDisplayName);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { updateDisplayName } = useAuth();
  const refreshUserInfo = useGameStore(state => state.refreshUserInfo);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!displayName.trim()) {
      setError('Display name is required');
      setIsSubmitting(false);
      return;
    }

    if (displayName.length < 2 || displayName.length > 50) {
      setError('Display name must be between 2 and 50 characters');
      setIsSubmitting(false);
      return;
    }

    const result = await updateDisplayName(displayName.trim());
    
    if (result.success) {
      // Refresh the game username after display name change
      await refreshUserInfo();
      onComplete();
    } else {
      // Show specific error messages for different validation failures
      if (result.error?.includes('already taken')) {
        setError('This trader name is already taken. Please choose a different one.');
      } else if (result.error?.includes('between 2 and 50 characters')) {
        setError('Trader name must be between 2 and 50 characters.');
      } else {
        setError(result.error || 'Failed to update trader name');
      }
    }
    
    setIsSubmitting(false);
  };

  const handleKeepCurrent = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Global Trade Tycoon!</h2>
          <p className="text-gray-600">Choose your trader name</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
              Trader Name
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="Enter your trader name"
              disabled={isSubmitting}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Updating...' : 'Update Trader Name'}
            </button>
            
            <button
              type="button"
              onClick={handleKeepCurrent}
              disabled={isSubmitting}
              className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Keep "{currentDisplayName}"
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}