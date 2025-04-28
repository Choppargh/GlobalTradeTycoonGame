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

export function ProductMarket() {
  const { marketListings, buyProduct, sellProduct, inventory, cash } = useGameStore();
  const [buyQuantities, setBuyQuantities] = useState<Record<number, number>>({});
  const [sellQuantities, setSellQuantities] = useState<Record<number, number>>({});
  
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
    return quantity * product.marketPrice;
  };
  
  const calculateSellTotal = (product: ProductListing): number => {
    const quantity = sellQuantities[product.productId] || 0;
    const sellPrice = Math.round(product.marketPrice * product.demandMultiplier * 100) / 100;
    return quantity * sellPrice;
  };
  
  const formatCurrency = (amount: number): string => {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
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
              <TableHead className="text-right">Buy</TableHead>
              <TableHead className="text-right">Sell</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {marketListings.length > 0 ? (
              marketListings.map((product) => {
                const demandPrice = Math.round(product.marketPrice * product.demandMultiplier * 100) / 100;
                const inventoryQty = getInventoryQuantity(product.productId);
                
                return (
                  <TableRow key={product.productId}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{formatCurrency(product.marketPrice)}</TableCell>
                    <TableCell>{formatCurrency(demandPrice)}</TableCell>
                    <TableCell>{product.available}</TableCell>
                    <TableCell>{inventoryQty}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Input
                          type="number"
                          min="0"
                          max={product.available}
                          value={buyQuantities[product.productId] || ''}
                          onChange={(e) => handleBuyInput(product.productId, e.target.value)}
                          className="w-16 text-right"
                        />
                        <Button 
                          size="sm" 
                          onClick={() => handleBuy(product)}
                          disabled={
                            !buyQuantities[product.productId] || 
                            buyQuantities[product.productId] <= 0 ||
                            buyQuantities[product.productId] > product.available ||
                            calculateBuyTotal(product) > cash
                          }
                        >
                          Buy
                        </Button>
                      </div>
                      {buyQuantities[product.productId] > 0 && (
                        <div className="text-xs text-right mt-1">
                          Total: {formatCurrency(calculateBuyTotal(product))}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Input
                          type="number"
                          min="0"
                          max={inventoryQty}
                          value={sellQuantities[product.productId] || ''}
                          onChange={(e) => handleSellInput(product.productId, e.target.value)}
                          className="w-16 text-right"
                          disabled={inventoryQty === 0}
                        />
                        <Button 
                          size="sm" 
                          variant="secondary"
                          onClick={() => handleSell(product)}
                          disabled={
                            !sellQuantities[product.productId] || 
                            sellQuantities[product.productId] <= 0 ||
                            sellQuantities[product.productId] > inventoryQty
                          }
                        >
                          Sell
                        </Button>
                      </div>
                      {sellQuantities[product.productId] > 0 && (
                        <div className="text-xs text-right mt-1">
                          Total: {formatCurrency(calculateSellTotal(product))}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No products available at this location. Try traveling elsewhere!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
