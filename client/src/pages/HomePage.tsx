import { useGameStore } from '@/lib/stores/useGameStore';
import GamePage from './GamePage';
import { GameOver } from '@/components/game/GameOver';
import { WelcomeScreen } from '@/components/game/WelcomeScreen';
import { ResumeGamePrompt } from '@/components/game/ResumeGamePrompt';

export default function HomePage() {
  const { gamePhase } = useGameStore();
  
  return (
    <div className="min-h-screen">
      {/* Show resume game prompt on any page */}
      <ResumeGamePrompt />
      
      {gamePhase === 'intro' && <WelcomeScreen />}
      {gamePhase === 'playing' && <GamePage />}
      {gamePhase === 'game-over' && <GameOver />}
    </div>
  );
}
