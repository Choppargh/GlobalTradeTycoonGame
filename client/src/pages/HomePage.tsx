import { useGameStore } from '@/lib/stores/useGameStore';
import GamePage from './GamePage';
import { GameOver } from '@/components/game/GameOver';
import { WelcomeScreen } from '@/components/game/WelcomeScreen';
import { ResumeGamePrompt } from '@/components/game/ResumeGamePrompt';
import { InstallPrompt } from '@/components/game/InstallPrompt';

export default function HomePage() {
  const { gamePhase } = useGameStore();
  
  return (
    <div className="min-h-screen">
      {/* Show resume game prompt on any page */}
      <ResumeGamePrompt />
      
      {/* Custom PWA install prompt with proper styling */}
      <InstallPrompt />
      
      {gamePhase === 'intro' && <WelcomeScreen />}
      {gamePhase === 'playing' && <GamePage />}
      {gamePhase === 'game-over' && <GameOver />}
    </div>
  );
}
