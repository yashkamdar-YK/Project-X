import {create} from "zustand";

interface SettingState {
  strategyType: string;
  setStrategyType: (type: string) => void;
}

export const useSettingStore = create<SettingState>((set) => ({
  strategyType: "Intraday",
  setStrategyType: (type: string) => set({ strategyType: type }),
  
}));
