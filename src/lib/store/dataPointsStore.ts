
import { DataPointsStore } from '@/app/(root)/dashboard/strategy-builder/_components/DashboardSidebar/DatapointDialog/types';
import { create } from 'zustand';

export const useDataPointsStore = create<DataPointsStore>((set) => ({
  dataPoints: [],

  addDataPoint: (dataPoint) => 
    set((state) => ({
      dataPoints: [...state.dataPoints, dataPoint]
    })),

  removeDataPoint: (id) =>
    set((state) => ({
      dataPoints: state.dataPoints.filter((dp) => dp.id !== id),
    })),

  updateDataPoint: (id, updatedData) =>
    set((state) => ({
      dataPoints: state.dataPoints.map((dp) =>
        dp.id === id ? { ...dp, ...updatedData } : dp
      )
    }))
}));