import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getProductConfig, getReputationLevel, ReputationLevel } from '@shared/productConfig';
import { MarketListing, getMarketStatusDescription } from '@shared/marketLogic';
import { TrendingUp, TrendingDown, Minus, Package, DollarSign } from 'lucide-react';

interface MarketDisplayProps {
  marketListings: MarketListing[];
  onBuyProduct: (productId: number, price: number) => void;
  onSellProduct: (productId: number, price: number) => void;
  playerInventory: any[];
  playerReputation: number;
}

export function MarketDisplay({ 
  marketListings, 
  onBuyProduct, 
  onSellProduct, 
  playerInventory,
  playerReputation 
}: MarketDisplayProps) {
  
  const getReputationBadge = (reputationScore: number) => {
    const level = getReputationLevel(reputationScore);
    const colors = {
      [ReputationLevel.Base]: 'bg-gray-500',
      [ReputationLevel.Bronze]: 'bg-amber-600', 
      [ReputationLevel.Silver]: 'bg-gray-400',
      [ReputationLevel.Gold]: 'bg-yellow-500'
    };
    
    return (
      <Badge className={`${colors[level]} text-white text-xs`}>
        {level.toUpperCase()}
      </Badge>
    );
  };

  const getTrendIcon = (supplyDemandRatio: number) => {
    if (supplyDemandRatio < 0.8) {
      return <TrendingUp className="w-4 h-4 text-red-500" />;
    } else if (supplyDemandRatio > 1.2) {
      return <TrendingDown className="w-4 h-4 text-blue-500" />;
    } else {
      return <Minus className="w-4 h-4 text-green-500" />;
    }
  };

  const getPlayerInventoryQuantity = (productId: number) => {
    const item = playerInventory.find(inv => inv.productId === productId);
    return item ? item.quantity : 0;
  };

  const groupedListings = marketListings.reduce((acc, listing) => {
    if (!acc[listing.category]) {
      acc[listing.category] = [];
    }
    acc[listing.category].push(listing);
    return acc;
  }, {} as Record<string, MarketListing[]>);

  const renderProductCard = (listing: MarketListing) => {
    const config = getProductConfig(listing.productId);
    const marketStatus = getMarketStatusDescription(listing.supplyDemandRatio);
    const playerQuantity = getPlayerInventoryQuantity(listing.productId);
    
    return (
      <Card key={listing.productId} className="rounded-3xl shadow-md">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                {listing.productName}
                {getTrendIcon(listing.supplyDemandRatio)}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">{listing.category}</Badge>
                {getReputationBadge(playerReputation)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-600">Storage: {config?.storageUnits} units</div>
              {playerQuantity > 0 && (
                <div className="text-xs text-blue-600">You have: {playerQuantity}</div>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {/* Market Status */}
          <div className="bg-gray-50 rounded-2xl p-3">
            <div className={`text-sm font-medium ${marketStatus.color}`}>
              {marketStatus.status}
            </div>
            <div className="text-xs text-gray-600">{marketStatus.description}</div>
            <div className="text-xs text-gray-500 mt-1">
              Supply: {listing.supply} | Demand: {listing.demand}
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-orange-50 rounded-2xl p-3">
              <div className="flex items-center gap-1 text-orange-700">
                <DollarSign className="w-3 h-3" />
                <span className="text-xs font-medium">Buy Price</span>
              </div>
              <div className="text-lg font-bold text-orange-800">
                ${listing.buyPrice.toFixed(2)}
              </div>
              <div className="text-xs text-orange-600">
                Base: ${listing.basePrice.toFixed(2)}
              </div>
            </div>
            
            <div className="bg-emerald-50 rounded-2xl p-3">
              <div className="flex items-center gap-1 text-emerald-700">
                <Package className="w-3 h-3" />
                <span className="text-xs font-medium">Sell Price</span>
              </div>
              <div className="text-lg font-bold text-emerald-800">
                ${listing.sellPrice.toFixed(2)}
              </div>
              <div className="text-xs text-emerald-600">
                Available: {listing.available}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={() => onBuyProduct(listing.productId, listing.buyPrice)}
              className="flex-1 bg-orange-400 hover:bg-orange-500 text-white rounded-2xl shadow-md font-semibold"
              disabled={listing.available === 0}
            >
              Buy
            </Button>
            <Button
              onClick={() => onSellProduct(listing.productId, listing.sellPrice)}
              className="flex-1 bg-emerald-300 hover:bg-emerald-400 text-white rounded-2xl shadow-md font-semibold"
              disabled={playerQuantity === 0}
            >
              Sell
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <Card className="rounded-3xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">
            Market Overview
          </CardTitle>
          <div className="text-sm text-gray-600">
            Showing all products available at your reputation level: {getReputationLevel(playerReputation).toUpperCase()}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{marketListings.length}</div>
              <div className="text-sm text-gray-600">Products Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {marketListings.filter(l => l.supplyDemandRatio < 0.8).length}
              </div>
              <div className="text-sm text-gray-600">High Demand</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {marketListings.filter(l => l.supplyDemandRatio > 1.2).length}
              </div>
              <div className="text-sm text-gray-600">High Supply</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {marketListings.filter(l => l.supplyDemandRatio >= 0.8 && l.supplyDemandRatio <= 1.2).length}
              </div>
              <div className="text-sm text-gray-600">Balanced</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products by Category */}
      <Tabs defaultValue={Object.keys(groupedListings)[0]} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          {Object.keys(groupedListings).map(category => (
            <TabsTrigger key={category} value={category} className="text-xs">
              {category.replace(' & ', ' &\n')}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {Object.entries(groupedListings).map(([category, listings]) => (
          <TabsContent key={category} value={category}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.map(renderProductCard)}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}