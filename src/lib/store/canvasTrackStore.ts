import { create } from 'zustand';

const useStore = create((set) => ({
  flowState: null,
  history: [],
  redoStack: [],

  setFlowState: (newState: any) =>
    set((state: { history: any; }) => ({
      flowState: newState,
      history: [...state.history, newState],
      redoStack: [],
    })),

  undo: () =>
    set((state: { history: string | any[]; flowState: any; redoStack: any; }) => {
      if (state.history.length > 1) {
        const newRedoStack = [state.flowState, ...state.redoStack];
        const newHistory = [...state.history];
        const lastState = newHistory.pop();
        return {
          flowState: lastState,
          history: newHistory,
          redoStack: newRedoStack,
        };
      }
      return state;
    }),

  redo: () =>
    set((state: { redoStack: string | any[]; history: any; flowState: any; }) => {
      if (state.redoStack.length > 0) {
        const newHistory = [...state.history, state.flowState];
        const newFlowState = state.redoStack[0];
        const newRedoStack = state.redoStack.slice(1);
        return {
          flowState: newFlowState,
          history: newHistory,
          redoStack: newRedoStack,
        };
      }
      return state;
    }),
}));
