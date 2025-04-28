import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useGameStore } from '@/lib/stores/useGameStore';

export function BankInterface() {
  const { cash, bankBalance, loanAmount, isBankModalOpen, setBankModalOpen, handleBankAction } = useGameStore();
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [loanRequestAmount, setLoanRequestAmount] = useState<string>('');
  const [repayAmount, setRepayAmount] = useState<string>('');
  
  // Reset form values when dialog opens
  useEffect(() => {
    if (isBankModalOpen) {
      setDepositAmount('');
      setWithdrawAmount('');
      setLoanRequestAmount('');
      setRepayAmount('');
    }
  }, [isBankModalOpen]);
  
  const handleDeposit = () => {
    const amount = Number(depositAmount);
    if (isNaN(amount) || amount <= 0) return;
    
    handleBankAction('deposit', amount);
    setDepositAmount('');
  };
  
  const handleWithdraw = () => {
    const amount = Number(withdrawAmount);
    if (isNaN(amount) || amount <= 0) return;
    
    handleBankAction('withdraw', amount);
    setWithdrawAmount('');
  };
  
  const handleRequestLoan = () => {
    const amount = Number(loanRequestAmount);
    if (isNaN(amount) || amount <= 0) return;
    
    handleBankAction('loan', amount);
    setLoanRequestAmount('');
  };
  
  const handleRepayLoan = () => {
    const amount = Number(repayAmount);
    if (isNaN(amount) || amount <= 0) return;
    
    handleBankAction('repay', amount);
    setRepayAmount('');
  };
  
  const formatCurrency = (amount: number): string => {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };
  
  const loanAvailable = 10000 - loanAmount;

  return (
    <Dialog open={isBankModalOpen} onOpenChange={setBankModalOpen}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Global Trade Bank</DialogTitle>
          <DialogDescription>
            Manage your finances and loans
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-1">
            <div className="text-sm font-medium">Cash</div>
            <div className="text-lg font-bold">{formatCurrency(cash)}</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm font-medium">Bank Balance</div>
            <div className="text-lg font-bold">{formatCurrency(bankBalance)}</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm font-medium">Loan Amount</div>
            <div className="text-lg font-bold text-red-500">{formatCurrency(loanAmount)}</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm font-medium">Available Credit</div>
            <div className="text-lg font-bold">{formatCurrency(loanAvailable)}</div>
          </div>
        </div>
        
        <Tabs defaultValue="deposit" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="deposit">Deposit</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
            <TabsTrigger value="borrow">Borrow</TabsTrigger>
            <TabsTrigger value="repay">Repay</TabsTrigger>
          </TabsList>
          
          <TabsContent value="deposit" className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Deposit cash to your bank account. The money will be safe but can't be used for trading until withdrawn.
              </p>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  placeholder="Amount to deposit"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  max={cash}
                />
                <Button 
                  onClick={handleDeposit}
                  disabled={!depositAmount || Number(depositAmount) <= 0 || Number(depositAmount) > cash}
                >
                  Deposit
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="withdraw" className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Withdraw money from your bank account to use for trading.
              </p>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  placeholder="Amount to withdraw"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  max={bankBalance}
                />
                <Button 
                  onClick={handleWithdraw}
                  disabled={!withdrawAmount || Number(withdrawAmount) <= 0 || Number(withdrawAmount) > bankBalance}
                >
                  Withdraw
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="borrow" className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Borrow money from the bank. Remember that your loan increases by 5% every time you travel!
              </p>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  placeholder="Amount to borrow"
                  value={loanRequestAmount}
                  onChange={(e) => setLoanRequestAmount(e.target.value)}
                  max={loanAvailable}
                />
                <Button 
                  onClick={handleRequestLoan}
                  disabled={!loanRequestAmount || Number(loanRequestAmount) <= 0 || Number(loanRequestAmount) > loanAvailable}
                >
                  Borrow
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="repay" className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Repay your loan to reduce interest costs when traveling.
              </p>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  placeholder="Amount to repay"
                  value={repayAmount}
                  onChange={(e) => setRepayAmount(e.target.value)}
                  max={Math.min(cash, loanAmount)}
                />
                <Button 
                  onClick={handleRepayLoan}
                  disabled={
                    !repayAmount || 
                    Number(repayAmount) <= 0 || 
                    Number(repayAmount) > cash || 
                    Number(repayAmount) > loanAmount
                  }
                >
                  Repay
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
