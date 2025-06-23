import { Router } from 'express';
import { db } from '../db.js';
import { playerStorage, playerInfrastructure } from '@shared/schema';
import { eq, and } from 'drizzle-orm';
import { getProductConfig, STORAGE_CONFIG, calculateShippingFee } from '@shared/productConfig';

const router = Router();

// Get player storage for a location
router.get('/storage/:userId/:location', async (req, res) => {
  try {
    const { userId, location } = req.params;
    
    const storage = await db
      .select()
      .from(playerStorage)
      .where(and(
        eq(playerStorage.userId, parseInt(userId)),
        eq(playerStorage.location, location)
      ));
    
    res.json(storage);
  } catch (error) {
    console.error('Error fetching storage:', error);
    res.status(500).json({ error: 'Failed to fetch storage' });
  }
});

// Store item in warehouse/office
router.post('/storage/store', async (req, res) => {
  try {
    const { userId, location, productId, quantity, storageType, purchasePrice } = req.body;
    
    // Validate storage type
    if (!['office', 'warehouse'].includes(storageType)) {
      return res.status(400).json({ error: 'Invalid storage type' });
    }
    
    // Check if infrastructure exists
    const infrastructure = await db
      .select()
      .from(playerInfrastructure)
      .where(and(
        eq(playerInfrastructure.userId, userId),
        eq(playerInfrastructure.location, location),
        eq(playerInfrastructure.type, storageType)
      ))
      .limit(1);
    
    if (!infrastructure.length) {
      return res.status(400).json({ error: `No ${storageType} found in ${location}` });
    }
    
    // Get product configuration for storage units
    const productConfig = getProductConfig(productId);
    if (!productConfig) {
      return res.status(400).json({ error: 'Invalid product' });
    }
    
    const totalStorageUnits = quantity * productConfig.storageUnits;
    
    // Check current storage usage
    const currentStorage = await db
      .select()
      .from(playerStorage)
      .where(and(
        eq(playerStorage.userId, userId),
        eq(playerStorage.location, location),
        eq(playerStorage.storageType, storageType)
      ));
    
    const usedUnits = currentStorage.reduce((total, item) => {
      const config = getProductConfig(item.productId);
      return total + (item.quantity * (config?.storageUnits || 1));
    }, 0);
    
    const capacity = storageType === 'office' ? STORAGE_CONFIG.OFFICE_CAPACITY : STORAGE_CONFIG.WAREHOUSE_CAPACITY;
    
    if (usedUnits + totalStorageUnits > capacity) {
      return res.status(400).json({ 
        error: `Not enough storage space. Available: ${capacity - usedUnits} units, needed: ${totalStorageUnits} units` 
      });
    }
    
    // Check if item already exists in storage
    const existingItem = currentStorage.find(item => item.productId === productId);
    
    if (existingItem) {
      // Update existing item
      await db
        .update(playerStorage)
        .set({ 
          quantity: existingItem.quantity + quantity,
          purchasePrice: ((existingItem.purchasePrice * existingItem.quantity) + (purchasePrice * quantity)) / (existingItem.quantity + quantity)
        })
        .where(eq(playerStorage.id, existingItem.id));
    } else {
      // Create new storage entry
      await db.insert(playerStorage).values({
        userId,
        location,
        productId,
        quantity,
        storageType,
        purchasePrice
      });
    }
    
    res.json({ success: true, message: `${quantity} units stored in ${storageType}` });
  } catch (error) {
    console.error('Error storing item:', error);
    res.status(500).json({ error: 'Failed to store item' });
  }
});

// Move item from storage to player inventory
router.post('/storage/retrieve', async (req, res) => {
  try {
    const { userId, storageId, quantity } = req.body;
    
    // Find storage item
    const storageItem = await db
      .select()
      .from(playerStorage)
      .where(eq(playerStorage.id, storageId))
      .limit(1);
    
    if (!storageItem.length || storageItem[0].userId !== userId) {
      return res.status(404).json({ error: 'Storage item not found' });
    }
    
    const item = storageItem[0];
    
    if (quantity > item.quantity) {
      return res.status(400).json({ error: 'Not enough items in storage' });
    }
    
    // Check player carrying capacity
    const productConfig = getProductConfig(item.productId);
    const storageUnitsNeeded = quantity * (productConfig?.storageUnits || 1);
    
    if (storageUnitsNeeded > STORAGE_CONFIG.PLAYER_CAPACITY) {
      return res.status(400).json({ 
        error: `Cannot carry ${quantity} units. Player capacity: ${STORAGE_CONFIG.PLAYER_CAPACITY} units, needed: ${storageUnitsNeeded} units` 
      });
    }
    
    if (quantity === item.quantity) {
      // Remove entire item
      await db.delete(playerStorage).where(eq(playerStorage.id, storageId));
    } else {
      // Reduce quantity
      await db
        .update(playerStorage)
        .set({ quantity: item.quantity - quantity })
        .where(eq(playerStorage.id, storageId));
    }
    
    res.json({ 
      success: true, 
      item: {
        productId: item.productId,
        quantity,
        purchasePrice: item.purchasePrice
      }
    });
  } catch (error) {
    console.error('Error retrieving item:', error);
    res.status(500).json({ error: 'Failed to retrieve item' });
  }
});

