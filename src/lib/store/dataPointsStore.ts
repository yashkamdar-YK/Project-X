import { DataPointsStore } from "@/app/(root)/dashboard/strategy-builder/_components/DashboardSidebar/DatapointDialog/types";
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

export const useDataPointsStore = create<DataPointsStore>()(
  devtools(
    persist(
      (set) => ({
        dataPoints: [],

        setDataPoints: (dataPoints) => {
          if (!checkEditPermission()) return;
          set({ dataPoints });
        },

        addDataPoint: (dataPoint) => {
          if (!checkEditPermission()) return;
          set((state) => {
            markUnsavedChanges();
            return {
              dataPoints: [...state.dataPoints, dataPoint],
            };
          });
        },

        removeDataPoint: (id) => {
          if (!checkEditPermission()) return;
          set((state) => {
            markUnsavedChanges();
            return {
              dataPoints: state.dataPoints.filter((dp) => dp.id !== id),
            };
          });
        },

        updateDataPoint: (id, updatedData) => {
          if (!checkEditPermission()) return;
          set((state) => {
            markUnsavedChanges();
            return {
              dataPoints: state.dataPoints.map((dp) =>
                dp.id === id ? { ...dp, ...updatedData } : dp
              ),
            };
          });
        },

        clearDataPoints: () => {
          if (!checkEditPermission()) return;
          set({ dataPoints: [] });
        },
      }),
      {
        name: "strategy-datapoints-store",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);