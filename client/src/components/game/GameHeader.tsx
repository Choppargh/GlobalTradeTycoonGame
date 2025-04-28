import { useGameStore } from '@/lib/stores/useGameStore';
import { calculateNetWorth } from '@/lib/gameLogic';
import { Button } from '@/components/ui/button';
import { 
  Banknote, 
  CalendarIcon, 
  CalculatorIcon,
  Clock 
} from 'lucide-react';

export function GameHeader() {
  const { 
    username, 
    cash, 
    bankBalance, 
    loanAmount, 
    daysRemaining, 
    inventory,
    currentLocation,
    setBankModalOpen,
    endGame 
  } = useGameStore();
  
  const netWorth = calculateNetWorth(cash, bankBalance, inventory, loanAmount);
  
  const formatCurrency = (amount: number): string => {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="bg-card shadow p-4 rounded-lg">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Trader</div>
            <div className="text-xl font-bold">{username}</div>
          </div>
          
          <div>
            <div className="text-sm font-medium text-muted-foreground">
              <CalendarIcon className="inline-block w-4 h-4 mr-1" />
              Days Left
            </div>
            <div className="text-xl font-bold">{daysRemaining}</div>
          </div>
          
          <div>
            <div className="text-sm font-medium text-muted-foreground">
              <CalculatorIcon className="inline-block w-4 h-4 mr-1" />
              Net Worth
            </div>
            <div className="text-xl font-bold">{formatCurrency(netWorth)}</div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
          <div 
            className="flex items-center justify-between p-3 bg-background rounded-md cursor-pointer hover:bg-muted/50"
            onClick={() => setBankModalOpen(true)}
          >
            <div>
              <div className="text-sm font-medium">
                <Banknote className="inline-block w-4 h-4 mr-1" />
                Cash
              </div>
              <div className="font-semibold">{formatCurrency(cash)}</div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setBankModalOpen(true)}>
              Bank
            </Button>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => {
                if (window.confirm("Are you sure you want to end the game now? Your final score will be calculated.")) {
                  endGame();
                }
              }}
            >
              <Clock className="mr-1 h-4 w-4" />
              End Game
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