// Ship item from another location
router.post('/storage/ship', async (req, res) => {
  try {
    const { userId, fromLocation, toLocation, productId, quantity } = req.body;
    
    // Find item in source location
    const sourceStorage = await db
      .select()
      .from(playerStorage)
      .where(and(
        eq(playerStorage.userId, userId),
        eq(playerStorage.location, fromLocation),
        eq(playerStorage.productId, productId)
      ))
      .limit(1);
    
    if (!sourceStorage.length || sourceStorage[0].quantity < quantity) {
      return res.status(400).json({ error: 'Not enough items available for shipping' });
    }
    
    const sourceItem = sourceStorage[0];
    const shippingFee = calculateShippingFee(sourceItem.purchasePrice * quantity);
    const finalPrice = (sourceItem.purchasePrice * quantity) + shippingFee;
    
    // Move item to destination
    if (quantity === sourceItem.quantity) {
      // Update location of entire item
      await db
        .update(playerStorage)
        .set({ 
          location: toLocation,
          purchasePrice: finalPrice / quantity
        })
        .where(eq(playerStorage.id, sourceItem.id));
    } else {
      // Reduce source quantity and create new item at destination
      await db
        .update(playerStorage)
        .set({ quantity: sourceItem.quantity - quantity })
        .where(eq(playerStorage.id, sourceItem.id));
      
      await db.insert(playerStorage).values({
        userId,
        location: toLocation,
        productId,
        quantity,
        storageType: sourceItem.storageType,
        purchasePrice: finalPrice / quantity
      });
    }
    
    res.json({ 
      success: true, 
      shippingFee,
      totalCost: finalPrice,
      message: `${quantity} units shipped from ${fromLocation} to ${toLocation}` 
    });
  } catch (error) {
    console.error('Error shipping item:', error);
    res.status(500).json({ error: 'Failed to ship item' });
  }
});

// Get storage capacity info
router.get('/storage/capacity/:userId/:location', async (req, res) => {
  try {
    const { userId, location } = req.params;
    
    // Get infrastructure info
    const infrastructure = await db
      .select()
      .from(playerInfrastructure)
      .where(and(
        eq(playerInfrastructure.userId, parseInt(userId)),
        eq(playerInfrastructure.location, location)
      ));
    
    // Get current storage usage
    const storage = await db
      .select()
      .from(playerStorage)
      .where(and(
        eq(playerStorage.userId, parseInt(userId)),
        eq(playerStorage.location, location)
      ));
    
    const officeUsage = storage
      .filter(item => item.storageType === 'office')
      .reduce((total, item) => {
        const config = getProductConfig(item.productId);
        return total + (item.quantity * (config?.storageUnits || 1));
      }, 0);
    
    const warehouseUsage = storage
      .filter(item => item.storageType === 'warehouse')
      .reduce((total, item) => {
        const config = getProductConfig(item.productId);
        return total + (item.quantity * (config?.storageUnits || 1));
      }, 0);
    
    const hasOffice = infrastructure.some(i => i.type === 'office');
    const hasWarehouse = infrastructure.some(i => i.type === 'warehouse');
    
    res.json({
      office: {
        exists: hasOffice,
        capacity: STORAGE_CONFIG.OFFICE_CAPACITY,
        used: officeUsage,
        available: hasOffice ? STORAGE_CONFIG.OFFICE_CAPACITY - officeUsage : 0
      },
      warehouse: {
        exists: hasWarehouse,
        capacity: STORAGE_CONFIG.WAREHOUSE_CAPACITY,
        used: warehouseUsage,
        available: hasWarehouse ? STORAGE_CONFIG.WAREHOUSE_CAPACITY - warehouseUsage : 0
      },
      playerCapacity: STORAGE_CONFIG.PLAYER_CAPACITY
    });
  } catch (error) {
    console.error('Error fetching capacity info:', error);
    res.status(500).json({ error: 'Failed to fetch capacity info' });
  }
});

export default router;