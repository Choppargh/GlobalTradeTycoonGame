import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Location } from '@shared/schema';
import { getProductConfig, STORAGE_CONFIG, ReputationLevel, getReputationLevel } from '@shared/productConfig';
import { useGameStore } from '@/lib/stores/useGameStore';

interface StorageItem {
  id: number;
  productId: number;
  quantity: number;
  storageType: 'office' | 'warehouse';
  purchasePrice: number;
  storedAt: string;
}

interface StorageCapacity {
  office: {
    exists: boolean;
    capacity: number;
    used: number;
    available: number;
  };
  warehouse: {
    exists: boolean;
    capacity: number;
    used: number;
    available: number;
  };
  playerCapacity: number;
}

interface StorageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: Location;
  userId: number;
}

export function StorageModal({ isOpen, onClose, currentLocation, userId }: StorageModalProps) {
  const [storageItems, setStorageItems] = useState<StorageItem[]>([]);
  const [capacity, setCapacity] = useState<StorageCapacity | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StorageItem | null>(null);
  const [transferQuantity, setTransferQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('office');
  
  const { inventory, playerReputation, currentLocation: gameLocation } = useGameStore();

  useEffect(() => {
    if (isOpen) {
      fetchStorageData();
    }
  }, [isOpen, currentLocation, userId]);

  const fetchStorageData = async () => {
    setLoading(true);
    try {
      const [storageResponse, capacityResponse] = await Promise.all([
        fetch(`/api/storage/${userId}/${currentLocation}`, { credentials: 'include' }),
        fetch(`/api/storage/capacity/${userId}/${currentLocation}`, { credentials: 'include' })
      ]);

      if (storageResponse.ok && capacityResponse.ok) {
        const storageData = await storageResponse.json();
        const capacityData = await capacityResponse.json();
        setStorageItems(storageData);
        setCapacity(capacityData);
      }
    } catch (error) {
      console.error('Failed to fetch storage data:', error);
    }
    setLoading(false);
  };

  const storeItem = async (item: any, storageType: 'office' | 'warehouse') => {
    const productConfig = getProductConfig(item.productId);
    if (!productConfig) return;

    const storageUnitsNeeded = item.quantity * productConfig.storageUnits;
    const availableSpace = capacity?.[storageType]?.available || 0;

    if (storageUnitsNeeded > availableSpace) {
      alert(`Not enough space in ${storageType}. Available: ${availableSpace} units, needed: ${storageUnitsNeeded} units`);
      return;
    }

    try {
      const response = await fetch('/api/storage/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          userId,
          location: currentLocation,
          productId: item.productId,
          quantity: item.quantity,
          storageType,
          purchasePrice: item.purchasePrice
        })
      });

      if (response.ok) {
        // Remove item from player inventory
        useGameStore.getState().removeInventoryItem(item.productId, item.quantity);
        fetchStorageData();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to store item');
      }
    } catch (error) {
      console.error('Failed to store item:', error);
      alert('Failed to store item');
    }
  };

  const retrieveItem = async (storageItem: StorageItem, quantity: number) => {
    const productConfig = getProductConfig(storageItem.productId);
    if (!productConfig) return;

    const storageUnitsNeeded = quantity * productConfig.storageUnits;
    if (storageUnitsNeeded > STORAGE_CONFIG.PLAYER_CAPACITY) {
      alert(`Cannot carry ${quantity} units. Player capacity: ${STORAGE_CONFIG.PLAYER_CAPACITY} units, needed: ${storageUnitsNeeded} units`);
      return;
    }

    try {
      const response = await fetch('/api/storage/retrieve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          userId,
          storageId: storageItem.id,
          quantity
        })
      });

      if (response.ok) {
        const result = await response.json();
        // Add item to player inventory
        useGameStore.getState().addInventoryItem({
          productId: result.item.productId,
          productName: productConfig.name,
          quantity: result.item.quantity,
          purchasePrice: result.item.purchasePrice
        });
        fetchStorageData();
        setSelectedItem(null);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to retrieve item');
      }
    } catch (error) {
      console.error('Failed to retrieve item:', error);
      alert('Failed to retrieve item');
    }
  };

  const getReputationBadge = (reputationScore: number) => {
    const level = getReputationLevel(reputationScore);
    const colors = {
      [ReputationLevel.Base]: 'bg-gray-500',
      [ReputationLevel.Bronze]: 'bg-amber-600', 
      [ReputationLevel.Silver]: 'bg-gray-400',
      [ReputationLevel.Gold]: 'bg-yellow-500'
    };
    
    return (
      <Badge className={`${colors[level]} text-white`}>
        {level.toUpperCase()}
      </Badge>
    );
  };

  const officeItems = storageItems.filter(item => item.storageType === 'office');
  const warehouseItems = storageItems.filter(item => item.storageType === 'warehouse');

  const renderStorageItems = (items: StorageItem[], storageType: 'office' | 'warehouse') => {
    if (items.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No items stored in {storageType}
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {items.map(item => {
          const config = getProductConfig(item.productId);
          if (!config) return null;

          const totalStorageUnits = item.quantity * config.storageUnits;

          return (
            <div key={item.id} className="bg-white border rounded-3xl p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{config.name}</h3>
                    <Badge variant="outline">{config.category}</Badge>
                    {getReputationBadge(0)} {/* Will update with actual reputation */}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Quantity: {item.quantity} units • Storage: {totalStorageUnits} units
                  </div>
                  <div className="text-sm text-gray-600">
                    Purchase Price: ${item.purchasePrice.toFixed(2)}
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => setSelectedItem(item)}
                  className="rounded-2xl"
                >
                  Retrieve
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-white rounded-3xl border-0 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Storage Management - {currentLocation}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="text-center py-8">Loading storage data...</div>
        ) : (
          <div className="space-y-6">
            {/* Capacity Overview */}
            {capacity && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-3xl p-4">
                  <h3 className="font-semibold text-blue-900">Player Inventory</h3>
                  <div className="text-sm text-blue-700">
                    Capacity: {STORAGE_CONFIG.PLAYER_CAPACITY} units
                  </div>
                </div>
                <div className="bg-purple-50 rounded-3xl p-4">
                  <h3 className="font-semibold text-purple-900">Office Storage</h3>
                  {capacity.office.exists ? (
                    <div className="text-sm text-purple-700">
                      Used: {capacity.office.used}/{capacity.office.capacity} units
                    </div>
                  ) : (
                    <div className="text-sm text-purple-500">No office built</div>
                  )}
                </div>
                <div className="bg-green-50 rounded-3xl p-4">
                  <h3 className="font-semibold text-green-900">Warehouse Storage</h3>
                  {capacity.warehouse.exists ? (
                    <div className="text-sm text-green-700">
                      Used: {capacity.warehouse.used}/{capacity.warehouse.capacity} units
                    </div>
                  ) : (
                    <div className="text-sm text-green-500">No warehouse built</div>
                  )}
                </div>
              </div>
            )}

            {/* Player Inventory */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Player Inventory</h3>
              {inventory.length === 0 ? (
                <div className="text-gray-500 text-center py-4">No items in inventory</div>
              ) : (
                <div className="space-y-2">
                  {inventory.map((item, index) => {
                    const config = getProductConfig(item.productId);
                    if (!config) return null;

                    return (
                      <div key={index} className="flex justify-between items-center bg-gray-50 rounded-2xl p-3">
                        <div>
                          <span className="font-medium">{item.productName}</span>
                          <span className="text-sm text-gray-600 ml-2">
                            {item.quantity} units ({item.quantity * config.storageUnits} storage units)
                          </span>
                        </div>
                        <div className="flex gap-2">
                          {capacity?.office.exists && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => storeItem(item, 'office')}
                              className="rounded-2xl"
                            >
                              Store in Office
                            </Button>
                          )}
                          {capacity?.warehouse.exists && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => storeItem(item, 'warehouse')}
                              className="rounded-2xl"
                            >
                              Store in Warehouse
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Storage Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="office">Office Storage</TabsTrigger>
                <TabsTrigger value="warehouse">Warehouse Storage</TabsTrigger>
              </TabsList>
              
              <TabsContent value="office">
                {capacity?.office.exists ? (
                  renderStorageItems(officeItems, 'office')
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No office built in this location
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="warehouse">
                {capacity?.warehouse.exists ? (
                  renderStorageItems(warehouseItems, 'warehouse')
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No warehouse built in this location
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Retrieve Item Dialog */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full mx-4">
              <h3 className="font-bold text-lg mb-4">Retrieve Item</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600">
                    Retrieve {getProductConfig(selectedItem.productId)?.name} from {selectedItem.storageType}
                  </p>
                  <p className="text-sm text-gray-500">
                    Available: {selectedItem.quantity} units
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Quantity:</label>
                  <input
                    type="number"
                    min="1"
                    max={selectedItem.quantity}
                    value={transferQuantity}
                    onChange={(e) => setTransferQuantity(parseInt(e.target.value) || 1)}
                    className="w-full border rounded-2xl px-3 py-2"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => retrieveItem(selectedItem, transferQuantity)}
                    className="flex-1 rounded-2xl"
                  >
                    Retrieve
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedItem(null)}
                    className="flex-1 rounded-2xl"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}