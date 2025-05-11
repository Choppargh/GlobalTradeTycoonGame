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
import { useGameStore } from '@/lib/stores/useGameStore';

export function Inventory() {
  const { inventory } = useGameStore();
  
  const formatCurrency = (amount: number): string => {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };
  
  const calculateTotalValue = (): number => {
    return inventory.reduce((total, item) => {
      return total + (item.quantity * item.purchasePrice);
    }, 0);
  };

  return (
    <Card className="shadow-none rounded-none border-0 h-full overflow-hidden">
      <CardHeader className="pb-3 pt-2 px-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Inventory</CardTitle>
            <CardDescription>
              Your current stock: {inventory.reduce((sum, item) => sum + item.quantity, 0)} items
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Total Value</div>
            <div className="font-semibold">{formatCurrency(calculateTotalValue())}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-auto max-h-[350px] sm:max-h-[450px]">
        <Table>
          <TableHeader className="sticky top-0 bg-card">
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right hidden xs:table-cell">Bought At</TableHead>
              <TableHead className="text-right">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.length > 0 ? (
              inventory.map((item) => (
                <TableRow key={item.productId}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right hidden xs:table-cell">{formatCurrency(item.purchasePrice)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.quantity * item.purchasePrice)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  Your inventory is empty. Buy some products!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
