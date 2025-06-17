import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import OAuth2Strategy from 'passport-oauth2';
import bcrypt from 'bcryptjs';
import { storage } from './db';
import type { User } from '@shared/schema';

// Configure Passport serialization
passport.serializeUser((user: any, done) => {
  console.log('=== PASSPORT SERIALIZE USER ===');
  console.log('Serializing user:', { id: user.id, email: user.email, provider: user.provider });
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  console.log('=== PASSPORT DESERIALIZE USER ===');
  console.log('Deserializing user ID:', id);
  try {
    const user = await storage.getUser(id);
    console.log('Retrieved user from database:', user ? { id: user.id, email: user.email } : 'User not found');
    done(null, user);
  } catch (error) {
    console.error('Error deserializing user:', error);
    done(error, null);
  }
});

// Local Strategy (Email/Password)
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email, password, done) => {
    try {
      const user = await storage.getUserByEmail(email.toLowerCase());
      
      if (!user) {
        return done(null, false, { message: 'No user found with this email' });
      }

      if (!user.password) {
        return done(null, false, { message: 'Please use social login for this account' });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return done(null, false, { message: 'Incorrect password' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

// OAuth Configuration - Common settings
const isProduction = process.env.NODE_ENV === 'production';

// Get environment-specific URL for all OAuth strategies
const baseURL = isProduction 
  ? 'https://globaltradingtycoon.app'
  : process.env.REPLIT_DOMAINS 
    ? `https://${process.env.REPLIT_DOMAINS}`
    : 'http://localhost:5000';

// Google OAuth Strategy - Configure dynamically based on environment

// Use deployment-provided secrets directly
const finalGoogleClientId = process.env.GOOGLE_CLIENT_ID;
const finalGoogleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (finalGoogleClientId && finalGoogleClientSecret) {
  console.log('Environment check:', {
    NODE_ENV: process.env.NODE_ENV,
    REPLIT_DOMAINS: process.env.REPLIT_DOMAINS,
    baseURL
  });
  console.log('Registering Google OAuth strategy with callback URL:', `${baseURL}/auth/google/callback`);
    
  passport.use(new GoogleStrategy({
    clientID: finalGoogleClientId,
    clientSecret: finalGoogleClientSecret,
    callbackURL: `${baseURL}/auth/google/callback`,
    scope: ['profile', 'email'],
    // prompt: 'select_account' // Not supported in this version
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('=== GOOGLE OAUTH CALLBACK START ===');
      console.log('Profile received:', JSON.stringify(profile, null, 2));
      console.log('Access token received:', !!accessToken);
      console.log('Profile ID:', profile.id);
      console.log('Profile emails:', profile.emails);
      console.log('Profile displayName:', profile.displayName);
      
      // Check if user exists with this Google ID
      let user = await storage.getUserByProvider('google', profile.id);
      console.log('Existing user with Google ID:', user ? `Found user ${user.id}` : 'Not found');
      
      if (user) {
        console.log('Returning existing user:', user.id);
        return done(null, user);
      }

      // Check if user exists with this email
      const email = profile.emails?.[0]?.value;
      console.log('Email from profile:', email);
      
      if (email) {
        user = await storage.getUserByEmail(email);
        console.log('Existing user with email:', user ? `Found user ${user.id}` : 'Not found');
        
        if (user) {
          console.log('Linking Google account to existing user:', user.id);
          return done(null, user);
        }
      }

      // Create new user with unique username
      console.log('Creating new Google user...');
      let username = profile.displayName || `google_${profile.id}`;
      
      // Check if username already exists and make it unique
      let existingUser = await storage.getUserByUsername(username);
      let counter = 1;
      while (existingUser) {
        username = `${profile.displayName || `google_${profile.id}`}_${counter}`;
        existingUser = await storage.getUserByUsername(username);
        counter++;
      }
      
      const newUserData = {
        username: username,
        email: email || null,
        password: null, // No password for OAuth users
        provider: 'google',
        providerId: profile.id,
        displayName: profile.displayName || null,
        avatar: profile.photos?.[0]?.value || null
      };
      console.log('New user data with unique username:', newUserData);
      
      const newUser = await storage.createUser(newUserData);
      console.log('Created new user:', newUser.id);
      console.log('=== GOOGLE OAUTH CALLBACK END ===');

      return done(null, newUser);
    } catch (error) {
      console.error('=== GOOGLE OAUTH ERROR ===');
      console.error('Error in Google OAuth callback:', error);
      console.error('Error stack:', (error as Error).stack);
      return done(error as Error);
    }
  }));
}

// Facebook OAuth Strategy
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  const baseURL = process.env.REPLIT_DOMAINS 
    ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}` 
    : (process.env.NODE_ENV === 'production' 
        ? 'https://globaltradingtycoon.app' 
        : 'http://localhost:5000');
    
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${baseURL}/auth/facebook/callback`,
    profileFields: ['id', 'emails', 'name', 'picture']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists with this Facebook ID
      let user = await storage.getUserByProvider('facebook', profile.id);
      
      if (user) {
        return done(null, user);
      }

      // Check if user exists with this email
      const email = profile.emails?.[0]?.value;
      if (email) {
        user = await storage.getUserByEmail(email);
        if (user) {
          return done(null, user);
        }
      }

      // Create new user
      const displayName = `${profile.name?.givenName || ''} ${profile.name?.familyName || ''}`.trim();
      const newUser = await storage.createUser({
        username: displayName || `facebook_${profile.id}`,
        email: email || null,
        password: null,
        provider: 'facebook',
        providerId: profile.id,
        displayName: displayName || null,
        avatar: profile.photos?.[0]?.value || null
      });

      return done(null, newUser);
    } catch (error) {
      return done(error);
    }
  }));
}

// Function to configure Twitter OAuth strategy (called after env vars are loaded)
export function configureTwitterAuth() {
  console.log('Configuring Twitter OAuth strategy...');
  console.log('Twitter OAuth check:', {
    hasKey: !!process.env.TWITTER_CONSUMER_KEY,
    hasSecret: !!process.env.TWITTER_CONSUMER_SECRET,
    baseURL: baseURL
  });

  // Use deployment-provided secrets directly
  if (process.env.TWITTER_CONSUMER_KEY && process.env.TWITTER_CONSUMER_SECRET) {
    console.log('Registering Twitter OAuth strategy with callback URL:', `${baseURL}/auth/twitter/callback`);
    
  passport.use('twitter', new OAuth2Strategy({
    authorizationURL: 'https://twitter.com/i/oauth2/authorize',
    tokenURL: 'https://api.twitter.com/2/oauth2/token',
    clientID: process.env.TWITTER_CONSUMER_KEY,
    clientSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: `${baseURL}/auth/twitter/callback`,
    scope: ['tweet.read', 'users.read'],
    scopeSeparator: ' '
  },
  async (accessToken: string, refreshToken: string, profile: any, done: any) => {
    try {
      console.log('Twitter OAuth callback - Access Token received:', !!accessToken);
      
      // Fetch user data from Twitter API using access token
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

      // Create new user (Twitter OAuth 2.0 doesn't provide email by default)
      const newUserData = {
        username: twitterUser.username || `twitter_${twitterUser.id}`,
        email: null, // Twitter OAuth 2.0 requires special permissions for email
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
      console.error('Twitter OAuth error:', error);
      return done(error);
    }
  }));
  } else {
    console.log('Twitter OAuth not configured - missing environment variables');
  }
}

export default passport;