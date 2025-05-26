import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useGameStore } from '@/lib/stores/useGameStore';
import { calculateNetWorth } from '@/lib/gameLogic';
import { Leaderboard } from './Leaderboard';
import { apiRequest } from '@/lib/queryClient';
import { LeaderboardEntry } from '@/types/game';

export function GameOver() {
  const { username, cash, bankBalance, loanAmount, inventory, daysRemaining, restartGame } = useGameStore();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  
  const initialDays = 31;
  const daysPassed = initialDays - daysRemaining;
  const inventoryValue = inventory.reduce(
    (total, item) => total + (item.quantity * item.purchasePrice),
    0
  );
  const netWorth = calculateNetWorth(cash, bankBalance, inventory, loanAmount);
  
  useEffect(() => {
    // Submit score and fetch global leaderboard
    const submitScoreAndFetchLeaderboard = async () => {
      try {
        setLoading(true);
        
        // Save the username for future games
        localStorage.setItem('globalTradeTycoon_lastUsername', username || '');
        
        // Submit the score if not already submitted
        const scoreData = {
          username,
          score: bankBalance,
          days: daysPassed,
          endNetWorth: netWorth
        };
        
        // Submit the score (remove the localStorage check that was preventing multiple submissions)
        try {
          console.log('Submitting score:', scoreData);
          const submitResponse = await apiRequest('POST', '/api/scores', scoreData);
          if (submitResponse.ok) {
            console.log('Score submitted successfully');
          } else {
            console.error('Failed to submit score - server response:', submitResponse.status);
          }
        } catch (submitError) {
          console.error('Failed to submit score:', submitError);
        }
        
        // Fetch updated leaderboard
        const response = await apiRequest('GET', '/api/scores');
        const data = await response.json();
        
        // Store the leaderboard in localStorage as a backup
        localStorage.setItem('globalTradeTycoon_leaderboard', JSON.stringify(data));
        
        setLeaderboard(data);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
        
        // Try to load leaderboard from localStorage as fallback
        const storedLeaderboard = localStorage.getItem('globalTradeTycoon_leaderboard');
        if (storedLeaderboard) {
          try {
            setLeaderboard(JSON.parse(storedLeaderboard));
          } catch (e) {
            console.error('Failed to parse stored leaderboard:', e);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    
    submitScoreAndFetchLeaderboard();
  }, [username, bankBalance, daysPassed, netWorth]);
  
  const formatCurrency = (amount: number): string => {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };
  
  // Find the player's position in the leaderboard
  const playerRank = leaderboard.findIndex(entry => entry.username === username) + 1;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4"
      style={{
        backgroundImage: `url('/images/GTC_Background_Portrait.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Game Over</CardTitle>
          <CardDescription className="text-center">
            Your trading journey has ended after {daysPassed} days
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold">{username}</h2>
            <p className="text-4xl font-extrabold mt-2">
              {formatCurrency(netWorth)}
            </p>
            <p className="text-muted-foreground">Final Net Worth</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm font-medium">Cash</p>
              <p className="text-lg font-semibold">{formatCurrency(cash)}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Bank Balance</p>
              <p className="text-lg font-semibold">{formatCurrency(bankBalance)}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Inventory Value</p>
              <p className="text-lg font-semibold">{formatCurrency(inventoryValue)}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Outstanding Loan</p>
              <p className="text-lg font-semibold text-red-500">-{formatCurrency(loanAmount)}</p>
            </div>
          </div>
          
          {loading ? (
            <p className="text-center">Loading leaderboard...</p>
          ) : (
            <div className="space-y-2">
              <h3 className="font-semibold text-center">Leaderboard</h3>
              {playerRank > 0 && (
                <p className="text-center text-sm">
                  Your Rank: <span className="font-bold">{playerRank}</span> of {leaderboard.length}
                </p>
              )}
              <Leaderboard scores={leaderboard} currentUsername={username || ''} />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={restartGame} className="w-full max-w-xs">
            Play Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
