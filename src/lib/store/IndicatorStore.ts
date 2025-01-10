import { IndicatorStore } from "@/app/(root)/dashboard/strategy-builder/_components/DashboardSidebar/Indicators/types";
import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { markUnsavedChanges } from "./unsavedChangesStore";

export const useIndicatorStore = create<IndicatorStore>()(
  devtools(
    persist(
      (set) => ({
        indicators: [],
        selectedIndicator: null,

        setIndicators: (indicators) => set({ indicators }),

        addIndicator: (indicator) =>
          set((state) => {
            markUnsavedChanges();
            return {
              indicators: [...state.indicators, indicator],
            };
          }),

        removeIndicator: (id) =>
          set((state) => {
            markUnsavedChanges();
            return {
              indicators: state.indicators.filter((ind) => ind.id !== id),
              selectedIndicator:
                state.selectedIndicator === id ? null : state.selectedIndicator,
            };
          }),

        setSelectedIndicator: (id) => set({ selectedIndicator: id }),

        updateIndicator: (id, updatedData) =>
          //@ts-ignore
          set((state) => {
            markUnsavedChanges();
            return {
              indicators: state.indicators.map((ind) =>
                ind.id === id ? { ...ind, ...updatedData } : ind
              ),
            };
          }),

        clearIndicators: () => set({ indicators: [] }),
      }),
      {
        name: "strategy-indicator-store",
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({
          indicators: state.indicators,
          selectedIndicator: state.selectedIndicator,
        }),
      }
    )
  )
);
