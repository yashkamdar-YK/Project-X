import { create } from "zustand";
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { markUnsavedChanges, useUnsavedChangesStore } from "./unsavedChangesStore";

interface OrderOperation {
  timeLimit: string;
  priceBuffer: string;
  shouldExecute: boolean;
}

interface SettingState {
  strategyType: "Intraday" | "Positional";
  setStrategyType: (type: "Intraday" | "Positional") => void;
  productType: "Intraday" | "Delivery";
  setProductType: (type: "Intraday" | "Delivery") => void;
  orderType: "Limit" | "Market";
  setOrderType: (type: "Limit" | "Market") => void;
  squareOffTime: string;
  setSquareOffTime: (time: string) => void;
  selectedDays: string[];
  setSelectedDays: (days: string[]) => void;
  selectedExp: string[];
  setSelectedExp: (days: string[]) => void;
  selectorState: "days" | "daily" | "exp";
  setSelectorState: (state: "days" | "daily" | "exp") => void;
  entryOperation: OrderOperation;
  setEntryOperation: (operation: Partial<OrderOperation>) => void;
  exitOperation: OrderOperation;
  setExitOperation: (operation: Partial<OrderOperation>) => void;
  reset: () => void;
}

const checkEditPermission = () => {
  const canEdit = useUnsavedChangesStore.getState().canEdit;
  if (!canEdit) {
    console.warn('Edit operation blocked: User does not have edit permission');
    return false;
  }
  return true;
};

const DEFAULT_ENTRY_OPERATION: OrderOperation = {
  timeLimit: "5",
  priceBuffer: "0",
  shouldExecute: true,
};

const DEFAULT_EXIT_OPERATION: OrderOperation = {
  timeLimit: "5",
  priceBuffer: "0",
  shouldExecute: true,
};

export const useSettingStore = create<SettingState>()(
  devtools(
    persist(
      (set) => ({
        // Strategy Type
        strategyType: "Intraday",
        setStrategyType: (type) => {
          if (!checkEditPermission()) return;
          set(() => {
            markUnsavedChanges();
            return { strategyType: type };
          });
        },

        // Product Type
        productType: "Intraday",
        setProductType: (type) => {
          if (!checkEditPermission()) return;
          set(() => {
            markUnsavedChanges();
            return { productType: type };
          });
        },

        // Order Type
        orderType: "Market",
        setOrderType: (type) => {
          if (!checkEditPermission()) return;
          set(() => {
            markUnsavedChanges();
            return { orderType: type };
          });
        },

        // Square Off Time
        squareOffTime: "",
        setSquareOffTime: (time) => {
          if (!checkEditPermission()) return;
          set(() => {
            markUnsavedChanges();
            return { squareOffTime: time };
          });
        },

        // Selected Days
        selectedDays: [],
        setSelectedDays: (days) => {
          if (!checkEditPermission()) return;
          set(() => {
            markUnsavedChanges();
            return { selectedDays: days };
          });
        },

        // Selected Expiry Days
        selectedExp: [],
        setSelectedExp: (days) => {
          if (!checkEditPermission()) return;
          set(() => {
            markUnsavedChanges();
            return { selectedExp: days };
          });
        },

        // Day Selector State
        selectorState: "daily",
        setSelectorState: (state) => {
          if (!checkEditPermission()) return;
          set(() => {
            markUnsavedChanges();
            return { selectorState: state };
          });
        },

        // Entry Operation
        entryOperation: DEFAULT_ENTRY_OPERATION,
        setEntryOperation: (operation) => {
          if (!checkEditPermission()) return;
          set((state) => {
            markUnsavedChanges();
            return {
              entryOperation: { ...state.entryOperation, ...operation },
            };
          });
        },

        // Exit Operation
        exitOperation: DEFAULT_EXIT_OPERATION,
        setExitOperation: (operation) => {
          if (!checkEditPermission()) return;
          set((state) => {
            markUnsavedChanges();
            return {
              exitOperation: { ...state.exitOperation, ...operation },
            };
          });
        },

        reset: () => {
          if (!checkEditPermission()) return;
          set({
            strategyType: "Intraday",
            productType: "Intraday",
            orderType: "Market",
            squareOffTime: "",
            selectedDays: [],
            selectedExp: [],
            selectorState: "daily",
            entryOperation: DEFAULT_ENTRY_OPERATION,
            exitOperation: DEFAULT_EXIT_OPERATION,
          });
        }
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