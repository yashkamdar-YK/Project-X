// dataPointStore.ts
import { SymbolData, SymbolInfo } from '@/app/(root)/dashboard/strategy-builder/_components/DashboardSidebar/DatapointDialog/types';
import { create } from 'zustand';

interface DataPointState {
  symbols: Record<string, SymbolData>;
  symbolInfo: Record<string, SymbolInfo>;
  selectedSymbol: string | null;
  isLoadingSymbols: boolean;
  isLoadingSymbolInfo: boolean;
  error: string | null;
  setSymbols: (symbols: Record<string, SymbolData>) => void;
  setSymbolInfo: (symbol: string, info: SymbolInfo) => void;
  setSelectedSymbol: (symbol: string | null) => void;
  setIsLoadingSymbols: (isLoading: boolean) => void;
  setIsLoadingSymbolInfo: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

export const useDataPointStore = create<DataPointState>((set) => ({
  symbols: {},
  symbolInfo: {},
  selectedSymbol: null,
  isLoadingSymbols: false,
  isLoadingSymbolInfo: false,
  error: null,
  setSymbols: (symbols) => set({ symbols, error: null }),
  setSymbolInfo: (symbol, info) =>
    set((state) => ({
      symbolInfo: {
        ...state.symbolInfo,
        [symbol]: info
      },
      error: null
    })),
  setSelectedSymbol: (symbol) => set({ selectedSymbol: symbol }),
  setIsLoadingSymbols: (isLoadingSymbols) => set({ isLoadingSymbols }),
  setIsLoadingSymbolInfo: (isLoadingSymbolInfo) => set({ isLoadingSymbolInfo }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  reset: () => set({
    symbols: {},
    symbolInfo: {},
    selectedSymbol: null,
    isLoadingSymbols: false,
    isLoadingSymbolInfo: false,
    error: null
  })
}));