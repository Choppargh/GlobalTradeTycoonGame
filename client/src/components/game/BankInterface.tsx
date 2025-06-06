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
import { Slider } from '@/components/ui/slider';
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
          <TabsList className="grid grid-cols-4 mb-4 bg-gray-100 p-1 rounded-md shadow-sm">
            <TabsTrigger 
              value="deposit" 
              className="font-medium text-green-700 data-[state=active]:bg-green-100 data-[state=active]:text-green-800 data-[state=active]:shadow-md transition-all hover:bg-gray-200 hover:text-green-700"
            >
              Deposit
            </TabsTrigger>
            <TabsTrigger 
              value="withdraw" 
              className="font-medium text-blue-700 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800 data-[state=active]:shadow-md transition-all hover:bg-gray-200 hover:text-blue-700"
            >
              Withdraw
            </TabsTrigger>
            <TabsTrigger 
              value="borrow" 
              className="font-medium text-purple-700 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800 data-[state=active]:shadow-md transition-all hover:bg-gray-200 hover:text-purple-700"
            >
              Borrow
            </TabsTrigger>
            <TabsTrigger 
              value="repay" 
              className="font-medium text-red-700 data-[state=active]:bg-red-100 data-[state=active]:text-red-800 data-[state=active]:shadow-md transition-all hover:bg-gray-200 hover:text-red-700"
            >
              Repay
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="deposit" className="space-y-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Deposit cash to your bank account. The money will be safe but can't be used for trading until withdrawn.
              </p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Amount to deposit:</span>
                    <span>{depositAmount ? formatCurrency(Number(depositAmount)) : '$0.00'}</span>
                  </div>
                  
                  <div className="relative pt-5 pb-1">
                    <div className="relative">
                      <Slider
                        value={[Number(depositAmount) || 0]}
                        min={0}
                        max={cash}
                        step={1}
                        onValueChange={(value) => setDepositAmount(value[0].toString())}
                        className="py-4"
                      />
                      
                      {depositAmount && Number(depositAmount) > 0 && (
                        <div 
                          className="absolute text-xs font-medium bg-indigo-600 text-white px-2 py-0.5 rounded-md -translate-x-1/2"
                          style={{ 
                            left: `${(Number(depositAmount) / cash) * 100}%`, 
                            top: '110%' 
                          }}
                        >
                          ${Number(depositAmount).toFixed(0)}
                        </div>
                      )}
                    </div>
                    
                    <div className="absolute w-full flex justify-between text-xs text-gray-500 -mt-1">
                      <span>0</span>
                      <span>{Math.floor(cash)}</span>
                    </div>
                    
                    <div className="flex justify-between text-xs text-muted-foreground mt-6">
                      <span>${(0).toFixed(2)}</span>
                      <span>{formatCurrency(cash)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Custom amount"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    max={cash}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDepositAmount(cash.toString())}
                  >
                    Max
                  </Button>
                </div>
                
                <Button 
                  onClick={handleDeposit}
                  disabled={!depositAmount || Number(depositAmount) <= 0 || Number(depositAmount) > cash}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  Deposit {depositAmount ? formatCurrency(Number(depositAmount)) : '$0.00'}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="withdraw" className="space-y-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Withdraw money from your bank account to use for trading.
              </p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Amount to withdraw:</span>
                    <span>{withdrawAmount ? formatCurrency(Number(withdrawAmount)) : '$0.00'}</span>
                  </div>
                  
                  <div className="relative pt-5 pb-1">
                    <div className="relative">
                      <Slider
                        value={[Number(withdrawAmount) || 0]}
                        min={0}
                        max={bankBalance}
                        step={1}
                        onValueChange={(value) => setWithdrawAmount(value[0].toString())}
                        className="py-4"
                      />
                      
                      {withdrawAmount && Number(withdrawAmount) > 0 && (
                        <div 
                          className="absolute text-xs font-medium bg-indigo-600 text-white px-2 py-0.5 rounded-md -translate-x-1/2"
                          style={{ 
                            left: `${(Number(withdrawAmount) / bankBalance) * 100}%`, 
                            top: '110%' 
                          }}
                        >
                          ${Number(withdrawAmount).toFixed(0)}
                        </div>
                      )}
                    </div>
                    
                    <div className="absolute w-full flex justify-between text-xs text-gray-500 -mt-1">
                      <span>0</span>
                      <span>{Math.floor(bankBalance)}</span>
                    </div>
                    
                    <div className="flex justify-between text-xs text-muted-foreground mt-6">
                      <span>${(0).toFixed(2)}</span>
                      <span>{formatCurrency(bankBalance)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Custom amount"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    max={bankBalance}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setWithdrawAmount(bankBalance.toString())}
                  >
                    Max
                  </Button>
                </div>
                
                <Button 
                  onClick={handleWithdraw}
                  disabled={!withdrawAmount || Number(withdrawAmount) <= 0 || Number(withdrawAmount) > bankBalance}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Withdraw {withdrawAmount ? formatCurrency(Number(withdrawAmount)) : '$0.00'}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="borrow" className="space-y-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Borrow money from the bank. Remember that your loan increases by 5% every time you travel!
              </p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Amount to borrow:</span>
                    <span>{loanRequestAmount ? formatCurrency(Number(loanRequestAmount)) : '$0.00'}</span>
                  </div>
                  
                  <div className="relative pt-5 pb-1">
                    <div className="relative">
                      <Slider
                        value={[Number(loanRequestAmount) || 0]}
                        min={0}
                        max={loanAvailable}
                        step={1}
                        onValueChange={(value) => setLoanRequestAmount(value[0].toString())}
                        className="py-4"
                      />
                      
                      {loanRequestAmount && Number(loanRequestAmount) > 0 && (
                        <div 
                          className="absolute text-xs font-medium bg-indigo-600 text-white px-2 py-0.5 rounded-md -translate-x-1/2"
                          style={{ 
                            left: `${(Number(loanRequestAmount) / loanAvailable) * 100}%`, 
                            top: '110%' 
                          }}
                        >
                          ${Number(loanRequestAmount).toFixed(0)}
                        </div>
                      )}
                    </div>
                    
                    <div className="absolute w-full flex justify-between text-xs text-gray-500 -mt-1">
                      <span>0</span>
                      <span>{Math.floor(loanAvailable)}</span>
                    </div>
                    
                    <div className="flex justify-between text-xs text-muted-foreground mt-6">
                      <span>${(0).toFixed(2)}</span>
                      <span>{formatCurrency(loanAvailable)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Custom amount"
                    value={loanRequestAmount}
                    onChange={(e) => setLoanRequestAmount(e.target.value)}
                    max={loanAvailable}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLoanRequestAmount(loanAvailable.toString())}
                  >
                    Max
                  </Button>
                </div>
                
                <Button 
                  onClick={handleRequestLoan}
                  disabled={!loanRequestAmount || Number(loanRequestAmount) <= 0 || Number(loanRequestAmount) > loanAvailable}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Borrow {loanRequestAmount ? formatCurrency(Number(loanRequestAmount)) : '$0.00'}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="repay" className="space-y-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Repay your loan to reduce interest costs when traveling.
              </p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Amount to repay:</span>
                    <span>{repayAmount ? formatCurrency(Number(repayAmount)) : '$0.00'}</span>
                  </div>
                  
                  <div className="relative pt-5 pb-1">
                    <div className="relative">
                      <Slider
                        value={[Number(repayAmount) || 0]}
                        min={0}
                        max={Math.min(cash, loanAmount)}
                        step={1}
                        onValueChange={(value) => setRepayAmount(value[0].toString())}
                        className="py-4"
                      />
                      
                      {repayAmount && Number(repayAmount) > 0 && (
                        <div 
                          className="absolute text-xs font-medium bg-indigo-600 text-white px-2 py-0.5 rounded-md -translate-x-1/2"
                          style={{ 
                            left: `${(Number(repayAmount) / Math.min(cash, loanAmount)) * 100}%`, 
                            top: '110%' 
                          }}
                        >
                          ${Number(repayAmount).toFixed(0)}
                        </div>
                      )}
                    </div>
                    
                    <div className="absolute w-full flex justify-between text-xs text-gray-500 -mt-1">
                      <span>0</span>
                      <span>{Math.floor(Math.min(cash, loanAmount))}</span>
                    </div>
                    
                    <div className="flex justify-between text-xs text-muted-foreground mt-6">
                      <span>${(0).toFixed(2)}</span>
                      <span>{formatCurrency(Math.min(cash, loanAmount))}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Custom amount"
                    value={repayAmount}
                    onChange={(e) => setRepayAmount(e.target.value)}
                    max={Math.min(cash, loanAmount)}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRepayAmount(Math.min(cash, loanAmount).toString())}
                  >
                    Max
                  </Button>
                </div>
                
                <Button 
                  onClick={handleRepayLoan}
                  disabled={
                    !repayAmount || 
                    Number(repayAmount) <= 0 || 
                    Number(repayAmount) > cash || 
                    Number(repayAmount) > loanAmount
                  }
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                >
                  Repay {repayAmount ? formatCurrency(Number(repayAmount)) : '$0.00'}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
