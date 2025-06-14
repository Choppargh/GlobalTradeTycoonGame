import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as TwitterStrategy } from 'passport-twitter';
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

// Google OAuth Strategy - Configure dynamically based on environment
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  // Always use production domain for OAuth to avoid Google Console configuration issues
  // Development environments will redirect to production for OAuth, then back to dev
  const baseURL = process.env.NODE_ENV === 'production' || process.env.REPLIT_DOMAINS
    ? 'https://globaltradingtycoon.app'
    : 'http://localhost:5000';
  
  console.log('Environment check:', {
    NODE_ENV: process.env.NODE_ENV,
    REPLIT_DOMAINS: process.env.REPLIT_DOMAINS,
    baseURL
  });
  console.log('Registering Google OAuth strategy with callback URL:', `${baseURL}/auth/google/callback`);
    
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${baseURL}/auth/google/callback`
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

      // Create new user
      console.log('Creating new Google user...');
      const newUserData = {
        username: profile.displayName || `google_${profile.id}`,
        email: email || null,
        password: null, // No password for OAuth users
        provider: 'google',
        providerId: profile.id,
        displayName: profile.displayName || null,
        avatar: profile.photos?.[0]?.value || null
      };
      console.log('New user data:', newUserData);
      
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

// Twitter OAuth Strategy - Use hardcoded credentials
const twitterConsumerKey = 'SGVOX05hODNtcWgyMV9rd1JweW86MTpjaQ';
const twitterConsumerSecret = 'SPU5151LaUzZbbGW95iAFyyHIZbt_VGzGW1TQyurxxlhZTCapT';

if (twitterConsumerKey && twitterConsumerSecret) {
  console.log('Registering Twitter OAuth strategy...');
  const baseURL = process.env.REPLIT_DOMAINS 
    ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}` 
    : (process.env.NODE_ENV === 'production' 
        ? 'https://globaltradingtycoon.app' 
        : 'http://localhost:5000');
    
  passport.use(new TwitterStrategy({
    consumerKey: twitterConsumerKey,
    consumerSecret: twitterConsumerSecret,
    callbackURL: `${baseURL}/auth/twitter/callback`,
    includeEmail: true
  },
  async (token, tokenSecret, profile, done) => {
    try {
      // Check if user exists with this Twitter ID
      let user = await storage.getUserByProvider('twitter', profile.id);
      
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
      const newUser = await storage.createUser({
        username: profile.displayName || profile.username || `twitter_${profile.id}`,
        email: email || null,
        password: null,
        provider: 'twitter',
        providerId: profile.id,
        displayName: profile.displayName || null,
        avatar: profile.photos?.[0]?.value || null
      });

      return done(null, newUser);
    } catch (error) {
      return done(error);
    }
  }));
}

export default passport;