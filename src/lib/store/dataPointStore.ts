import {
  SymbolData,
  SymbolInfo,
} from "@/app/(root)/dashboard/strategy-builder/_components/DashboardSidebar/DatapointDialog/types";
import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { markUnsavedChanges, useUnsavedChangesStore } from "./unsavedChangesStore";

interface DataPointState {
  symbols: Record<string, SymbolData>;
  symbolInfo: Record<string, SymbolInfo>;
  selectedSymbol: string | null;
  isLoadingSymbols: boolean;
  isLoadingSymbolInfo: boolean;
  error: string | null;
  selectedTimeFrame: number;
  setSymbols: (symbols: Record<string, SymbolData>) => void;
  setSymbolInfo: (symbol: string, info: SymbolInfo) => void;
  setSelectedSymbol: (symbol: string | null) => void;
  setIsLoadingSymbols: (isLoading: boolean) => void;
  setIsLoadingSymbolInfo: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
  setSelectedTimeFrame: (timeFrame: number) => void;
}

const checkEditPermission = () => {
  const canEdit = useUnsavedChangesStore.getState().canEdit;
  if (!canEdit) {
    console.warn('Edit operation blocked: User does not have edit permission');
    return false;
  }
  return true;
};

export const useDataPointStore = create<DataPointState>()(
  devtools(
    persist(
      (set) => ({
        symbols: {},
        symbolInfo: {},
        selectedSymbol: "NIFTY",
        isLoadingSymbols: false,
        isLoadingSymbolInfo: false,
        error: null,
        selectedTimeFrame: 0,

        setSelectedTimeFrame: (timeFrame) => {
          if (!checkEditPermission()) return;
          set(() => ({ selectedTimeFrame: timeFrame }));
        },

        setSymbols: (symbols) => {
          if (!checkEditPermission()) return;
          set({ symbols, error: null });
        },

        setSymbolInfo: (symbol, info) => {
          if (!checkEditPermission()) return;
          set((state) => ({
            symbolInfo: {
              ...state.symbolInfo,
              [symbol]: info,
            },
            error: null,
          }));
        },

        setSelectedSymbol: (symbol) => {
          if (!checkEditPermission()) return;
          set(() => ({ selectedSymbol: symbol }));
        },

        // Loading states don't require edit permission as they don't modify persisted data
        setIsLoadingSymbols: (isLoadingSymbols) => set({ isLoadingSymbols }),
        
        setIsLoadingSymbolInfo: (isLoadingSymbolInfo) => 
          set({ isLoadingSymbolInfo }),

        // Error handling doesn't require edit permission
        setError: (error) => set({ error }),
        clearError: () => set({ error: null }),

        reset: () => {
          if (!checkEditPermission()) return;
          set({
            symbols: {},
            symbolInfo: {},
            selectedSymbol: null,
            isLoadingSymbols: false,
            isLoadingSymbolInfo: false,
            error: null,
            selectedTimeFrame: 0,
          });
        },
      }),
      {
        name: "strategy-datapoint-store",
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({
          symbols: state.symbols,
          symbolInfo: state.symbolInfo,
          selectedSymbol: state.selectedSymbol,
          selectedTimeFrame: state.selectedTimeFrame,
        }),
      }
    )
  )
);