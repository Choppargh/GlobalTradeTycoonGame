import React, { useState } from 'react';
import { ProductListing } from '@shared/schema';
import { useGameStore } from '@/lib/stores/useGameStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ProductDetailDialogProps {
  isOpen: boolean;
  product: ProductListing | null;
  onClose: () => void;
}

export function ProductDetailDialog({ isOpen, product, onClose }: ProductDetailDialogProps) {
  const { 
    cash, 
    inventory,
    boughtProducts,
    soldProducts,
    buyProduct,
    sellProduct
  } = useGameStore();

  const [buyQuantity, setBuyQuantity] = useState<number | string>('');
  const [sellQuantity, setSellQuantity] = useState<number | string>('');
  
  if (!isOpen || !product) return null;
  
  // Format currency properly
  const formatCurrency = (amount: number): string => {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };
  
  // Calculate buy total
  const calculateBuyTotal = (): number => {
    const qty = typeof buyQuantity === 'string' ? parseInt(buyQuantity) || 0 : buyQuantity;
    return qty * product.marketPrice;
  };
  
  // Calculate sell total
  const calculateSellTotal = (): number => {
    const qty = typeof sellQuantity === 'string' ? parseInt(sellQuantity) || 0 : sellQuantity;
    const sellPrice = product.marketPrice * product.demandMultiplier;
    return qty * sellPrice;
  };
  
  // Handle buy button click
  const handleBuy = () => {
    const qty = typeof buyQuantity === 'string' ? parseInt(buyQuantity) || 0 : buyQuantity;
    if (qty > 0) {
      buyProduct(product.productId, qty, product.marketPrice);
      setBuyQuantity('');
      onClose();
    }
  };
  
  // Handle sell button click
  const handleSell = () => {
    const qty = typeof sellQuantity === 'string' ? parseInt(sellQuantity) || 0 : sellQuantity;
    const sellPrice = product.marketPrice * product.demandMultiplier;
    if (qty > 0) {
      sellProduct(product.productId, qty, sellPrice);
      setSellQuantity('');
      onClose();
    }
  };
  
  // Get max quantity that can be bought
  const handleMaxBuy = () => {
    const maxCashQty = Math.floor(cash / product.marketPrice);
    const maxQty = Math.min(product.available, maxCashQty);
    setBuyQuantity(maxQty);
  };
  
  // Get max quantity that can be sold
  const handleMaxSell = () => {
    const inventoryItem = inventory.find(item => item.productId === product.productId);
    setSellQuantity(inventoryItem ? inventoryItem.quantity : 0);
  };
  
  // Check if product can be bought
  const canBuyProduct = (): boolean => {
    return !soldProducts.has(product.productId) && 
           product.available > 0 && 
           cash >= product.marketPrice;
  };
  
  // Check if product can be sold  
  const canSellProduct = (): boolean => {
    return !boughtProducts.has(product.productId) && 
           inventory.some(item => item.productId === product.productId && item.quantity > 0);
  };
  
  // Get inventory quantity
  const getInventoryQuantity = (): number => {
    const inventoryItem = inventory.find(item => item.productId === product.productId);
    return inventoryItem ? inventoryItem.quantity : 0;
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4" onClick={onClose} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}>
      <div 
        className="bg-white rounded-3xl p-6 max-w-sm w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{product.name}</h2>
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
            <span className="font-medium">Market Price:</span>
            <span className="text-blue-600">{formatCurrency(product.marketPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Demand Price:</span>
            <span className="text-green-600">{formatCurrency(product.marketPrice * product.demandMultiplier)}</span>
          </div>
        </div>
        
        {/* Buy Section - Always on top */}
        <div className="border-0 rounded-3xl p-4 bg-amber-50 mb-4 shadow-sm">
          <h3 className="font-bold text-lg text-amber-800 mb-3">Buy</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Available:</span>
              <span className="font-medium">{product.available}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Your Cash:</span>
              <span className="font-medium">{formatCurrency(cash)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">At Market Price:</span>
              <span className="text-blue-700">{formatCurrency(product.marketPrice)}</span>
            </div>
            
            <div className="flex items-center space-x-2 mt-4">
              <Input
                type="number"
                value={buyQuantity}
                onChange={(e) => setBuyQuantity(e.target.value)}
                min={0}
                max={Math.min(product.available, Math.floor(cash / product.marketPrice))}
                className="w-20 bg-white"
                disabled={!canBuyProduct()}
                placeholder="Qty"
              />
              <Button 
                variant="secondary"
                size="sm"
                onClick={handleMaxBuy}
                disabled={!canBuyProduct()}
                className="whitespace-nowrap"
              >
                Max
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleBuy}
                disabled={!buyQuantity || parseInt(String(buyQuantity)) <= 0 || !canBuyProduct()}
                className="bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-2xl border-0 shadow-md"
              >
                BUY
              </Button>
            </div>
            
            <div className="text-sm font-semibold mt-2">Total: {formatCurrency(calculateBuyTotal())}</div>
            {soldProducts.has(product.productId) ? (
              <p className="text-xs text-red-500 mt-1">You can't buy products you've already sold today</p>
            ) : product.available === 0 ? (
              <p className="text-xs text-amber-500 mt-1">This product is out of stock</p>
            ) : cash < product.marketPrice ? (
              <p className="text-xs text-amber-500 mt-1">You don't have enough cash to buy this product</p>
            ) : null}
          </div>
        </div>
        
        {/* Sell Section - Always below Buy */}
        <div className="border-0 rounded-3xl p-4 bg-emerald-50 shadow-sm">
          <h3 className="font-bold text-lg text-emerald-800 mb-3">Sell</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">In Your Inventory:</span>
              <span className="font-medium">{getInventoryQuantity()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">At Demand Price:</span>
              <span className="text-green-700">{formatCurrency(product.marketPrice * product.demandMultiplier)}</span>
            </div>
            
            <div className="flex items-center space-x-2 mt-4">
              <Input
                type="number"
                value={sellQuantity}
                onChange={(e) => setSellQuantity(e.target.value)}
                min={0}
                max={getInventoryQuantity()}
                className="w-20 bg-white"
                disabled={!canSellProduct()}
                placeholder="Qty"
              />
              <Button 
                variant="secondary"
                size="sm"
                onClick={handleMaxSell}
                disabled={!canSellProduct()}
                className="whitespace-nowrap"
              >
                Max
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSell}
                disabled={!sellQuantity || parseInt(String(sellQuantity)) <= 0 || !canSellProduct()}
                className="bg-emerald-400 hover:bg-emerald-500 text-white font-semibold rounded-2xl border-0 shadow-md"
              >
                SELL
              </Button>
            </div>
            
            <div className="text-sm font-semibold mt-2">Total: {formatCurrency(calculateSellTotal())}</div>
            {boughtProducts.has(product.productId) ? (
              <p className="text-xs text-red-500 mt-1">You can't sell products you've just bought today</p>
            ) : getInventoryQuantity() === 0 ? (
              <p className="text-xs text-amber-500 mt-1">You don't have any of this product to sell</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}