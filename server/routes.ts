import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./db";
import { insertScoreSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for the game
  
  // Get leaderboard scores
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
