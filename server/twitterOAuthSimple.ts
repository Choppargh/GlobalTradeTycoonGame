// Simplified Twitter OAuth implementation for production reliability
import { Request, Response } from 'express';
import { storage } from './db';

export class SimpleTwitterOAuth {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor(clientId: string, clientSecret: string, redirectUri: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
  }

  getAuthUrl(): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: 'tweet.read users.read',
      state: Math.random().toString(36).substring(2),
      code_challenge: 'challenge',
      code_challenge_method: 'plain'
    });

    return `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
  }

  async handleCallback(req: Request, res: Response) {
    console.log('Simple Twitter OAuth callback received');
    console.log('Query params:', req.query);

    const { code, error, error_description } = req.query;

    if (error) {
      console.error('Twitter OAuth error:', error, error_description);
      return res.redirect(`/?error=twitter_failed&reason=${encodeURIComponent(error as string)}`);
    }

    if (!code) {
      console.error('No authorization code received');
      return res.redirect('/?error=twitter_no_code');
    }

    try {
      // Exchange code for token
      const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code as string,
          redirect_uri: this.redirectUri,
          code_verifier: 'challenge'
        })
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error('Token exchange failed:', tokenResponse.status, errorText);
        return res.redirect('/?error=twitter_token_failed');
      }

      const tokenData = await tokenResponse.json();
      console.log('Token exchange successful');

      // Get user data
      const userResponse = await fetch('https://api.twitter.com/2/users/me?user.fields=id,name,username,profile_image_url', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`
        }
      });

      if (!userResponse.ok) {
        console.error('User data fetch failed:', userResponse.status);
        return res.redirect('/?error=twitter_user_failed');
      }

      const userData = await userResponse.json();
      const twitterUser = userData.data;
      console.log('Twitter user data retrieved:', twitterUser.username);

      // Find or create user
      let user = await storage.getUserByProvider('twitter', twitterUser.id);
      
      if (!user) {
        user = await storage.createUser({
          username: twitterUser.username || `twitter_${twitterUser.id}`,
          email: null,
          password: null,
          provider: 'twitter',
          providerId: twitterUser.id,
          displayName: twitterUser.name || twitterUser.username,
          avatar: twitterUser.profile_image_url || null
        });
        console.log('Created new Twitter user:', user.id);
      } else {
        console.log('Found existing Twitter user:', user.id);
      }

      // Login user
      req.login(user, (err) => {
        if (err) {
          console.error('Login error:', err);
          return res.redirect('/?error=login_failed');
        }
        console.log('Twitter OAuth login successful');
        res.redirect('/');
      });

    } catch (error) {
      console.error('Twitter OAuth callback error:', error);
      res.redirect('/?error=twitter_callback_failed');
    }
  }
}

export function setupSimpleTwitterAuth(app: any) {
  console.log('Setting up simplified Twitter OAuth');
  
  const baseURL = process.env.NODE_ENV === 'production' 
    ? 'https://globaltradingtycoon.app'
    : process.env.REPLIT_DOMAINS 
      ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}` 
      : 'http://localhost:5000';

  const twitterAuth = new SimpleTwitterOAuth(
    process.env.TWITTER_CONSUMER_KEY!,
    process.env.TWITTER_CONSUMER_SECRET!,
    `${baseURL}/auth/twitter/simple/callback`
  );

  // Simple Twitter OAuth initiation
  app.get('/auth/twitter/simple', (req: Request, res: Response) => {
    console.log('Simple Twitter OAuth route accessed');
    
    if (!process.env.TWITTER_CONSUMER_KEY || !process.env.TWITTER_CONSUMER_SECRET) {
      console.error('Twitter OAuth credentials missing');
      return res.redirect('/?error=twitter_config_missing');
    }

    const authUrl = twitterAuth.getAuthUrl();
    console.log('Redirecting to Twitter auth URL');
    res.redirect(authUrl);
  });

  // Simple Twitter OAuth callback
  app.get('/auth/twitter/simple/callback', (req: Request, res: Response) => {
    twitterAuth.handleCallback(req, res);
  });
}