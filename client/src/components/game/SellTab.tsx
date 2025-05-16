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

export function SellTab() {
  const { inventory, marketListings } = useGameStore();
  const [selectedProduct, setSelectedProduct] = useState<ProductListing | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
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

  return (
    <Card className="h-full shadow-sm rounded-lg border border-black">
      <CardHeader className="pb-3">
        <CardTitle>Sell Products</CardTitle>
        <CardDescription>Sell your inventory at demand prices to make profit</CardDescription>
      </CardHeader>
      <CardContent>
        {inventory.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p>Your inventory is empty.</p>
            <p className="mt-2">Purchase products to build your inventory.</p>
          </div>
        ) : (
          <div className="relative overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Product</TableHead>
                  <TableHead className="text-right">Demand Price</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-center">Action</TableHead>
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
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="bg-green-100 hover:bg-green-200 text-green-800"
                          onClick={() => handleSellClick(item)}
                        >
                          Sell
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
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