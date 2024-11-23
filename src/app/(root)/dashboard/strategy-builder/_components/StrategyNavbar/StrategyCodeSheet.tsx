import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from '@/components/providers/theme-provider';
import { Highlight, themes } from 'prism-react-renderer';

interface StrategyCodeSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEMO_CODE = `import pandas as pd
import numpy as np

def calculate_strategy(data: pd.DataFrame) -> pd.DataFrame:
    """
    Calculate trading signals based on moving average crossover
    """
    # Calculate moving averages
    data['SMA_20'] = data['close'].rolling(window=20).mean()
    data['SMA_50'] = data['close'].rolling(window=50).mean()
    
    # Generate signals
    data['signal'] = np.where(
        data['SMA_20'] > data['SMA_50'], 
        1,  # Buy signal
        -1  # Sell signal
    )
    
    # Calculate strategy returns
    data['returns'] = data['close'].pct_change()
    data['strategy_returns'] = data['signal'].shift(1) * data['returns']
    
    return data

def backtest_strategy(data: pd.DataFrame) -> dict:
    """
    Backtest the strategy and calculate performance metrics
    """
    results = {
        'total_return': data['strategy_returns'].sum(),
        'sharpe_ratio': data['strategy_returns'].mean() / data['strategy_returns'].std(),
        'max_drawdown': (data['strategy_returns'].cumsum().cummax() - 
                        data['strategy_returns'].cumsum()).max()
    }
    return results`;

const StrategyCodeSheet = ({ isOpen, onClose }: StrategyCodeSheetProps) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = React.useState('python');

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>Strategy Code</SheetTitle>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="python">Python</TabsTrigger>
          </TabsList>

          <TabsContent value="python" className="mt-0">
            <div className="relative rounded-md overflow-hidden">
              <Highlight
                theme={theme === 'dark' ? themes.dracula : themes.github}
                code={DEMO_CODE}
                language="python"
              >
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                  <pre className={`${className} p-4 overflow-x-auto`} style={style}>
                    {tokens.map((line, i) => (
                      <div key={i} {...getLineProps({ line })} className="table-row">
                        <span className="table-cell text-right pr-4 select-none opacity-50 text-sm">
                          {i + 1}
                        </span>
                        <span className="table-cell">
                          {line.map((token, key) => (
                            <span key={key} {...getTokenProps({ token })} />
                          ))}
                        </span>
                      </div>
                    ))}
                  </pre>
                )}
              </Highlight>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default StrategyCodeSheet;