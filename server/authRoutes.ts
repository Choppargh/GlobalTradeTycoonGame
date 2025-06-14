import type { Express, Request, Response } from "express";
import passport from './auth';
import bcrypt from 'bcryptjs';
import { storage } from './db';
import { insertUserSchema } from '@shared/schema';
import { ZodError } from 'zod';

// In-memory storage for OAuth states
const oauthStates = new Map<string, { returnTo: string; timestamp: number }>();

export function registerAuthRoutes(app: Express) {
  console.log('Registering auth routes...');
  
  // Local registration endpoint
  app.post('/auth/register', async (req: Request, res: Response) => {
    try {
      const { username, email, password } = req.body;
      
      // Validate input
      if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required' });
      }

      // Check if user already exists (case-insensitive)
      const existingUser = await storage.getUserByEmail(email.toLowerCase());
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }

      const existingUsername = await storage.getUserByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ message: 'Username is already taken' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user (store email in lowercase)
      const newUser = await storage.createUser({
        username,
        email: email.toLowerCase(),
        password: hashedPassword,
        provider: 'local',
        providerId: null,
        displayName: username,
        avatar: null
      });

      // Log in the user
      req.login(newUser, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Registration successful but login failed' });
        }
        res.status(201).json({ 
          message: 'Registration successful', 
          user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            displayName: newUser.displayName,
            avatar: newUser.avatar
          }
        });
      });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Local login endpoint
  app.post('/auth/login', (req: Request, res: Response, next) => {
    passport.authenticate('local', (err: any, user: any, info: any) => {
      if (err) {
        return res.status(500).json({ message: 'Authentication error' });
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || 'Invalid credentials' });
      }
      
      req.login(user, (loginErr) => {
        if (loginErr) {
          return res.status(500).json({ message: 'Login failed' });
        }
        res.json({ 
          message: 'Login successful', 
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            displayName: user.displayName,
            avatar: user.avatar
          }
        });
      });
    })(req, res, next);
  });

  // Google OAuth routes
  console.log('Registering Google OAuth routes...');
  app.get('/auth/google', (req, res, next) => {
    console.log('Google OAuth route accessed from:', req.get('Host'));
    
    // Determine the correct callback URL based on the requesting domain
    const host = req.get('Host');
    const protocol = req.secure || req.get('X-Forwarded-Proto') === 'https' ? 'https' : 'http';
    
    // Map domains to their correct OAuth configurations
    let redirectDomain = 'globaltradingtycoon.app'; // default
    
    if (host?.includes('global-trade-tycoon.replit.app')) {
      redirectDomain = 'global-trade-tycoon.replit.app';
    } else if (host?.includes('globaltradertycoon.app')) {
      redirectDomain = 'globaltradertycoon.app';
    } else if (host?.includes('globaltradetycoon.app')) {
      redirectDomain = 'globaltradetycoon.app';
    }
    
    // Handle return URL for cross-domain OAuth
    const returnTo = req.query.return_to as string;
    
    // Check if this is a development/staging environment
    const isDev = host?.includes('replit.dev') || host?.includes('localhost') || protocol === 'http';
    
    if (!isDev && host !== 'globaltradingtycoon.app') {
      // Only redirect production domains to primary domain for OAuth
      const oauthURL = `https://globaltradingtycoon.app/auth/google?return_to=${encodeURIComponent(`${protocol}://${host}`)}`;
      console.log('Redirecting to primary domain for OAuth:', oauthURL);
      return res.redirect(oauthURL);
    }
    
    if (isDev) {
      // For development, redirect to production for OAuth but preserve return URL
      const oauthURL = `https://globaltradingtycoon.app/auth/google?return_to=${encodeURIComponent(`${protocol}://${host}`)}`;
      console.log('Development environment - redirecting to production for OAuth:', oauthURL);
      return res.redirect(oauthURL);
    }
    
    // Determine the final return URL
    const finalReturnTo = returnTo || `${protocol}://${host}`;
    console.log('Final return URL for OAuth:', finalReturnTo);
    
    // Generate a unique state ID and store return URL in memory/session
    const stateId = Math.random().toString(36).substring(2) + Date.now().toString(36);
    
    // Store in memory for cross-domain access
    oauthStates.set(stateId, {
      returnTo: finalReturnTo,
      timestamp: Date.now()
    });
    
    console.log('Storing OAuth state:', stateId, 'with returnTo:', finalReturnTo);
    
    passport.authenticate('google', { 
      scope: ['profile', 'email'],
      state: stateId
    })(req, res, next);
  });

  app.get('/auth/google/callback', (req: Request, res: Response, next) => {
    console.log('=== GOOGLE OAUTH CALLBACK ROUTE START ===');
    console.log('Callback received with query:', req.query);
    console.log('Request headers:', req.headers);
    console.log('Request host:', req.get('Host'));
    console.log('Request protocol:', req.protocol);
    
    // Check for OAuth errors first
    if (req.query.error) {
      console.error('Google OAuth error:', req.query.error, req.query.error_description);
      return res.redirect('/?error=google_auth_failed');
    }
    
    passport.authenticate('google', { 
      failureRedirect: '/?error=google_auth_failed',
      failureFlash: false 
    }, (err: any, user: any, info: any) => {
      console.log('Google OAuth authenticate result:');
      console.log('- Error:', err);
      console.log('- User:', user ? { id: user.id, email: user.email } : null);
      console.log('- Info:', info);
      
      if (err) {
        console.error('Google OAuth authentication error:', err);
        return res.redirect('/?error=google_oauth_error');
      }
      
      if (!user) {
        console.error('Google OAuth failed - no user returned');
        return res.redirect('/?error=google_user_not_found');
      }
      
      // Log the user in
      req.login(user, (loginErr) => {
        if (loginErr) {
          console.error('Login error after Google OAuth:', loginErr);
          return res.redirect('/?error=login_failed');
        }
        
        console.log('Google OAuth successful - user logged in:', { id: user.id, email: user.email });
        
        // Extract return URL from stored OAuth state
        let returnTo = '/';
        const stateId = req.query.state as string;
        
        if (stateId && oauthStates.has(stateId)) {
          const stateData = oauthStates.get(stateId)!;
          returnTo = stateData.returnTo;
          oauthStates.delete(stateId);
          console.log('Retrieved returnTo from stored state:', returnTo);
        } else {
          returnTo = req.query.return_to as string || '/';
          console.log('Using fallback returnTo:', returnTo);
        }
        
        // Ensure session is saved before redirect
        req.session.save((saveErr) => {
          if (saveErr) {
            console.error('Session save error:', saveErr);
          } else {
            console.log('Session saved successfully');
          }
          
          if (returnTo && (returnTo.startsWith('https://') || returnTo.startsWith('http://'))) {
            console.log('Redirecting to original domain:', returnTo);
            res.redirect(returnTo);
          } else {
            console.log('Redirecting to root');
            res.redirect('/');
          }
        });
      });
    })(req, res, next);
  });

  // Facebook OAuth routes
  app.get('/auth/facebook',
    passport.authenticate('facebook', { scope: ['email'] })
  );

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login?error=facebook_auth_failed' }),
    (req: Request, res: Response) => {
      res.redirect('/?auth_success=true');
    }
  );

  // Twitter OAuth routes
  app.get('/auth/twitter',
    passport.authenticate('twitter')
  );

  app.get('/auth/twitter/callback',
    passport.authenticate('twitter', { failureRedirect: '/?error=twitter_auth_failed' }),
    (req: Request, res: Response) => {
      // Successful authentication - redirect to homepage/dashboard
      res.redirect('/');
    }
  );

  // Logout endpoint
  app.post('/auth/logout', (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.json({ message: 'Logout successful' });
    });
  });

  // Get current user endpoint
  app.get('/auth/me', (req: Request, res: Response) => {
    console.log('Auth check - Session ID:', req.sessionID);
    console.log('Auth check - Is authenticated:', req.isAuthenticated());
    console.log('Auth check - User exists:', !!req.user);
    console.log('Auth check - Session data:', req.session);
    console.log('Auth check - Host:', req.get('Host'));
    
    if (req.isAuthenticated() && req.user) {
      const user = req.user as any;
      console.log('Auth check - User details:', { id: user.id, email: user.email, provider: user.provider });
      res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          displayName: user.displayName,
          avatar: user.avatar,
          provider: user.provider
        }
      });
    } else {
      console.log('Auth check - Not authenticated, sending 401');
      res.status(401).json({ message: 'Not authenticated' });
    }
  });

  // Update display name endpoint
  app.post('/auth/update-display-name', async (req: Request, res: Response) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    try {
      const { displayName } = req.body;
      
      if (!displayName || typeof displayName !== 'string') {
        return res.status(400).json({ message: 'Display name is required' });
      }

      const trimmedDisplayName = displayName.trim();
      
      if (trimmedDisplayName.length < 2 || trimmedDisplayName.length > 50) {
        return res.status(400).json({ message: 'Display name must be between 2 and 50 characters' });
      }

      const user = req.user as any;

      // Check if another user already has this display name
      const existingUserWithDisplayName = await storage.getUserByDisplayName(trimmedDisplayName);
      if (existingUserWithDisplayName && existingUserWithDisplayName.id !== user.id) {
        return res.status(400).json({ message: 'This trader name is already taken. Please choose a different one.' });
      }
      
      // Update the user in the database
      const updatedUser = await storage.updateUserDisplayName(user.id, trimmedDisplayName);
      
      if (!updatedUser) {
        return res.status(500).json({ message: 'Failed to update display name' });
      }

      // Update the session user object
      req.user = updatedUser;

      res.json({ 
        message: 'Display name updated successfully',
        user: {
          id: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
          displayName: updatedUser.displayName,
          avatar: updatedUser.avatar,
          provider: updatedUser.provider
        }
      });

    } catch (error) {
      console.error('Update display name error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Check authentication status
  app.get('/auth/status', (req: Request, res: Response) => {
    res.json({ 
      isAuthenticated: req.isAuthenticated(),
      user: req.isAuthenticated() ? {
        id: (req.user as any).id,
        username: (req.user as any).username,
        displayName: (req.user as any).displayName,
        avatar: (req.user as any).avatar
      } : null
    });
  });
}