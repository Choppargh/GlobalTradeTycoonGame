import React, { useState } from 'react';
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
import { useGameStore } from '@/lib/stores/useGameStore';
import { ProductListing } from '@shared/schema';
import { SellProductDialog } from './SellProductDialog';
import { useIsMobile } from '@/hooks/use-is-mobile';

export function SellTab() {
  const { inventory, marketListings } = useGameStore();
  const [selectedProduct, setSelectedProduct] = useState<ProductListing | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // Format currency
  const formatCurrency = (amount: number): string => {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };
  
  // Open product dialog
  const handleSellClick = (inventoryItem: any) => {
    // Find the corresponding market listing to get current demand price
    const marketProduct = marketListings.find(p => p.productId === inventoryItem.productId);
    if (marketProduct) {
      // Cast to our extended type that includes additional properties
      setSelectedProduct({
        ...marketProduct,
        // Add inventory quantity for reference
        inventoryQuantity: inventoryItem.quantity,
        purchasePrice: inventoryItem.purchasePrice
      } as any);
      setIsDialogOpen(true);
    }
  };
  
  // Close product dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedProduct(null);
  };

  // Render a mobile-friendly card layout instead of a table
  const renderMobileLayout = () => {
    if (inventory.length === 0) {
      return (
        <div className="text-center py-10 text-gray-500">
          <p>Your inventory is empty.</p>
          <p className="mt-2">Purchase products to build your inventory.</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {inventory.map((item) => {
          // Find market listing to get demand price
          const marketProduct = marketListings.find(p => p.productId === item.productId);
          const demandPrice = marketProduct 
            ? marketProduct.marketPrice * marketProduct.demandMultiplier 
            : 0;
          
          // Calculate potential profit
          const profitPerUnit = demandPrice - item.purchasePrice;
          const profitClass = profitPerUnit > 0 
            ? 'text-green-600 font-semibold' 
            : profitPerUnit < 0 
              ? 'text-red-600 font-semibold' 
              : '';
              
          return (
            <div 
              key={item.productId}
              className="p-4 border-0 rounded-3xl bg-white shadow-lg"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-base">{item.name}</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-emerald-300 hover:bg-emerald-400 text-white font-semibold rounded-2xl min-w-[60px] border-0 shadow-md"
                  onClick={() => handleSellClick(item)}
                >
                  SELL
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-1 text-sm">
                <div className="text-gray-600">Price:</div>
                <div className={profitClass}>{formatCurrency(demandPrice)}</div>
                <div className="text-gray-600">Quantity:</div>
                <div>{item.quantity}</div>
                <div className="text-gray-600">Profit:</div>
                <div className={profitClass}>
                  {profitPerUnit >= 0 ? '+' : ''}
                  {formatCurrency(profitPerUnit)} per unit
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render the desktop table layout
  const renderDesktopLayout = () => {
    if (inventory.length === 0) {
      return (
        <div className="text-center py-10 text-gray-500">
          <p>Your inventory is empty.</p>
          <p className="mt-2">Purchase products to build your inventory.</p>
        </div>
      );
    }
    
    return (
      <div className="relative overflow-x-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Product</TableHead>
              <TableHead className="text-right w-[25%]">Demand Price</TableHead>
              <TableHead className="text-right w-[15%]">Quantity</TableHead>
              <TableHead className="text-center w-[20%]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map((item) => {
              // Find market listing to get demand price
              const marketProduct = marketListings.find(p => p.productId === item.productId);
              const demandPrice = marketProduct 
                ? marketProduct.marketPrice * marketProduct.demandMultiplier 
                : 0;
              
              // Calculate potential profit
              const profitPerUnit = demandPrice - item.purchasePrice;
              const profitClass = profitPerUnit > 0 
                ? 'text-green-600' 
                : profitPerUnit < 0 
                  ? 'text-red-600' 
                  : '';
                
              return (
                <TableRow key={item.productId}>
                  <TableCell className="font-medium">
                    {item.name}
                  </TableCell>
                  <TableCell className={`text-right ${profitClass}`}>
                    {formatCurrency(demandPrice)}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.quantity}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-emerald-300 hover:bg-emerald-400 text-white font-semibold rounded-2xl w-16 border-0 shadow-md"
                        onClick={() => handleSellClick(item)}
                      >
                        SELL
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <Card className="h-full shadow-lg rounded-3xl border-0 bg-white/95 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle>Sell Products</CardTitle>
        <CardDescription>Sell your inventory at demand prices to make profit</CardDescription>
      </CardHeader>
      <CardContent>
        {isMobile ? renderMobileLayout() : renderDesktopLayout()}
      </CardContent>
      
      {/* Sell Product Dialog */}
      {selectedProduct && (
        <SellProductDialog
          isOpen={isDialogOpen}
          product={selectedProduct}
          onClose={handleCloseDialog}
        />
      )}
    </Card>
  );
}