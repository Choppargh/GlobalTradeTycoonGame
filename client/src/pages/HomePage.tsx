import { useGameStore } from '@/lib/stores/useGameStore';
import GamePage from './GamePage';
import { GameOver } from '@/components/game/GameOver';
import { WelcomeScreen } from '@/components/game/WelcomeScreen';
import { Logo } from '@/components/ui/logo';

export default function HomePage() {
  const { gamePhase } = useGameStore();
  
  return (
    <div className="min-h-screen">
      {gamePhase === 'intro' && <WelcomeScreen />}
      {gamePhase === 'playing' && (
        <>
          <Logo />
          <GamePage />
        </>
      )}
      {gamePhase === 'game-over' && (
        <>
          <Logo />
          <GameOver />
        </>
      )}
    </div>
  );
}
