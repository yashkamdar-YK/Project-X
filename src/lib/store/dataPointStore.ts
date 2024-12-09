import { create } from 'zustand';

// Types for API responses and store data
interface SymbolData {
  exchange: string;
}

interface ExecutionSettings {
  orderType: string[];
  productType: string[];
}

interface OptExp {
  weekly?: number[];
  monthly: number[];
}

interface SymbolInfo {
  exchange: string;
  isWeekly: boolean;
  OptExp: OptExp;
  FutExp: {
    monthly: number[];
  };
  tickSize: number;
  executionSettings: ExecutionSettings;
  symbol: string;
  timeFrame: number[];
}

interface DataPointState {
  symbols: Record<string, SymbolData>;
  symbolInfo: Record<string, SymbolInfo>;
  selectedSymbol: string | null;
  isLoadingSymbols: boolean;
  isLoadingSymbolInfo: boolean;
  error: string | null;

  // Actions
  setSymbols: (symbols: Record<string, SymbolData>) => void;
  setSymbolInfo: (symbol: string, info: SymbolInfo) => void;
  setSelectedSymbol: (symbol: string | null) => void;
  setIsLoadingSymbols: (isLoading: boolean) => void;
  setIsLoadingSymbolInfo: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

// Initial state
const initialState = {
  symbols: {},
  symbolInfo: {},
  selectedSymbol: null,
  isLoadingSymbols: false,
  isLoadingSymbolInfo: false,
  error: null,
};

export const useDataPointStore = create<DataPointState>((set) => ({
  ...initialState,

  // Setters
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

  // Reset store to initial state
  reset: () => set(initialState),
}));

// Export types for use in other files
export type { SymbolData, SymbolInfo, ExecutionSettings, OptExp };