import { useState } from 'react';
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
  
  const handleBuyInput = (productId: number, value: string) => {
    const quantity = parseInt(value) || 0;
    setBuyQuantities({ ...buyQuantities, [productId]: quantity });
  };
  
  const handleSellInput = (productId: number, value: string) => {
    const quantity = parseInt(value) || 0;
    setSellQuantities({ ...sellQuantities, [productId]: quantity });
  };
  
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
  
  const getInventoryQuantity = (productId: number): number => {
    const item = inventory.find(item => item.productId === productId);
    return item ? item.quantity : 0;
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
      <Card className="col-span-full lg:col-span-2 h-full overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle>Market</CardTitle>
          <CardDescription>
            Buy low and sell high! Available products: {marketListings.length}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-auto max-h-[450px]">
          <Table>
            <TableHeader className="sticky top-0 bg-card">
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Market Price</TableHead>
                <TableHead>Demand Price</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>In Stock</TableHead>
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
                        "cursor-pointer hover:bg-muted/50",
                        priceChanges[product.productId] === 'increase' && "bg-green-100 hover:bg-green-200/80",
                        priceChanges[product.productId] === 'decrease' && "bg-red-100 hover:bg-red-200/80"
                      )}
                      onClick={() => setSelectedProduct(product)}
                    >
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{formatCurrency(product.marketPrice)}</TableCell>
                      <TableCell>{formatCurrency(demandPrice)}</TableCell>
                      <TableCell>{product.available}</TableCell>
                      <TableCell>{inventoryQty}</TableCell>
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
        <DialogContent className="bg-white w-[95vw] max-w-[500px] sm:w-auto">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProduct.name}</DialogTitle>
                <DialogDescription className="flex flex-col sm:flex-row sm:space-x-4">
                  <span>Market Price: {formatCurrency(selectedProduct.marketPrice)}</span>
                  <span className="hidden sm:inline">|</span>
                  <span>Demand Price: {formatCurrency(selectedProduct.marketPrice * selectedProduct.demandMultiplier)}</span>
                </DialogDescription>
              </DialogHeader>
              
              {/* Mobile-optimized layout that stacks on small screens but goes side-by-side on larger ones */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-4">
                {/* Buy Section */}
                <div className="space-y-3 sm:border-r sm:pr-4">
                  <h3 className="font-semibold text-base text-center sm:text-left bg-green-50 p-2 rounded-md">Buy</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Available:</span>
                      <span>{selectedProduct.available}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Price per unit:</span>
                      <span>{formatCurrency(selectedProduct.marketPrice)}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 pt-1">
                      <div className="flex items-center">
                        <Input
                          type="number"
                          inputMode="numeric"
                          min="0"
                          max={selectedProduct.available}
                          value={buyQuantities[selectedProduct.productId] || ''}
                          onChange={(e) => handleBuyInput(selectedProduct.productId, e.target.value)}
                          className="w-full sm:w-20 text-right"
                          disabled={soldProducts.has(selectedProduct.productId)}
                        />
                        <span className="text-sm ml-2">units</span>
                      </div>
                      <Button 
                        type="button" 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          // Calculate max affordable quantity
                          const maxQuantity = Math.min(
                            selectedProduct.available,
                            Math.floor(cash / selectedProduct.marketPrice)
                          );
                          handleBuyInput(selectedProduct.productId, maxQuantity.toString());
                        }}
                        className="w-full sm:w-auto text-xs h-8"
                        disabled={
                          cash < selectedProduct.marketPrice || 
                          selectedProduct.available <= 0 ||
                          soldProducts.has(selectedProduct.productId)
                        }
                      >
                        Max Buy
                      </Button>
                    </div>
                    {buyQuantities[selectedProduct.productId] > 0 && (
                      <div className="text-sm font-medium bg-gray-50 p-2 rounded-md">
                        Total: {formatCurrency(calculateBuyTotal(selectedProduct))}
                      </div>
                    )}
                  </div>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      handleBuy(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    disabled={
                      !buyQuantities[selectedProduct.productId] || 
                      buyQuantities[selectedProduct.productId] <= 0 ||
                      buyQuantities[selectedProduct.productId] > selectedProduct.available ||
                      calculateBuyTotal(selectedProduct) > cash ||
                      soldProducts.has(selectedProduct.productId)
                    }
                  >
                    Buy
                  </Button>
                </div>
                
                {/* Divider for mobile only */}
                <div className="border-t border-gray-200 my-2 sm:hidden"></div>
                
                {/* Sell Section */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-base text-center sm:text-left bg-amber-50 p-2 rounded-md">Sell</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>In Stock:</span>
                      <span>{getInventoryQuantity(selectedProduct.productId)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Sell price per unit:</span>
                      <span>{formatCurrency(selectedProduct.marketPrice * selectedProduct.demandMultiplier)}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 pt-1">
                      <div className="flex items-center">
                        <Input
                          type="number"
                          inputMode="numeric"
                          min="0"
                          max={getInventoryQuantity(selectedProduct.productId)}
                          value={sellQuantities[selectedProduct.productId] || ''}
                          onChange={(e) => handleSellInput(selectedProduct.productId, e.target.value)}
                          className="w-full sm:w-20 text-right"
                          disabled={
                            getInventoryQuantity(selectedProduct.productId) === 0 ||
                            boughtProducts.has(selectedProduct.productId)
                          }
                        />
                        <span className="text-sm ml-2">units</span>
                      </div>
                      <Button 
                        type="button" 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          // Set to max available in inventory
                          const maxSellable = getInventoryQuantity(selectedProduct.productId);
                          handleSellInput(selectedProduct.productId, maxSellable.toString());
                        }}
                        className="w-full sm:w-auto text-xs h-8"
                        disabled={
                          getInventoryQuantity(selectedProduct.productId) === 0 ||
                          boughtProducts.has(selectedProduct.productId)
                        }
                      >
                        Max Sell
                      </Button>
                    </div>
                    {sellQuantities[selectedProduct.productId] > 0 && (
                      <div className="text-sm font-medium bg-gray-50 p-2 rounded-md">
                        Total: {formatCurrency(calculateSellTotal(selectedProduct))}
                      </div>
                    )}
                  </div>
                  <Button 
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                    onClick={() => {
                      handleSell(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    disabled={
                      !sellQuantities[selectedProduct.productId] || 
                      sellQuantities[selectedProduct.productId] <= 0 ||
                      sellQuantities[selectedProduct.productId] > getInventoryQuantity(selectedProduct.productId) ||
                      boughtProducts.has(selectedProduct.productId)
                    }
                  >
                    Sell
                  </Button>
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
