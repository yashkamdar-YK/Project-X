import { IndicatorStore } from "@/app/(root)/dashboard/strategy-builder/_components/DashboardSidebar/Indicators/types";
import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { markUnsavedChanges, useUnsavedChangesStore } from "./unsavedChangesStore";

const checkEditPermission = () => {
  const canEdit = useUnsavedChangesStore.getState().canEdit;
  if (!canEdit) {
    console.warn('Edit operation blocked: User does not have edit permission');
    return false;
  }
  return true;
};

export const useIndicatorStore = create<IndicatorStore>()(
  devtools(
    persist(
      (set) => ({
        indicators: [],
        selectedIndicator: null,

        setIndicators: (indicators) => {
          if (!checkEditPermission()) return;
          set({ indicators });
        },

        addIndicator: (indicator) => {
          if (!checkEditPermission()) return;
          set((state) => {
            markUnsavedChanges();
            return {
              indicators: [...state.indicators, indicator],
            };
          });
        },

        removeIndicator: (id) => {
          if (!checkEditPermission()) return;
          set((state) => {
            markUnsavedChanges();
            return {
              indicators: state.indicators.filter((ind) => ind.id !== id),
              selectedIndicator:
                state.selectedIndicator === id ? null : state.selectedIndicator,
            };
          });
        },

        setSelectedIndicator: (id) => {
          if (!checkEditPermission()) return;
          set({ selectedIndicator: id });
        },

        updateIndicator: (id, updatedData) => {
          if (!checkEditPermission()) return;
          //@ts-ignore
          set((state) => {
            markUnsavedChanges();
            return {
              indicators: state.indicators.map((ind) =>
                ind.id === id ? { ...ind, ...updatedData } : ind
              ),
            };
          });
        },

        clearIndicators: () => {
          if (!checkEditPermission()) return;
          set({ indicators: [] });
        },
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