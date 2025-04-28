import { UsernameForm } from '@/components/game/UsernameForm';
import { useGameStore } from '@/lib/stores/useGameStore';
import GamePage from './GamePage';
import { GameOver } from '@/components/game/GameOver';

export default function HomePage() {
  const { gamePhase } = useGameStore();
  
  return (
    <div className="min-h-screen">
      {gamePhase === 'intro' && <UsernameForm />}
      {gamePhase === 'playing' && <GamePage />}
      {gamePhase === 'game-over' && <GameOver />}
    </div>
  );
}
