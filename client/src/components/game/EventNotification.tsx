import { useState, useEffect } from 'react';
import { AlertTriangle, DollarSign, Package, TrendingUp, TrendingDown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { GameEvent } from '@/lib/gameLogic';

interface EventNotificationProps {
  event: GameEvent | null;
  onClose: () => void;
}

export function EventNotification({ event, onClose }: EventNotificationProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    if (event) {
      setIsOpen(true);
    }
  }, [event]);
  
  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };
  
  if (!event) return null;
  
  const getEventIcon = () => {
    switch (event.type) {
      case 'price_change':
        return event.modifier && event.modifier > 1 
          ? <TrendingUp className="h-6 w-6 text-red-500" /> 
          : <TrendingDown className="h-6 w-6 text-green-500" />;
      case 'inventory_boost':
        return <Package className="h-6 w-6 text-blue-500" />;
      case 'cash_bonus':
        return <DollarSign className="h-6 w-6 text-green-500" />;
      case 'market_crash':
        return <TrendingDown className="h-6 w-6 text-red-500" />;
      case 'market_boom':
        return <TrendingUp className="h-6 w-6 text-green-500" />;
      default:
        return <AlertTriangle className="h-6 w-6 text-amber-500" />;
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            {getEventIcon()}
            <DialogTitle className="text-xl">{event.title}</DialogTitle>
          </div>
          <DialogDescription className="text-base pt-2">
            {event.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-4 bg-muted/40 rounded-md">
          {event.type === 'price_change' && event.modifier && (
            <p>
              Price {event.modifier > 1 ? 'increase' : 'decrease'} of {Math.abs((event.modifier - 1) * 100).toFixed(0)}% 
              {event.affectedProducts && event.affectedProducts.length === 1 
                ? ` on ${event.affectedProducts.length} product` 
                : ` on ${event.affectedProducts?.length || 'multiple'} products`}
            </p>
          )}
          
          {event.type === 'market_crash' && (
            <p>All prices have dropped by {Math.abs((event.modifier! - 1) * 100).toFixed(0)}%</p>
          )}
          
          {event.type === 'market_boom' && (
            <p>All prices have increased by {Math.abs((event.modifier! - 1) * 100).toFixed(0)}%</p>
          )}
          
          {event.type === 'inventory_boost' && (
            <p>Your inventory has increased by {Math.abs((event.modifier! - 1) * 100).toFixed(0)}%</p>
          )}
          
          {event.type === 'cash_bonus' && (
            <p>You received a cash bonus of ${event.cashAmount?.toLocaleString()}</p>
          )}
        </div>
        
        <DialogFooter>
          <Button onClick={handleClose}>Continue Trading</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}