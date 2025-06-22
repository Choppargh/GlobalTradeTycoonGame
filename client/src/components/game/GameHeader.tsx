import React, { useState } from 'react';
import { useGameStore } from '@/lib/stores/useGameStore';
import { calculateNetWorth } from '@/lib/gameLogic';
import { Button } from '@/components/ui/button';
import { 
  Banknote, 
  CalendarIcon, 
  CalculatorIcon,
  Clock,
  Building2,
  Users,
  Menu
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    setInfrastructureModalOpen,
    setStaffModalOpen,
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
      <div className="w-full px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Trader Info */}
          <div className="flex items-center">
            <img 
              src="/images/GTC_Logo-512x512.png" 
              alt="Global Trade Tycoon" 
              className="w-12 h-12 mr-3"
            />
            <div>
              <div className="text-sm text-gray-600">Trader</div>
              <div className="text-xl font-bold">{username}</div>
              <div className="text-sm text-gray-600">Location: <span className="font-semibold">{currentLocation}</span></div>
            </div>
          </div>
          
          {/* Center: Game Stats */}
          <div className="flex gap-12">
            <div className="text-center px-4">
              <div className="flex items-center justify-center text-sm text-gray-600 mb-2">
                <CalendarIcon className="w-4 h-4 mr-1" />
                Days Left
              </div>
              <div className="text-2xl font-bold">{daysRemaining}</div>
            </div>
            
            <div className="text-center px-4">
              <div className="flex items-center justify-center text-sm text-gray-600 mb-2">
                <CalculatorIcon className="w-4 h-4 mr-1" />
                Net Worth
              </div>
              <div className="text-2xl font-bold">{formatCurrency(netWorth)}</div>
            </div>
            
            <div className="text-center px-4">
              <div className="flex items-center justify-center text-sm text-gray-600 mb-2">
                <Banknote className="w-4 h-4 mr-1" />
                Cash
              </div>
              <div className="text-2xl font-bold">{formatCurrency(cash)}</div>
            </div>
          </div>
          
          {/* Right: Action Buttons */}
          <div className="flex flex-col gap-2">
            {/* Desktop View */}
            <div className="hidden md:flex flex-col gap-2">
              <div className="flex gap-2">
                <Button variant="default" size="sm" className="bg-purple-600 hover:bg-purple-700 text-white rounded-2xl" onClick={() => setInfrastructureModalOpen(true)}>
                  <Building2 className="mr-1 h-4 w-4" />
                  Infrastructure
                </Button>
                <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl" onClick={() => setStaffModalOpen(true)}>
                  <Users className="mr-1 h-4 w-4" />
                  Staff
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700 text-white rounded-2xl" onClick={() => setBankModalOpen(true)}>
                  <Banknote className="mr-1 h-4 w-4" />
                  Bank
                </Button>
                {daysRemaining <= 1 ? (
                  <Button 
                    variant="default" 
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white rounded-2xl"
                    onClick={handleEndGameClick}
                  >
                    <Clock className="mr-1 h-4 w-4" />
                    I'm Finished
                  </Button>
                ) : (
                  <Button 
                    variant="default" 
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white rounded-2xl"
                    onClick={handleEndGameClick}
                  >
                    <Clock className="mr-1 h-4 w-4" />
                    End Game
                  </Button>
                )}
              </div>
            </div>

            {/* Mobile View */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="default" size="sm" className="bg-gray-600 hover:bg-gray-700 text-white rounded-2xl">
                    <Menu className="mr-1 h-4 w-4" />
                    Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setInfrastructureModalOpen(true)}>
                    <Building2 className="mr-2 h-4 w-4" />
                    Infrastructure
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStaffModalOpen(true)}>
                    <Users className="mr-2 h-4 w-4" />
                    Staff
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setBankModalOpen(true)}>
                    <Banknote className="mr-2 h-4 w-4" />
                    Bank
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleEndGameClick}>
                    <Clock className="mr-2 h-4 w-4" />
                    {daysRemaining <= 1 ? "I'm Finished" : "End Game"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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