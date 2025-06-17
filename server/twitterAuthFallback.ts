// Fallback Twitter OAuth implementation using traditional passport strategy
import passport from 'passport';
import { Strategy as OAuth2Strategy } from 'passport-oauth2';
import { storage } from './db';

export function setupTwitterAuthFallback() {
  console.log('Setting up Twitter OAuth fallback strategy');
  
  const baseURL = process.env.NODE_ENV === 'production' 
    ? 'https://globaltradingtycoon.app'
    : process.env.REPLIT_DOMAINS 
      ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}` 
      : 'http://localhost:5000';

  passport.use('twitter-fallback', new OAuth2Strategy({
    authorizationURL: 'https://twitter.com/i/oauth2/authorize',
    tokenURL: 'https://api.twitter.com/2/oauth2/token',
    clientID: process.env.TWITTER_CONSUMER_KEY!,
    clientSecret: process.env.TWITTER_CONSUMER_SECRET!,
    callbackURL: `${baseURL}/auth/twitter/fallback/callback`,
    scope: ['tweet.read', 'users.read']
  },
  async (accessToken: string, refreshToken: string, profile: any, done: any) => {
    try {
      console.log('Twitter fallback OAuth callback - Access Token received:', !!accessToken);
      
      // Get user info from Twitter API v2
      const userResponse = await fetch('https://api.twitter.com/2/users/me?user.fields=id,name,username,profile_image_url', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!userResponse.ok) {
        const errorText = await userResponse.text();
        console.error(`Twitter API error: ${userResponse.status} - ${errorText}`);
        throw new Error(`Failed to fetch user data from Twitter: ${userResponse.status}`);
      }
      
      const userData = await userResponse.json();
      console.log('Twitter user data:', userData);
      const twitterUser = userData.data;
      
      // Check if user exists with this Twitter ID
      let user = await storage.getUserByProvider('twitter', twitterUser.id);
      console.log('Existing Twitter user found:', user ? `User ${user.id}` : 'Not found');
      
      if (user) {
        console.log('Returning existing Twitter user:', user.id);
        return done(null, user);
      }

      // Create new user
      const newUserData = {
        username: twitterUser.username || `twitter_${twitterUser.id}`,
        email: null,
        password: null,
        provider: 'twitter',
        providerId: twitterUser.id,
        displayName: twitterUser.name || twitterUser.username,
        avatar: twitterUser.profile_image_url || null
      };
      
      console.log('Creating new Twitter user:', newUserData);
      const newUser = await storage.createUser(newUserData);
      console.log('New Twitter user created:', newUser.id);

      return done(null, newUser);
    } catch (error) {
      console.error('Twitter fallback OAuth error:', error);
      return done(error);
    }
  }));
}