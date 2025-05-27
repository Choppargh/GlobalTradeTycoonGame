import { users, type User, type InsertUser, scores, type Score, type InsertScore } from "@shared/schema";

// Storage interface
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  getUserByDeviceId(deviceId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Score related operations
  getScores(): Promise<Score[]>;
  createScore(score: InsertScore): Promise<Score>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private scores: Map<number, Score>;
  private userCurrentId: number;
  private scoreCurrentId: number;

  constructor() {
    this.users = new Map();
    this.scores = new Map();
    this.userCurrentId = 1;
    this.scoreCurrentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.googleId === googleId,
    );
  }

  async getUserByDeviceId(deviceId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.deviceId === deviceId,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { 
      id,
      username: insertUser.username,
      googleId: insertUser.googleId || null,
      email: insertUser.email || null,
      deviceId: insertUser.deviceId || null,
      authType: insertUser.authType || 'guest',
      createdAt: new Date().toISOString()
    };
    this.users.set(id, user);
    return user;
  }
  
  async getScores(): Promise<Score[]> {
    return Array.from(this.scores.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 20); // Top 20 scores
  }

  async createScore(insertScore: InsertScore): Promise<Score> {
    const id = this.scoreCurrentId++;
    const score: Score = { 
      ...insertScore, 
      id, 
      createdAt: new Date().toISOString()
    };
    this.scores.set(id, score);
    return score;
  }
}

export const storage = new MemStorage();
