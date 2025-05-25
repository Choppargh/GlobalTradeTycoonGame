import { storage } from './db';

// Weekly reset scheduler - runs every Monday at 00:01
export function startWeeklyResetScheduler() {
  const now = new Date();
  
  // Calculate next Monday at 00:01
  function getNextMonday(): Date {
    const nextMonday = new Date();
    nextMonday.setDate(now.getDate() + (1 + 7 - now.getDay()) % 7);
    nextMonday.setHours(0, 1, 0, 0); // 00:01:00
    
    // If it's already past Monday 00:01 this week, get next Monday
    if (nextMonday <= now) {
      nextMonday.setDate(nextMonday.getDate() + 7);
    }
    
    return nextMonday;
  }

  function scheduleReset() {
    const nextReset = getNextMonday();
    const timeUntilReset = nextReset.getTime() - Date.now();
    
    console.log(`Next leaderboard reset scheduled for: ${nextReset.toISOString()}`);
    
    setTimeout(async () => {
      try {
        await storage.resetWeeklyScores();
        console.log('Weekly leaderboard reset completed successfully');
        
        // Schedule the next reset
        scheduleReset();
      } catch (error) {
        console.error('Error during weekly reset:', error);
        // Try again in 1 hour if there's an error
        setTimeout(scheduleReset, 60 * 60 * 1000);
      }
    }, timeUntilReset);
  }

  scheduleReset();
}