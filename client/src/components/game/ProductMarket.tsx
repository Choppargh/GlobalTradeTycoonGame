import { useState, useEffect, useRef } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGameStore } from '@/lib/stores/useGameStore';
import { ProductListing } from '@shared/schema';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

export function ProductMarket() {
  const { marketListings, buyProduct, sellProduct, inventory, cash, priceChanges, daysRemaining, boughtProducts, soldProducts } = useGameStore();
  const [buyQuantities, setBuyQuantities] = useState<Record<number, number>>({});
  const [sellQuantities, setSellQuantities] = useState<Record<number, number>>({});
  const [selectedProduct, setSelectedProduct] = useState<ProductListing | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);
  
  // Helper function to check if a product can be sold
  const canSellProduct = (productId: number): boolean => {
    return !soldProducts.has(productId) && !boughtProducts.has(productId) && 
           getInventoryQuantity(productId) > 0 && !isDisabled;
  };
  
  // Helper function to check if a product can be bought
  const canBuyProduct = (productId: number, price: number): boolean => {
    const productListing = marketListings.find(p => p.productId === productId);
    return !boughtProducts.has(productId) && 
           !soldProducts.has(productId) && 
           !!productListing && 
           productListing.available > 0 && 
           cash >= price && 
           !isDisabled;
  };
  
  // Reset quantities when product list changes (e.g. changing location)
  useEffect(() => {
    setBuyQuantities({});
    setSellQuantities({});
  }, [marketListings]);
  
  // Get inventory quantity for a product
  const getInventoryQuantity = (productId: number): number => {
    const item = inventory.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  };
  
  // Handle buy/sell buttons
  const handleBuy = (product: ProductListing) => {
    const quantity = buyQuantities[product.productId] || 0;
    if (quantity <= 0) return;
    
    buyProduct(product.productId, quantity, product.marketPrice);
    
    // Reset input
    const newBuyQuantities = { ...buyQuantities };
    delete newBuyQuantities[product.productId];
    setBuyQuantities(newBuyQuantities);
  };
  
  const handleSell = (product: ProductListing) => {
    const quantity = sellQuantities[product.productId] || 0;
    if (quantity <= 0) return;
    
    // Get corresponding inventory item
    const inventoryItem = inventory.find(item => item.productId === product.productId);
    if (!inventoryItem || inventoryItem.quantity < quantity) return;
    
    // Sell at demand price (market price * demand multiplier)
    const sellPrice = Math.round(product.marketPrice * product.demandMultiplier * 100) / 100;
    sellProduct(product.productId, quantity, sellPrice);
    
    // Reset input
    const newSellQuantities = { ...sellQuantities };
    delete newSellQuantities[product.productId];
    setSellQuantities(newSellQuantities);
  };

  // Input change handlers  
  const handleBuyInputChange = (productId: number, value: string) => {
    const quantity = parseInt(value) || 0;
    setBuyQuantities(prev => ({
      ...prev,
      [productId]: quantity
    }));
  };
  
  const handleSellInputChange = (productId: number, value: string) => {
    const quantity = parseInt(value) || 0;
    setSellQuantities(prev => ({
      ...prev,
      [productId]: quantity
    }));
  };
  
  const handleMaxBuy = (product: ProductListing) => {
    const maxAffordable = Math.floor(cash / product.marketPrice);
    const maxBuy = Math.min(maxAffordable, product.available);
    
    setBuyQuantities(prev => ({
      ...prev,
      [product.productId]: maxBuy
    }));
  };
  
  const handleMaxSell = (product: ProductListing) => {
    const inventoryQty = getInventoryQuantity(product.productId);
    setSellQuantities(prev => ({
      ...prev,
      [product.productId]: inventoryQty
    }));
  };
  
  const calculateBuyTotal = (product: ProductListing): number => {
    const quantity = buyQuantities[product.productId] || 0;
    return Math.round(quantity * product.marketPrice * 100) / 100;
  };
  
  const calculateSellTotal = (product: ProductListing): number => {
    const quantity = sellQuantities[product.productId] || 0;
    const sellPrice = Math.round(product.marketPrice * product.demandMultiplier * 100) / 100;
    return Math.round(quantity * sellPrice * 100) / 100;
  };
  
  const formatCurrency = (amount: number): string => {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <>
      <Card className="shadow-none rounded-none border-0 h-full overflow-hidden">
        <CardHeader className="pb-3 pt-2 px-3">
          <CardTitle>Market</CardTitle>
          <CardDescription>
            Buy low and sell high! Available products: {marketListings.length}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-auto max-h-[350px] sm:max-h-[450px]">
          <Table>
            <TableHeader className="sticky top-0 bg-card">
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="hidden xs:table-cell">Market</TableHead>
                <TableHead>Demand</TableHead>
                <TableHead className="hidden sm:table-cell">Avail</TableHead>
                <TableHead className="hidden xs:table-cell">Stock</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {marketListings.length > 0 ? (
                marketListings.map((product) => {
                  const demandPrice = Math.round(product.marketPrice * product.demandMultiplier * 100) / 100;
                  const inventoryQty = getInventoryQuantity(product.productId);
                  
                  return (
                    <TableRow 
                      key={product.productId}
                      className={cn(
                        "cursor-pointer hover:bg-muted/50 transition-colors duration-200",
                        priceChanges[product.productId] === 'increase' && "bg-green-100 hover:bg-green-200/80",
                        priceChanges[product.productId] === 'decrease' && "bg-red-100 hover:bg-red-200/80"
                      )}
                      onClick={() => setSelectedProduct(product)}
                    >
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="hidden xs:table-cell">{formatCurrency(product.marketPrice)}</TableCell>
                      <TableCell>{formatCurrency(demandPrice)}</TableCell>
                      <TableCell className="hidden sm:table-cell">{product.available}</TableCell>
                      <TableCell className="hidden xs:table-cell">{inventoryQty}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="sm"
                          variant="default"
                          className="bg-blue-600 text-white hover:bg-blue-700"
                        >
                          Buy/Sell
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No products available at this location. Try traveling elsewhere!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Product Buy/Sell Dialog */}
      <Dialog 
        open={selectedProduct !== null}
        onOpenChange={(open) => !open && setSelectedProduct(null)}
      >
        <DialogContent className="bg-white w-[95vw] max-w-[500px] sm:w-auto animate-in fade-in-50 zoom-in-95 duration-300">
          {selectedProduct && (
          <>
            <DialogHeader>
              <DialogTitle>{selectedProduct.name}</DialogTitle>
              <DialogDescription className="flex flex-col sm:flex-row sm:space-x-4">
                <span>Market Price: {formatCurrency(selectedProduct.marketPrice)}</span>
                <span>Demand Price: {formatCurrency(selectedProduct.marketPrice * selectedProduct.demandMultiplier)}</span>
              </DialogDescription>
            </DialogHeader>
                
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
              {/* Buy Section */}
              <div className="space-y-3">
                <h3 className="font-semibold">Buy</h3>
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Available:</span>
                    <span>{selectedProduct.available}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Your Cash:</span>
                    <span>{formatCurrency(cash)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-sm">
                    <span>At Market Price:</span>
                    <span>{formatCurrency(selectedProduct.marketPrice)}</span>
                  </div>
                  
                  <div className="flex flex-col space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        value={buyQuantities[selectedProduct.productId] || ''}
                        onChange={(e) => handleBuyInputChange(selectedProduct.productId, e.target.value)}
                        min={0}
                        max={Math.min(selectedProduct.available, Math.floor(cash / selectedProduct.marketPrice))}
                        className="w-20"
                        disabled={selectedProduct.available === 0 || 
                                  cash < selectedProduct.marketPrice || 
                                  isDisabled || 
                                  boughtProducts.has(selectedProduct.productId)}
                        placeholder="Qty"
                      />
                      <Button 
                        variant="secondary"
                        size="sm"
                        onClick={() => handleMaxBuy(selectedProduct)}
                        disabled={selectedProduct.available === 0 || 
                                  cash < selectedProduct.marketPrice ||
                                  isDisabled || 
                                  boughtProducts.has(selectedProduct.productId)}
                        className="whitespace-nowrap"
                      >
                        Max
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleBuy(selectedProduct)}
                        disabled={!buyQuantities[selectedProduct.productId] || 
                                  buyQuantities[selectedProduct.productId] <= 0 ||
                                  isDisabled || 
                                  boughtProducts.has(selectedProduct.productId)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Buy
                      </Button>
                    </div>
                    
                    <div className="text-sm font-medium">Total: {formatCurrency(calculateBuyTotal(selectedProduct))}</div>
                    {soldProducts.has(selectedProduct.productId) && (
                      <p className="text-xs text-red-500 mt-1">You've already sold this product at this location</p>
                    )}
                    {boughtProducts.has(selectedProduct.productId) && (
                      <p className="text-xs text-red-500 mt-1">You've already purchased this product at this location</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Sell Section */}
              <div className="space-y-3">
                <h3 className="font-semibold">Sell</h3>
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>In Your Inventory:</span>
                    <span>{getInventoryQuantity(selectedProduct.productId)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-sm">
                    <span>At Demand Price:</span>
                    <span>{formatCurrency(selectedProduct.marketPrice * selectedProduct.demandMultiplier)}</span>
                  </div>
                  
                  <div className="flex flex-col space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        value={sellQuantities[selectedProduct.productId] || ''}
                        onChange={(e) => handleSellInputChange(selectedProduct.productId, e.target.value)}
                        min={0}
                        max={getInventoryQuantity(selectedProduct.productId)}
                        className="w-20"
                        disabled={!canSellProduct(selectedProduct.productId)}
                        placeholder="Qty"
                      />
                      <Button 
                        variant="secondary"
                        size="sm"
                        onClick={() => handleMaxSell(selectedProduct)}
                        disabled={getInventoryQuantity(selectedProduct.productId) === 0 || 
                                  isDisabled || 
                                  soldProducts.has(selectedProduct.productId)}
                        className="whitespace-nowrap"
                      >
                        Max
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleSell(selectedProduct)}
                        disabled={!sellQuantities[selectedProduct.productId] || 
                                  sellQuantities[selectedProduct.productId] <= 0 ||
                                  isDisabled || 
                                  soldProducts.has(selectedProduct.productId)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Sell
                      </Button>
                    </div>
                    
                    <div className="text-sm font-medium">Total: {formatCurrency(calculateSellTotal(selectedProduct))}</div>
                    {soldProducts.has(selectedProduct.productId) && (
                      <p className="text-xs text-red-500 mt-1">You've already sold this product at this location</p>
                    )}
                    {boughtProducts.has(selectedProduct.productId) && (
                      <p className="text-xs text-red-500 mt-1">Travel to a new location before selling this product</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
                
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setSelectedProduct(null)}
              >
                Close
              </Button>
            </DialogFooter>
          </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}