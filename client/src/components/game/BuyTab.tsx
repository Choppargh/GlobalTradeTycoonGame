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
import { cn } from '@/lib/utils';
import { BuyProductDialog } from './BuyProductDialog';

export function BuyTab() {
  const { marketListings, priceChanges } = useGameStore();
  const [selectedProduct, setSelectedProduct] = useState<ProductListing | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Format currency
  const formatCurrency = (amount: number): string => {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };
  
  // Open product dialog
  const handleBuyClick = (product: ProductListing) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };
  
  // Close product dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedProduct(null);
  };

  return (
    <Card className="h-full shadow-sm rounded-lg border border-black">
      <CardHeader className="pb-3">
        <CardTitle>Buy Products</CardTitle>
        <CardDescription>Purchase goods at market price and build your inventory</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Product</TableHead>
                <TableHead className="text-right">Market Price</TableHead>
                <TableHead className="text-right">Available</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {marketListings.map((product) => {
                const priceChange = priceChanges[product.productId];
                const marketPriceClass = priceChange === 'increase' 
                  ? 'text-green-600 font-semibold' 
                  : priceChange === 'decrease' 
                    ? 'text-red-600 font-semibold' 
                    : '';
                    
                return (
                  <TableRow key={product.productId} className={priceChange ? 'bg-opacity-25' : ''}>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell className={cn("text-right", marketPriceClass)}>
                      {formatCurrency(product.marketPrice)}
                    </TableCell>
                    <TableCell className="text-right">
                      {product.available}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-blue-100 hover:bg-blue-200 text-blue-800"
                        onClick={() => handleBuyClick(product)}
                      >
                        Buy
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      
      {/* Buy Product Dialog */}
      {selectedProduct && (
        <BuyProductDialog
          isOpen={isDialogOpen}
          product={selectedProduct}
          onClose={handleCloseDialog}
        />
      )}
    </Card>
  );
}