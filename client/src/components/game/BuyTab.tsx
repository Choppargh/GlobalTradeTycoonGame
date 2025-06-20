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
import { useIsMobile } from '@/hooks/use-is-mobile';

export function BuyTab() {
  const { marketListings, priceChanges } = useGameStore();
  const [selectedProduct, setSelectedProduct] = useState<ProductListing | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isMobile = useIsMobile();
  
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

  // Render a mobile-friendly card layout instead of a table
  const renderMobileLayout = () => {
    return (
      <div className="space-y-4">
        {marketListings.map((product) => {
          const priceChange = priceChanges[product.productId];
          const marketPriceClass = priceChange === 'increase' 
            ? 'text-green-600 font-semibold' 
            : priceChange === 'decrease' 
              ? 'text-red-600 font-semibold' 
              : '';
              
          return (
            <div 
              key={product.productId}
              className="p-4 border-0 bg-white shadow-lg"
              style={{ borderRadius: '0 0 1.5rem 1.5rem' }}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-base">{product.name}</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-2xl min-w-[60px] border-0 shadow-md"
                  onClick={() => handleBuyClick(product)}
                >
                  BUY
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-1 text-sm">
                <div className="text-gray-600">Price:</div>
                <div className={marketPriceClass}>{formatCurrency(product.marketPrice)}</div>
                <div className="text-gray-600">Available:</div>
                <div>{product.available}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render the desktop table layout
  const renderDesktopLayout = () => {
    return (
      <div className="relative overflow-x-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Product</TableHead>
              <TableHead className="text-right w-[25%]">Market Price</TableHead>
              <TableHead className="text-right w-[15%]">Available</TableHead>
              <TableHead className="text-center w-[20%]">Action</TableHead>
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
                    <div className="flex justify-center">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-2xl w-16 border-0 shadow-md"
                        onClick={() => handleBuyClick(product)}
                      >
                        BUY
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
    <Card className="h-full shadow-lg rounded-b-3xl border-0 bg-white/95 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle>Buy Products</CardTitle>
        <CardDescription>Purchase goods at market price and build your inventory</CardDescription>
      </CardHeader>
      <CardContent>
        {isMobile ? renderMobileLayout() : renderDesktopLayout()}
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