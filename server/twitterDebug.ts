// Twitter OAuth debugging and testing utilities
export function debugTwitterOAuth() {
  console.log('=== TWITTER OAUTH DEBUG ===');
  console.log('Environment Variables:');
  console.log('- TWITTER_CONSUMER_KEY exists:', !!process.env.TWITTER_CONSUMER_KEY);
  console.log('- TWITTER_CONSUMER_SECRET exists:', !!process.env.TWITTER_CONSUMER_SECRET);
  console.log('- NODE_ENV:', process.env.NODE_ENV);
  console.log('- REPLIT_DOMAINS:', process.env.REPLIT_DOMAINS);
  
  const baseURL = process.env.NODE_ENV === 'production' 
    ? 'https://globaltradingtycoon.app'
    : process.env.REPLIT_DOMAINS 
      ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}` 
      : 'http://localhost:5000';
      
  console.log('- Base URL:', baseURL);
  console.log('- Twitter callback URL:', `${baseURL}/auth/twitter/callback`);
  console.log('- Twitter fallback callback URL:', `${baseURL}/auth/twitter/fallback/callback`);
  console.log('=== END TWITTER OAUTH DEBUG ===');
}

export function validateTwitterCredentials(): boolean {
  const hasKey = !!process.env.TWITTER_CONSUMER_KEY;
  const hasSecret = !!process.env.TWITTER_CONSUMER_SECRET;
  
  if (!hasKey) {
    console.error('TWITTER_CONSUMER_KEY is missing');
  }
  
  if (!hasSecret) {
    console.error('TWITTER_CONSUMER_SECRET is missing');
  }
  
  return hasKey && hasSecret;
}