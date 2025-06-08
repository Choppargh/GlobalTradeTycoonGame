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

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }

      const existingUsername = await storage.getUserByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ message: 'Username is already taken' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const newUser = await storage.createUser({
        username,
        email,
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
  app.get('/auth/google', 
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login?error=google_auth_failed' }),
    (req: Request, res: Response) => {
      // Successful authentication
      res.redirect('/?auth_success=true');
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
    passport.authenticate('twitter', { failureRedirect: '/login?error=twitter_auth_failed' }),
    (req: Request, res: Response) => {
      res.redirect('/?auth_success=true');
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
          avatar: user.avatar
        }
      });
    } else {
      res.status(401).json({ message: 'Not authenticated' });
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