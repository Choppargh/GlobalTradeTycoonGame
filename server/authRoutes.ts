import type { Express, Request, Response } from "express";
import passport from './auth';
import bcrypt from 'bcryptjs';
import { storage } from './db';
import { insertUserSchema } from '@shared/schema';
import { ZodError } from 'zod';

export function registerAuthRoutes(app: Express) {
  
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
  app.get('/auth/google', (req, res, next) => {
    console.log('Google OAuth route accessed');
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
  });

  app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/?error=google_auth_failed' }),
    (req: Request, res: Response) => {
      // Successful authentication - redirect to homepage/dashboard
      res.redirect('/');
    }
  );

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
    if (req.isAuthenticated() && req.user) {
      const user = req.user as any;
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