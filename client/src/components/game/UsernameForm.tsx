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
    <form onSubmit={handleSubmit} className="w-full">
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
      </div>
      
      <div className="mt-4">
        <Button 
          type="submit" 
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          Start Trading
        </Button>
      </div>
    </form>
  );
}
