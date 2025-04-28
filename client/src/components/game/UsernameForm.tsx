import { useState } from 'react';
import { useGameStore } from '@/lib/stores/useGameStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export function UsernameForm() {
  const [inputUsername, setInputUsername] = useState('');
  const [error, setError] = useState('');
  const { setUsername, startGame } = useGameStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate username
    if (!inputUsername.trim()) {
      setError('Please enter a username');
      return;
    }
    
    if (inputUsername.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    
    setError('');
    setUsername(inputUsername);
    startGame();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Global Trade Tycoon</CardTitle>
          <CardDescription className="text-center">
            Enter your name to start trading across the world!
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="username"
                  placeholder="Enter your trader name"
                  value={inputUsername}
                  onChange={(e) => setInputUsername(e.target.value)}
                  className="text-lg"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">Game Rules:</h3>
                <ul className="text-sm space-y-1 list-disc pl-5">
                  <li>You'll start with a $2,000 loan and trade for 31 days</li>
                  <li>Travel between 7 continents to buy and sell products</li>
                  <li>Each travel costs 1 day and increases your loan by 5%</li>
                  <li>Your goal is to maximize your net worth by the end</li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">Start Trading</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
