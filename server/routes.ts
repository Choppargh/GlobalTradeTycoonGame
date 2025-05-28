import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./db";
import { insertScoreSchema } from "@shared/schema";
import { ZodError } from "zod";
import { verifyGoogleToken, generateDeviceId, generateJWT, verifyJWT } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  
  // Google OAuth login
  app.post('/api/auth/google', async (req, res) => {
    try {
      const { token, username } = req.body;
      
      if (!token || !username) {
        return res.status(400).json({ message: "Token and username required" });
      }
      
      // Verify Google token
      const googleUser = await verifyGoogleToken(token);
      if (!googleUser) {
        return res.status(401).json({ message: "Invalid Google token" });
      }
      
      // Check if user exists with this Google ID
      let user = await storage.getUserByGoogleId(googleUser.googleId);
      
      if (!user) {
        // Create new Google user
        user = await storage.createUser({
          username,
          googleId: googleUser.googleId,
          email: googleUser.email,
          authType: 'google'
        });
      }
      
      // Generate JWT token
      const jwtToken = generateJWT(user);
      
      res.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          authType: user.authType,
          email: user.email
        },
        token: jwtToken
      });
      
    } catch (error) {
      console.error("Google auth error:", error);
      res.status(500).json({ message: "Authentication failed" });
    }
  });
  
  // Guest authentication
  app.post('/api/auth/guest', async (req, res) => {
    try {
      const { username, deviceFingerprint } = req.body;
      
      if (!username || !deviceFingerprint) {
        return res.status(400).json({ message: "Username and device fingerprint required" });
      }
      
      // Generate unique device ID
      const deviceId = generateDeviceId(req.headers['user-agent'], req.ip);
      
      // Check if this device already has a user
      let user = await storage.getUserByDeviceId(deviceId);
      
      if (!user) {
        // Generate unique guest username with prefix
        const guestUsername = `GTT-Guest-${username}`;
        
        // Check if this guest username already exists, if so add a number
        let finalUsername = guestUsername;
        let counter = 1;
        while (await storage.getUserByUsername(finalUsername)) {
          finalUsername = `${guestUsername}-${counter}`;
          counter++;
        }
        
        // Create new guest user
        user = await storage.createUser({
          username: finalUsername,
          deviceId,
          authType: 'guest'
        });
      }
      
      // Generate JWT token
      const jwtToken = generateJWT(user);
      
      res.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          authType: user.authType
        },
        token: jwtToken
      });
      
    } catch (error) {
      console.error("Guest auth error:", error);
      res.status(500).json({ message: "Authentication failed" });
    }
  });
  
  // API routes for the game
  
  // Get leaderboard scores (now shows highest score per user)
  app.get('/api/scores', async (req, res) => {
    try {
      const scores = await storage.getScores();
      res.json(scores);
    } catch (error) {
      console.error("Error fetching scores:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });
  
  // Submit a new score
  app.post('/api/scores', async (req, res) => {
    try {
      console.log("Received score submission:", req.body);
      
      // Validate score data
      const scoreData = insertScoreSchema.parse(req.body);
      console.log("Validated score data:", scoreData);
      
      // Create the score
      const newScore = await storage.createScore(scoreData);
      console.log("Score saved successfully:", newScore);
      
      res.status(201).json(newScore);
    } catch (error) {
      console.error("Error creating score:", error);
      
      if (error instanceof ZodError) {
        console.error("Validation errors:", error.errors);
        return res.status(400).json({ 
          message: "Invalid score data", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ message: "Failed to submit score" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
