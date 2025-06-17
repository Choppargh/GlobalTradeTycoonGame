import React, { useState } from 'react';
import { ProductListing } from '@shared/schema';
import { useGameStore } from '@/lib/stores/useGameStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SellProductDialogProps {
  isOpen: boolean;
  product: ProductListing & { 
    inventoryQuantity?: number; 
    purchasePrice?: number;
  };
  onClose: () => void;
}

export function SellProductDialog({ isOpen, product, onClose }: SellProductDialogProps) {
  const { 
    inventory,
    boughtProducts,
    sellProduct
  } = useGameStore();

  const [quantity, setQuantity] = useState<number | string>('');
  
  if (!isOpen) return null;
  
  // Format currency properly
  const formatCurrency = (amount: number): string => {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };
  
  // Calculate sell total
  const calculateTotal = (): number => {
    const qty = typeof quantity === 'string' ? parseInt(quantity) || 0 : quantity;
    const sellPrice = product.marketPrice * product.demandMultiplier;
    return qty * sellPrice;
  };
  
  // Calculate profit/loss
  const calculateProfit = (): number => {
    if (!product.purchasePrice) return 0;
    
    const qty = typeof quantity === 'string' ? parseInt(quantity) || 0 : quantity;
    const sellPrice = product.marketPrice * product.demandMultiplier;
    return qty * (sellPrice - product.purchasePrice);
  };
  
  // Handle sell button click
  const handleSell = () => {
    const qty = typeof quantity === 'string' ? parseInt(quantity) || 0 : quantity;
    if (qty > 0) {
      const sellPrice = product.marketPrice * product.demandMultiplier;
      sellProduct(product.productId, qty, sellPrice);
      setQuantity('');
      onClose();
    }
  };
  
  // Get max quantity that can be sold
  const handleMaxSell = () => {
    const inventoryItem = inventory.find(item => item.productId === product.productId);
    setQuantity(inventoryItem ? inventoryItem.quantity : 0);
  };
  
  // Check if product can be sold
  const canSellProduct = (): boolean => {
    return !boughtProducts.has(product.productId) && 
           getInventoryQuantity() > 0;
  };
  
  // Get inventory quantity
  const getInventoryQuantity = (): number => {
    // Use the prop value if available
    if (product.inventoryQuantity !== undefined) {
      return product.inventoryQuantity;
    }
    
    // Otherwise look it up from inventory
    const inventoryItem = inventory.find(item => item.productId === product.productId);
    return inventoryItem ? inventoryItem.quantity : 0;
  };
  
  // Get profit class based on profit/loss
  const getProfitClass = (): string => {
    const profit = calculateProfit();
    return profit > 0 ? 'text-green-600' : profit < 0 ? 'text-red-600' : '';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-3xl p-6 max-w-sm w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Sell {product.name}</h2>
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        
        {/* Product Price Info */}
        <div className="mb-6 space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Demand Price:</span>
            <span className="text-green-600">{formatCurrency(product.marketPrice * product.demandMultiplier)}</span>
          </div>
          {product.purchasePrice && (
            <div className="flex justify-between">
              <span className="font-medium">Purchase Price:</span>
              <span>{formatCurrency(product.purchasePrice)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="font-medium">In Your Inventory:</span>
            <span>{getInventoryQuantity()}</span>
          </div>
        </div>
        
        {/* Sell Controls */}
        <div className="border-0 rounded-3xl p-4 bg-emerald-50 mb-4 shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min={0}
              max={getInventoryQuantity()}
              className="w-24 bg-white rounded-2xl"
              disabled={!canSellProduct()}
              placeholder="Qty"
            />
            <Button 
              variant="secondary"
              size="sm"
              onClick={handleMaxSell}
              disabled={!canSellProduct()}
              className="whitespace-nowrap rounded-2xl"
            >
              Max
            </Button>
            <Button
              variant="default"
              onClick={handleSell}
              disabled={!quantity || parseInt(String(quantity)) <= 0 || !canSellProduct()}
              className="bg-emerald-400 hover:bg-emerald-500 text-white font-semibold rounded-2xl border-0 shadow-md"
            >
              SELL
            </Button>
          </div>
            
          <div className="text-sm font-semibold">Total: {formatCurrency(calculateTotal())}</div>
          
          {product.purchasePrice && (
            <div className={`text-sm font-semibold mt-1 ${getProfitClass()}`}>
              Profit: {formatCurrency(calculateProfit())}
            </div>
          )}
          
          {boughtProducts.has(product.productId) ? (
            <p className="text-xs text-red-500 mt-1">You can't sell products you've just bought today</p>
          ) : getInventoryQuantity() === 0 ? (
            <p className="text-xs text-amber-500 mt-1">You don't have any of this product to sell</p>
          ) : null}
        </div>
        
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}