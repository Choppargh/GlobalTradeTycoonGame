import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useGameStore } from '@/lib/stores/useGameStore';
import { calculateNetWorth } from '@/lib/gameLogic';
import { Leaderboard } from './Leaderboard';
import { LeaderboardEntry } from '@/types/game';

interface GameOverState {
  scoreSubmitted: boolean;
  leaderboard: LeaderboardEntry[];
  isLoading: boolean;
  playerRank: number;
}

export class GameOver extends React.Component<{}, GameOverState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      scoreSubmitted: false,
      leaderboard: [],
      isLoading: true,
      playerRank: 0
    };
  }

  async componentDidMount() {
    await this.submitScore();
    await this.loadLeaderboard();
  }

  submitScore = async () => {
    if (this.state.scoreSubmitted) return;

    const gameStore = useGameStore.getState();
    const { username, cash, bankBalance, loanAmount, inventory, daysRemaining } = gameStore;
    
    const initialDays = 7;
    const daysPassed = initialDays - daysRemaining;
    const netWorth = calculateNetWorth(cash, bankBalance, inventory, loanAmount);

    try {
      // Save the username for future games
      localStorage.setItem('globalTradeTycoon_lastUsername', username || '');
      
      const scoreData = {
        username,
        score: bankBalance,
        days: daysPassed,
        endNetWorth: netWorth
      };
      
      console.log('Submitting score:', scoreData);
      
      const response = await fetch('/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scoreData),
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Score submitted successfully:', result);
        this.setState({ scoreSubmitted: true });
      } else {
        const errorText = await response.text();
        console.error('Failed to submit score:', response.status, errorText);
      }
    } catch (error) {
      console.error('Failed to submit score:', error);
    }
  };

  loadLeaderboard = async () => {
    try {
      const response = await fetch('/api/scores');
      if (response.ok) {
        const leaderboard = await response.json();
        const gameStore = useGameStore.getState();
        const playerRank = leaderboard.findIndex((entry: LeaderboardEntry) => entry.username === gameStore.username) + 1;
        
        this.setState({ 
          leaderboard, 
          isLoading: false,
          playerRank
        });
      } else {
        console.error('Failed to load leaderboard');
        this.setState({ isLoading: false });
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      this.setState({ isLoading: false });
    }
  };

  formatCurrency = (amount: number): string => {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  handlePlayAgain = () => {
    const { restartGame } = useGameStore.getState();
    restartGame();
    // Navigate back to dashboard
    window.location.href = '/';
  };

  render() {
    const { scoreSubmitted, leaderboard, isLoading, playerRank } = this.state;
    const gameStore = useGameStore.getState();
    const { username, cash, bankBalance, loanAmount, inventory, daysRemaining } = gameStore;
    
    const initialDays = 7;
    const daysPassed = initialDays - daysRemaining;
    const inventoryValue = inventory.reduce(
      (total, item) => total + (item.quantity * item.purchasePrice),
      0
    );
    const netWorth = calculateNetWorth(cash, bankBalance, inventory, loanAmount);

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
                {this.formatCurrency(netWorth)}
              </p>
              <p className="text-muted-foreground">Final Net Worth</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Cash</p>
                <p className="text-lg font-semibold">{this.formatCurrency(cash)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Bank Balance</p>
                <p className="text-lg font-semibold">{this.formatCurrency(bankBalance)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Inventory Value</p>
                <p className="text-lg font-semibold">{this.formatCurrency(inventoryValue)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Loan Amount</p>
                <p className="text-lg font-semibold text-red-600">{this.formatCurrency(loanAmount)}</p>
              </div>
            </div>

            {scoreSubmitted && playerRank > 0 && (
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-lg font-semibold text-green-800">
                  Congratulations! You ranked #{playerRank} on the leaderboard!
                </p>
              </div>
            )}
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">Global Leaderboard</h3>
              {isLoading ? (
                <div className="text-center py-4">Loading leaderboard...</div>
              ) : (
                <div className="max-h-64 overflow-y-auto">
                  <Leaderboard scores={leaderboard} />
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button 
              onClick={this.handlePlayAgain}
              className="flex-1"
              variant="outline"
            >
              Play Again
            </Button>
            <Button 
              onClick={() => window.location.href = '/'}
              className="flex-1"
            >
              Back to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
}