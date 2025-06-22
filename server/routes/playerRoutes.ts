import { Router } from 'express';
import { db } from '../db';
import { 
  playerSettings, 
  playerInfrastructure, 
  playerStaff, 
  playerReputation, 
  contracts,
  insertPlayerSettingsSchema,
  insertPlayerInfrastructureSchema,
  insertPlayerStaffSchema,
  insertPlayerReputationSchema,
  insertContractSchema
} from '@shared/schema';
import { eq, and } from 'drizzle-orm';

const router = Router();

// Player Settings Routes
router.get('/settings/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const settings = await db.select().from(playerSettings).where(eq(playerSettings.userId, userId)).limit(1);
    res.json(settings[0] || null);
  } catch (error) {
    console.error('Error fetching player settings:', error);
    res.status(500).json({ error: 'Failed to fetch player settings' });
  }
});

router.post('/settings', async (req, res) => {
  try {
    const validatedData = insertPlayerSettingsSchema.parse(req.body);
    
    // Try to update existing settings first
    const existingSettings = await db.select().from(playerSettings).where(eq(playerSettings.userId, validatedData.userId));
    
    if (existingSettings.length > 0) {
      // Update existing settings
      const result = await db.update(playerSettings)
        .set(validatedData)
        .where(eq(playerSettings.userId, validatedData.userId))
        .returning();
      res.json(result[0]);
    } else {
      // Create new settings
      const result = await db.insert(playerSettings).values(validatedData).returning();
      res.json(result[0]);
    }
  } catch (error) {
    console.error('Error creating/updating player settings:', error);
    res.status(500).json({ error: 'Failed to create/update player settings' });
  }
});

router.put('/settings/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const validatedData = insertPlayerSettingsSchema.parse(req.body);
    const result = await db.update(playerSettings)
      .set(validatedData)
      .where(eq(playerSettings.userId, userId))
      .returning();
    res.json(result[0]);
  } catch (error) {
    console.error('Error updating player settings:', error);
    res.status(500).json({ error: 'Failed to update player settings' });
  }
});

// Infrastructure Routes
router.get('/infrastructure/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const infrastructure = await db.select().from(playerInfrastructure).where(eq(playerInfrastructure.userId, userId));
    res.json(infrastructure);
  } catch (error) {
    console.error('Error fetching infrastructure:', error);
    res.status(500).json({ error: 'Failed to fetch infrastructure' });
  }
});

router.post('/infrastructure', async (req, res) => {
  try {
    const validatedData = insertPlayerInfrastructureSchema.parse(req.body);
    const result = await db.insert(playerInfrastructure).values(validatedData).returning();
    res.json(result[0]);
  } catch (error) {
    console.error('Error creating infrastructure:', error);
    res.status(500).json({ error: 'Failed to create infrastructure' });
  }
});

router.put('/infrastructure/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const validatedData = insertPlayerInfrastructureSchema.partial().parse(req.body);
    const result = await db.update(playerInfrastructure)
      .set(validatedData)
      .where(eq(playerInfrastructure.id, id))
      .returning();
    res.json(result[0]);
  } catch (error) {
    console.error('Error updating infrastructure:', error);
    res.status(500).json({ error: 'Failed to update infrastructure' });
  }
});

router.delete('/infrastructure/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(playerInfrastructure).where(eq(playerInfrastructure.id, id));
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting infrastructure:', error);
    res.status(500).json({ error: 'Failed to delete infrastructure' });
  }
});

// Staff Routes
router.get('/staff/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const staff = await db.select().from(playerStaff).where(eq(playerStaff.userId, userId));
    res.json(staff);
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
});

router.post('/staff', async (req, res) => {
  try {
    const validatedData = insertPlayerStaffSchema.parse(req.body);
    const result = await db.insert(playerStaff).values(validatedData).returning();
    res.json(result[0]);
  } catch (error) {
    console.error('Error hiring staff:', error);
    res.status(500).json({ error: 'Failed to hire staff' });
  }
});

router.put('/staff/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const validatedData = insertPlayerStaffSchema.partial().parse(req.body);
    const result = await db.update(playerStaff)
      .set(validatedData)
      .where(eq(playerStaff.id, id))
      .returning();
    res.json(result[0]);
  } catch (error) {
    console.error('Error updating staff:', error);
    res.status(500).json({ error: 'Failed to update staff' });
  }
});

router.delete('/staff/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(playerStaff).where(eq(playerStaff.id, id));
    res.json({ success: true });
  } catch (error) {
    console.error('Error firing staff:', error);
    res.status(500).json({ error: 'Failed to fire staff' });
  }
});

// Reputation Routes
router.get('/reputation/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const reputation = await db.select().from(playerReputation).where(eq(playerReputation.userId, userId));
    res.json(reputation);
  } catch (error) {
    console.error('Error fetching reputation:', error);
    res.status(500).json({ error: 'Failed to fetch reputation' });
  }
});

router.post('/reputation', async (req, res) => {
  try {
    const validatedData = insertPlayerReputationSchema.parse(req.body);
    const result = await db.insert(playerReputation).values(validatedData).returning();
    res.json(result[0]);
  } catch (error) {
    console.error('Error creating reputation:', error);
    res.status(500).json({ error: 'Failed to create reputation' });
  }
});

router.put('/reputation/:userId/:location', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const location = req.params.location;
    const validatedData = insertPlayerReputationSchema.partial().parse(req.body);
    const result = await db.update(playerReputation)
      .set(validatedData)
      .where(and(
        eq(playerReputation.userId, userId),
        eq(playerReputation.location, location)
      ))
      .returning();
    res.json(result[0]);
  } catch (error) {
    console.error('Error updating reputation:', error);
    res.status(500).json({ error: 'Failed to update reputation' });
  }
});

// Contract Routes
router.get('/contracts/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const userContracts = await db.select().from(contracts).where(eq(contracts.userId, userId));
    res.json(userContracts);
  } catch (error) {
    console.error('Error fetching contracts:', error);
    res.status(500).json({ error: 'Failed to fetch contracts' });
  }
});

router.post('/contracts', async (req, res) => {
  try {
    const validatedData = insertContractSchema.parse(req.body);
    const result = await db.insert(contracts).values(validatedData).returning();
    res.json(result[0]);
  } catch (error) {
    console.error('Error creating contract:', error);
    res.status(500).json({ error: 'Failed to create contract' });
  }
});

router.put('/contracts/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const validatedData = insertContractSchema.partial().parse(req.body);
    const result = await db.update(contracts)
      .set(validatedData)
      .where(eq(contracts.id, id))
      .returning();
    res.json(result[0]);
  } catch (error) {
    console.error('Error updating contract:', error);
    res.status(500).json({ error: 'Failed to update contract' });
  }
});

export default router;