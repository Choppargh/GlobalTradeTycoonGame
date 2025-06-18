import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { users, scores, type User, type InsertUser, type Score, type InsertScore } from '@shared/schema';
import { eq, desc, and } from 'drizzle-orm';

// Database connection
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);

// Database storage implementation
export class DbStorage {
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async getUserByDisplayName(displayName: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.displayName, displayName));
    return result[0];
  }

  async getUserByProvider(provider: string, providerId: string): Promise<User | undefined> {
    const result = await db.select().from(users)
      .where(and(eq(users.provider, provider), eq(users.providerId, providerId)));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async getScores(): Promise<any[]> {
    const result = await db.select({
      id: scores.id,
      userId: scores.userId,
      username: users.username,
      displayName: users.displayName,
      score: scores.score,
      days: scores.days,
      endNetWorth: scores.endNetWorth,
      createdAt: scores.createdAt
    })
    .from(scores)
    .leftJoin(users, eq(scores.userId, users.id))
    .orderBy(desc(scores.score))
    .limit(20);
    
    return result;
  }

  async createScore(score: InsertScore): Promise<Score> {
    const result = await db.insert(scores).values({
      ...score,
      createdAt: new Date().toISOString()
    }).returning();
    return result[0];
  }

  async updateUserDisplayName(id: number, displayName: string): Promise<User | undefined> {
    const result = await db.update(users)
      .set({ displayName })
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  // Weekly reset function - truncates scores every Monday at 00:01
  async resetWeeklyScores(): Promise<void> {
    await db.delete(scores);
    console.log('Weekly leaderboard reset completed');
  }
}

export const storage = new DbStorage();