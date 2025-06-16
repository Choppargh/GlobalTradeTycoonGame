import { config } from 'dotenv';
import path from 'path';

// Load environment-specific configuration
export function loadEnvironmentConfig() {
  const nodeEnv = process.env.NODE_ENV || 'development';
  
  // Always load common variables first
  config({ path: path.resolve('.env.common') });
  
  // Load environment-specific variables
  if (nodeEnv === 'production') {
    config({ path: path.resolve('.env.production') });
  } else {
    config({ path: path.resolve('.env.development') });
  }
  
  // Load base .env file last (for backwards compatibility and overrides)
  config({ path: path.resolve('.env') });
  
  console.log(`Environment configuration loaded for: ${nodeEnv}`);
}

// Get environment-specific OAuth credentials
export function getOAuthConfig() {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const isProduction = nodeEnv === 'production';
  
  return {
    google: {
      clientId: isProduction ? process.env.GOOGLE_CLIENT_ID_PROD : process.env.GOOGLE_CLIENT_ID_DEV,
      clientSecret: isProduction ? process.env.GOOGLE_CLIENT_SECRET_PROD : process.env.GOOGLE_CLIENT_SECRET_DEV,
    },
    twitter: {
      consumerKey: isProduction ? process.env.TWITTER_CONSUMER_KEY_PROD : process.env.TWITTER_CONSUMER_KEY_DEV,
      consumerSecret: isProduction ? process.env.TWITTER_CONSUMER_SECRET_PROD : process.env.TWITTER_CONSUMER_SECRET_DEV,
    },
    facebook: {
      appId: isProduction ? process.env.FACEBOOK_APP_ID_PROD : process.env.FACEBOOK_APP_ID_DEV,
      appSecret: isProduction ? process.env.FACEBOOK_APP_SECRET_PROD : process.env.FACEBOOK_APP_SECRET_DEV,
    }
  };
}

// Get environment-specific URLs
export function getUrlConfig() {
  const nodeEnv = process.env.NODE_ENV || 'development';
  
  if (nodeEnv === 'production') {
    return {
      baseUrl: process.env.BASE_URL || 'https://globaltradingtycoon.app',
      frontendUrl: process.env.FRONTEND_URL || 'https://globaltradingtycoon.app'
    };
  } else {
    return {
      baseUrl: process.env.BASE_URL || (process.env.REPLIT_DOMAINS ? `https://${process.env.REPLIT_DOMAINS}` : 'http://localhost:5000'),
      frontendUrl: process.env.FRONTEND_URL || (process.env.REPLIT_DOMAINS ? `https://${process.env.REPLIT_DOMAINS}` : 'http://localhost:5000')
    };
  }
}