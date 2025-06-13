import React, { useState } from 'react';
import { useGameStore } from '@/lib/stores/useGameStore';
import { calculateNetWorth } from '@/lib/gameLogic';
import { Button } from '@/components/ui/button';
import { 
  Banknote, 
  CalendarIcon, 
  CalculatorIcon,
  Clock
} from 'lucide-react';
import { CustomEndGameDialog } from './CustomEndGameDialog';

export function GameHeader() {
  const [isEndGameDialogOpen, setIsEndGameDialogOpen] = useState(false);
  
  const { 
    username, 
    cash, 
    bankBalance, 
    loanAmount, 
    daysRemaining, 
    inventory,
    currentLocation,
    setBankModalOpen,
    endGame,
  } = useGameStore();
  
  // Calculate net worth
  const netWorth = calculateNetWorth(cash, bankBalance, inventory, loanAmount);
  
  // Format currency for display
  const formatCurrency = (amount: number): string => {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };
  
  // Handle end game button click
  const handleEndGameClick = () => {
    setIsEndGameDialogOpen(true);
  };
  
  // Handle end game confirmation
  const handleEndGameConfirm = async () => {
    await endGame();
    // Dialog will be closed by the endGame function when successful
  };
  
  // Handle end game cancellation
  const handleEndGameCancel = () => {
    setIsEndGameDialogOpen(false);
  };

  return (
    <div className="bg-amber-50 border-b border-gray-200 shadow-sm">
      <div className="w-full px-2 py-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex">
            <div className="flex items-center mr-4">
              <img 
                src="/images/GTC_Logo-512x512.png" 
                alt="Global Trade Tycoon" 
                className="w-12 h-12 mr-2"
              />
              <div>
                <div className="text-lg font-bold">Trader</div>
                <div className="text-3xl font-bold">{username}</div>
              </div>
            </div>
            <div className="border-l border-gray-300 pl-6">
              <div className="text-lg font-bold">Location</div>
              <div className="text-3xl font-bold">{currentLocation}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <CalendarIcon className="w-4 h-4 mr-1" />
                Days Left
              </div>
              <div className="text-2xl font-bold">{daysRemaining}</div>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <CalculatorIcon className="w-4 h-4 mr-1" />
                Net Worth
              </div>
              <div className="text-2xl font-bold">{formatCurrency(netWorth)}</div>
            </div>
            
            <div 
              className="flex items-center justify-between p-3 bg-background rounded-md cursor-pointer hover:bg-muted/50"
              onClick={() => setBankModalOpen(true)}
            >
              <div className="pr-4">
                <div className="text-sm font-medium">
                  <Banknote className="inline-block w-4 h-4 mr-1" />
                  Cash
                </div>
                <div className="font-semibold">{formatCurrency(cash)}</div>
              </div>
              <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700 text-white ml-2" onClick={() => setBankModalOpen(true)}>
                Bank
              </Button>
            </div>
            
            <div className="flex items-center space-x-4">
              {daysRemaining <= 1 ? (
                <Button 
                  variant="default" 
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleEndGameClick}
                >
                  <Clock className="mr-1 h-4 w-4" />
                  I'm Finished
                </Button>
              ) : (
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={handleEndGameClick}
                >
                  <Clock className="mr-1 h-4 w-4" />
                  End Game
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom End Game Dialog */}
      <CustomEndGameDialog
        isOpen={isEndGameDialogOpen}
        isLastDay={daysRemaining <= 1}
        onClose={handleEndGameCancel}
        onConfirm={handleEndGameConfirm}
      />
    </div>
  );
}