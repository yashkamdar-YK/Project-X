import { DataPointsStore } from "@/app/(root)/dashboard/strategy-builder/_components/DashboardSidebar/DatapointDialog/types";
import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { markUnsavedChanges } from "./unsavedChangesStore";

export const useDataPointsStore = create<DataPointsStore>()(
  devtools(
    persist(
      (set) => ({
        dataPoints: [],
        setDataPoints: (dataPoints) => set({ dataPoints }),

        addDataPoint: (dataPoint) =>
          set((state) => {
            markUnsavedChanges();
            return {
              dataPoints: [...state.dataPoints, dataPoint],
            };
          }),

        removeDataPoint: (id) =>
          set((state) => {
            markUnsavedChanges();
            return {
              dataPoints: state.dataPoints.filter((dp) => dp.id !== id),
            };
          }),

        updateDataPoint: (id, updatedData) =>
          set((state) => {
            markUnsavedChanges();
            return {
              dataPoints: state.dataPoints.map((dp) =>
                dp.id === id ? { ...dp, ...updatedData } : dp
              ),
            };
          }),

        clearDataPoints: () => set({ dataPoints: [] }),
      }),
      {
        name: "strategy-datapoints-store",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);
