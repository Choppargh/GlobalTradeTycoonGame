import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Trophy } from 'lucide-react';
import { LeaderboardEntry } from '@/types/game';
import { cn } from '@/lib/utils';

interface LeaderboardProps {
  scores: LeaderboardEntry[];
  currentUsername?: string;
}

export function Leaderboard({ scores, currentUsername }: LeaderboardProps) {
  const formatCurrency = (amount: number): string => {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="rounded-3xl border-0 shadow-lg overflow-hidden bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Rank</TableHead>
            <TableHead>Trader</TableHead>
            <TableHead className="text-right">Days</TableHead>
            <TableHead className="text-right">Bank Balance</TableHead>
            <TableHead className="text-right hidden sm:table-cell">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scores.slice(0, 10).map((entry, index) => (
            <TableRow 
              key={entry.id}
              className={cn(
                entry.username === currentUsername && "bg-muted/50 font-medium"
              )}
            >
              <TableCell>
                {index === 0 ? (
                  <Trophy className="h-4 w-4 text-yellow-500" />
                ) : index === 1 ? (
                  <Trophy className="h-4 w-4 text-gray-400" />
                ) : index === 2 ? (
                  <Trophy className="h-4 w-4 text-amber-700" />
                ) : (
                  index + 1
                )}
              </TableCell>
              <TableCell>{entry.username}</TableCell>
              <TableCell className="text-right">{entry.days}</TableCell>
              <TableCell className="text-right font-medium">{formatCurrency(entry.score)}</TableCell>
              <TableCell className="text-right text-muted-foreground hidden sm:table-cell">
                {formatDate(entry.createdAt)}
              </TableCell>
            </TableRow>
          ))}
          
          {scores.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="h-16 text-center">
                No scores recorded yet. You're the first player!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
