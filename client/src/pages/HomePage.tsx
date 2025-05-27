import { useGameStore } from '@/lib/stores/useGameStore';
import GamePage from './GamePage';
import { GameOver } from '@/components/game/GameOver';
import { WelcomeScreen } from '@/components/game/WelcomeScreen';
import { ResumeGamePrompt } from '@/components/game/ResumeGamePrompt';
import { CustomInstallPrompt } from '@/components/game/CustomInstallPrompt';

export default function HomePage() {
  const { gamePhase } = useGameStore();
  
  return (
    <div className="min-h-screen">
      {/* Temporarily disabled resume game prompt to fix authentication */}
      {/* <ResumeGamePrompt /> */}
      
      {/* Custom PWA install prompt with proper styling */}
      <CustomInstallPrompt />
      
      {gamePhase === 'intro' && <WelcomeScreen />}
      {gamePhase === 'playing' && <GamePage />}
      {gamePhase === 'game-over' && <GameOver />}
    </div>
  );
}
