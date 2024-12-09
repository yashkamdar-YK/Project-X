import React, { useState } from 'react';
import { Search, Loader2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useDebounce } from '@/hooks/useDebounce';
import { symbolService } from '../../_actions';
import { cn } from '@/lib/utils';
import { useDataPointStore } from '@/lib/store/dataPointStore';

const SymbolSearch: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 300);
  
  // Get store actions
  const { setSelectedSymbol, setSymbolInfo } = useDataPointStore();

  // Query for symbols list
  const { data: symbolsData, isLoading: isLoadingSymbols, error: symbolsError } = useQuery({
    queryKey: ['symbols', debouncedSearch],
    queryFn: () => symbolService.getSymbols(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  // Query for symbol info
  const symbolInfoMutation = useMutation({
    mutationFn: () => symbolService.getSymbolInfo(searchValue),
    onSuccess: (data) => {
      setSymbolInfo(searchValue, data);
    },
    mutationKey: ['symbolInfo'],
  })

  const handleSelect = async (symbol: string) => {
    setSearchValue(symbol);
    setSelectedSymbol(symbol);
    setOpen(false);
    
    // Fetch symbol info when selected
    await symbolInfoMutation.mutateAsync();
  };

  const clearSearch = () => {
    setSearchValue("");
  };

  const renderSymbolList = () => {
    if (isLoadingSymbols) {
      return (
        <div className="flex flex-col items-center justify-center p-8 space-y-4 text-gray-500 dark:text-gray-400">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm">Searching for symbols...</p>
        </div>
      );
    }

    if (symbolsError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 space-y-2">
          <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-3">
            <X className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-sm text-red-600 dark:text-red-400">Failed to load symbols</p>
        </div>
      );
    }

    if (!symbolsData || Object.keys(symbolsData).length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-8 space-y-2 text-gray-500 dark:text-gray-400">
          <Search className="h-6 w-6" />
          <p className="text-sm">No symbols found</p>
        </div>
      );
    }

    return (
      <div className="max-h-[300px] overflow-y-auto px-1 divide-y divide-gray-100 dark:divide-gray-800">
        {Object.entries(symbolsData).map(([symbol, data]) => (
          <button
            key={symbol}
            onClick={() => handleSelect(symbol)}
            className="w-full px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg group"
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-medium text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white">
                  {symbol}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {data.exchange}
                </span>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full">
                  {symbolInfoMutation.isPending ? 'Loading...' : 'Select'}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="relative w-28 sm:w-40 md:w-48">
      <div className="relative">
        <Search 
          size={16} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" 
        />
        <Input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className={cn(
            "pl-10 pr-4 py-2 rounded-lg transition-all duration-200",
            "bg-white dark:bg-gray-800",
            "border-gray-200 dark:border-gray-700",
            "hover:border-gray-300 dark:hover:border-gray-600",
            "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
            "dark:focus:ring-blue-500/20 dark:focus:border-blue-500"
          )}
          placeholder="NIFTY"
          aria-label="Search symbols"
          onClick={() => setOpen(true)}
        />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden">
          <DialogHeader className="p-4 border-b border-gray-100 dark:border-gray-800">
            <DialogTitle>Select Symbol</DialogTitle>
          </DialogHeader>
          <div className="p-4 pb-2">
            <div className="relative">
              <Search 
                size={16} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" 
              />
              <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className={cn(
                  "pl-10 pr-10",
                  "bg-gray-50 dark:bg-gray-800",
                  "border-gray-200 dark:border-gray-700",
                  "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                  "dark:focus:ring-blue-500/20 dark:focus:border-blue-500"
                )}
                placeholder="Search symbols..."
                autoFocus
              />
              {searchValue && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
          {renderSymbolList()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SymbolSearch;