import { IndicatorStore } from '@/app/(root)/dashboard/strategy-builder/_components/DashboardSidebar/Indicators/types';
import { create } from 'zustand';

export const useIndicatorStore = create<IndicatorStore>((set) => ({
  indicators: [],
  selectedIndicator: null,

  addIndicator: (indicator) =>
    set((state) => ({
      indicators: [...state.indicators, indicator]
    })),

  removeIndicator: (id) =>
    set((state) => ({
      indicators: state.indicators.filter((ind) => ind.id !== id),
      selectedIndicator: state.selectedIndicator === id ? null : state.selectedIndicator
    })),

  setSelectedIndicator: (id) =>
    set({ selectedIndicator: id }),

  updateIndicator: (id, updatedData) =>
    //@ts-ignore
    set((state) => ({
      indicators: state.indicators.map((ind) =>
        ind.id === id ? { ...ind, ...updatedData } : ind
      )
    }))
}));