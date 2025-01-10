import { create } from "zustand";
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { markUnsavedChanges } from "./unsavedChangesStore";

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

  reset: () => void;
}

export const useSettingStore = create<SettingState>()(
  devtools(
    persist(
      (set) => ({
        // Strategy Type
        strategyType: "Intraday",
        setStrategyType: (type) => set(() => {
          markUnsavedChanges();
          return { strategyType: type };
        }),

        // Product Type
        productType: "Intraday",
        setProductType: (type) => set(() => {
          markUnsavedChanges();
          return { productType: type };
        }),

        // Order Type
        orderType: "Market",
        setOrderType: (type) => set(() => {
          markUnsavedChanges();
          return { orderType: type };
        }),

        // Square Off Time
        squareOffTime: "",
        setSquareOffTime: (time) => set(() => {
          markUnsavedChanges();
          return { squareOffTime: time };
        }),

        // Selected Days
        selectedDays: [],
        setSelectedDays: (days) => set(() => {
          markUnsavedChanges();
          return { selectedDays: days };
        }),

        // Selected Expiry Days
        selectedExp: [],
        setSelectedExp: (days) => set(() => {
          markUnsavedChanges();
          return { selectedExp: days };
        }),

        // Day Selector State
        selectorState: "daily",
        setSelectorState: (state) => set(() => {
          markUnsavedChanges();
          return { selectorState: state };
        }),

        // Entry Operation
        entryOperation: {
          timeLimit: "5",
          priceBuffer: "0",
          shouldExecute: true,
        },
        setEntryOperation: (operation) =>
          set((state) => {
            markUnsavedChanges();
            return {
              entryOperation: { ...state.entryOperation, ...operation },
            };
          }),

        // Exit Operation
        exitOperation: {
          timeLimit: "5",
          priceBuffer: "0",
          shouldExecute: true,
        },
        setExitOperation: (operation) =>
          set((state) => {
            markUnsavedChanges();
            return {
              exitOperation: { ...state.exitOperation, ...operation },
            };
          }),

        reset: () => set({
          strategyType: "Intraday",
          productType: "Intraday",
          orderType: "Market",
          squareOffTime: "",
          selectedDays: [],
          selectedExp: [],
          selectorState: "daily",
          entryOperation: {
            timeLimit: "5",
            priceBuffer: "0",
            shouldExecute: true,
          },
          exitOperation: {
            timeLimit: "5",
            priceBuffer: "0",
            shouldExecute: true,
          },
        })
      }),
      {
        name: 'strategy-setting-store',
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({
          strategyType: state.strategyType,
          productType: state.productType,
          orderType: state.orderType,
          squareOffTime: state.squareOffTime,
          selectedDays: state.selectedDays,
          selectedExp: state.selectedExp,
          selectorState: state.selectorState,
          entryOperation: state.entryOperation,
          exitOperation: state.exitOperation,
        })
      }
    )
  )
);