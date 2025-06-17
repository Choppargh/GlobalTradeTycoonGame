import React, { useState } from 'react';
import { ProductListing } from '@shared/schema';
import { useGameStore } from '@/lib/stores/useGameStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface BuyProductDialogProps {
  isOpen: boolean;
  product: ProductListing;
  onClose: () => void;
}

export function BuyProductDialog({ isOpen, product, onClose }: BuyProductDialogProps) {
  const { 
    cash, 
    boughtProducts,
    soldProducts,
    buyProduct
  } = useGameStore();

  const [quantity, setQuantity] = useState<number | string>('');
  
  if (!isOpen) return null;
  
  // Format currency properly
  const formatCurrency = (amount: number): string => {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };
  
  // Calculate buy total
  const calculateTotal = (): number => {
    const qty = typeof quantity === 'string' ? parseInt(quantity) || 0 : quantity;
    return qty * product.marketPrice;
  };
  
  // Handle buy button click
  const handleBuy = () => {
    const qty = typeof quantity === 'string' ? parseInt(quantity) || 0 : quantity;
    if (qty > 0) {
      buyProduct(product.productId, qty, product.marketPrice);
      setQuantity('');
      onClose();
    }
  };
  
  // Get max quantity that can be bought
  const handleMaxBuy = () => {
    const maxCashQty = Math.floor(cash / product.marketPrice);
    const maxQty = Math.min(product.available, maxCashQty);
    setQuantity(maxQty);
  };
  
  // Check if product can be bought
  const canBuyProduct = (): boolean => {
    return !soldProducts.has(product.productId) && 
           product.available > 0 && 
           cash >= product.marketPrice;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={onClose}>
      <div 
        className="bg-white rounded-3xl p-8 max-w-md w-full shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Buy {product.name}</h2>
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
            <span className="font-medium">Available:</span>
            <span>{product.available}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Your Cash:</span>
            <span>{formatCurrency(cash)}</span>
          </div>
        </div>
        
        {/* Buy Controls */}
        <div className="border rounded-lg p-4 bg-blue-50 mb-4">
          <div className="flex items-center space-x-2 mb-4">
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min={0}
              max={Math.min(product.available, Math.floor(cash / product.marketPrice))}
              className="w-24 bg-white"
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
              onClick={handleBuy}
              disabled={!quantity || parseInt(String(quantity)) <= 0 || !canBuyProduct()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Buy
            </Button>
          </div>
            
          <div className="text-sm font-semibold">Total: {formatCurrency(calculateTotal())}</div>
          
          {soldProducts.has(product.productId) ? (
            <p className="text-xs text-red-500 mt-1">You can't buy products you've already sold today</p>
          ) : product.available === 0 ? (
            <p className="text-xs text-amber-500 mt-1">This product is out of stock</p>
          ) : cash < product.marketPrice ? (
            <p className="text-xs text-amber-500 mt-1">You don't have enough cash to buy this product</p>
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