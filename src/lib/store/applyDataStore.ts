
import { TUrlMapping } from "@/app/(root)/dashboard/strategy-builder/_actions";
import { DataPointOption } from "@/app/(root)/dashboard/strategy-builder/_components/DashboardSidebar/DatapointDialog/types";
import { create } from "zustand";

// Define the store state interface
interface ActionState {
  data:{
    [key in keyof TUrlMapping]:  DataPointOption | string[]
  },
  setData: (key: keyof TUrlMapping, data: DataPointOption | string[]) => void,
  getData: (key: keyof TUrlMapping) => DataPointOption |string[]| undefined;
}

// Create the store
export const useApplyDataStore = create<ActionState>((set,get) => ({
  data: {} as any,
  setData: (key, data) => set((state) => ({ data: { ...state.data, [key]: data } })),
  getData: (key) => {
    return get().data[key];
  }
}));
