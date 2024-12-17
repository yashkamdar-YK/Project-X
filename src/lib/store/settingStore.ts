import { create } from "zustand";

interface OrderOperation {
  timeLimit: string;
  priceBuffer: string;
  shouldExecute: boolean;
}

interface SettingState {
  // Strategy Type
  strategyType: "Intraday" | "Positional";
  setStrategyType: (type: "Intraday" | "Positional") => void;

  // Product Type
  productType: "Intraday" | "Delivery";
  setProductType: (type: "Intraday" | "Delivery") => void;

  // Order Type
  orderType: "Limit" | "Market";
  setOrderType: (type: "Limit" | "Market") => void;

  // Square Off Time
  squareOffTime: string;
  setSquareOffTime: (time: string) => void;

  // Selected Days
  selectedDays: string[];
  setSelectedDays: (days: string[]) => void;

  // Selected Expiry Days
  selectedExp: string[];
  setSelectedExp: (days: string[]) => void;

  // Day Selector State
  selectorState: "days" | "daily" | "exp";
  setSelectorState: (state: "days" | "daily" | "exp") => void;

  // Order Operations
  entryOperation: OrderOperation;
  setEntryOperation: (operation: Partial<OrderOperation>) => void;
  
  exitOperation: OrderOperation;
  setExitOperation: (operation: Partial<OrderOperation>) => void;
}

export const useSettingStore = create<SettingState>((set) => ({
  // Strategy Type
  strategyType: "Intraday",
  setStrategyType: (type) => set({ strategyType: type }),

  // Product Type
  productType: "Intraday",
  setProductType: (type) => set({ productType: type }),

  // Order Type
  orderType: "Limit",
  setOrderType: (type) => set({ orderType: type }),

  // Square Off Time
  squareOffTime: "",
  setSquareOffTime: (time) => set({ squareOffTime: time }),

  // Selected Days
  selectedDays: [],
  setSelectedDays: (days) => set({ selectedDays: days }),

  // Selected Expiry Days
  selectedExp: [],
  setSelectedExp: (days) => set({ selectedExp: days }),

  // Day Selector State
  selectorState: "daily",
  setSelectorState: (state) => set({ selectorState: state }),

  // Entry Operation
  entryOperation: {
    timeLimit: "10",
    priceBuffer: "0",
    shouldExecute: true,
  },
  setEntryOperation: (operation) =>
    set((state) => ({
      entryOperation: { ...state.entryOperation, ...operation },
    })),

  // Exit Operation
  exitOperation: {
    timeLimit: "10",
    priceBuffer: "0",
    shouldExecute: true,
  },
  setExitOperation: (operation) =>
    set((state) => ({
      exitOperation: { ...state.exitOperation, ...operation },
    })),
}));